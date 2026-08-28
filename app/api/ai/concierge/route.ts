import { NextResponse } from "next/server";
import { allowRequest, requestFingerprint } from "@/lib/rateLimit";

type ChatMessage = { role: "user" | "assistant"; content: string };
type TripProfile = {
  origin?: string;
  destination?: string;
  dates?: string;
  travelers?: number;
  budget?: string;
  tripType?: string;
  pace?: string;
  lodging?: string;
  interests?: string[];
};

type ConciergeResult = {
  reply: string;
  profile: TripProfile;
  recommendations: Array<{
    title: string;
    subtitle: string;
    why: string;
    kind: "destination" | "stay" | "experience" | "flight" | "cruise";
  }>;
  nextPrompts: string[];
  readyForAdvisor: boolean;
  source: "openai" | "demo";
};

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1200;

function clean(value: unknown, max = 160) {
  return String(value ?? "").trim().slice(0, max);
}

function normalizeProfile(value: unknown): TripProfile {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const travelers = Number(input.travelers);
  const interests = Array.isArray(input.interests)
    ? input.interests.map(item => clean(item, 60)).filter(Boolean).slice(0, 8)
    : [];
  return {
    origin: clean(input.origin) || undefined,
    destination: clean(input.destination) || undefined,
    dates: clean(input.dates) || undefined,
    travelers: Number.isFinite(travelers) && travelers > 0 && travelers <= 30 ? Math.round(travelers) : undefined,
    budget: clean(input.budget, 80) || undefined,
    tripType: clean(input.tripType, 80) || undefined,
    pace: clean(input.pace, 60) || undefined,
    lodging: clean(input.lodging, 80) || undefined,
    interests,
  };
}

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-MAX_MESSAGES)
    .map(item => {
      const role = item?.role === "assistant" ? "assistant" : "user";
      const content = clean(item?.content, MAX_MESSAGE_LENGTH);
      return { role, content } as ChatMessage;
    })
    .filter(item => item.content);
}

function inferProfile(profile: TripProfile, message: string): TripProfile {
  const next = { ...profile, interests: [...(profile.interests ?? [])] };
  const text = message.trim();
  const lower = text.toLowerCase();

  const route = text.match(/from\s+([A-Za-z .'-]{2,45})\s+to\s+([A-Za-z .&'-]{2,60})/i);
  if (route) {
    next.origin = clean(route[1], 80);
    next.destination = clean(route[2], 100);
  }

  const destinations = [
    "Puerto Rico", "Cancun", "Cancún", "Jamaica", "Bahamas", "Hawaii", "Orlando", "Las Vegas",
    "Miami", "New York", "Alaska", "Europe", "Caribbean", "Dominican Republic", "Mexico", "Costa Rica",
    "Greece", "Italy", "Spain", "France", "London", "Paris", "Rome", "Tokyo", "Japan"
  ];
  if (!next.destination) {
    const match = destinations.find(destination => lower.includes(destination.toLowerCase()));
    if (match) next.destination = match === "Cancun" ? "Cancún" : match;
  }

  const travelerMatch = lower.match(/(?:for|with|we are|there are)?\s*(\d{1,2})\s*(?:travelers|people|adults|guests|of us|persons)/);
  if (travelerMatch) next.travelers = Math.min(30, Math.max(1, Number(travelerMatch[1])));

  const money = text.match(/\$\s?\d[\d,]*(?:\.\d{2})?/);
  if (money) next.budget = money[0].replace(/\s/g, "");
  else if (/budget|value|cheap|affordable/.test(lower)) next.budget = next.budget ?? "value-focused";
  else if (/luxury|premium|five.star|5.star/.test(lower)) next.budget = next.budget ?? "premium";

  if (/cruise|sailing/.test(lower)) next.tripType = "Cruise";
  else if (/all.inclusive|resort/.test(lower)) next.tripType = "Resort";
  else if (/flight.*hotel|hotel.*flight/.test(lower)) next.tripType = "Flight + Hotel";

  if (/relax|slow|unwind|quiet/.test(lower)) next.pace = "relaxed";
  else if (/packed|busy|adventure|do a lot/.test(lower)) next.pace = "activity-packed";
  else if (/balanced|mix/.test(lower)) next.pace = "balanced";

  const interestMap: Array<[RegExp, string]> = [
    [/beach|ocean|snorkel|water/, "beaches & water"],
    [/food|dining|restaurant|culinary/, "food & dining"],
    [/nightlife|club|bar|party/, "nightlife"],
    [/history|museum|culture|historic/, "culture & history"],
    [/family|kids|children/, "family activities"],
    [/romantic|anniversary|honeymoon/, "romance"],
    [/adventure|hike|zipline|outdoor/, "adventure"],
    [/casino|gaming/, "casinos & entertainment"],
  ];
  for (const [pattern, interest] of interestMap) {
    if (pattern.test(lower) && !next.interests?.includes(interest)) next.interests?.push(interest);
  }
  next.interests = next.interests?.slice(0, 8);

  const dateWords = text.match(/(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[^.!?]{0,45}/i);
  if (dateWords && !next.dates) next.dates = clean(dateWords[0], 100);
  if (/flexible dates|dates are flexible|anytime/.test(lower)) next.dates = "Flexible";

  return next;
}

function fallbackResult(profile: TripProfile, messages: ChatMessage[]): ConciergeResult {
  const last = messages.at(-1)?.content ?? "";
  const inferred = inferProfile(profile, last);
  const destination = inferred.destination;
  const travelers = inferred.travelers;

  if (!destination) {
    return {
      reply: "I can build this with you conversationally. Tell me where you are thinking about going—or just describe the feeling you want, like a warm beach, nightlife, a cruise, family fun, or a culture-heavy escape.",
      profile: inferred,
      recommendations: [
        { title: "Warm + easy", subtitle: "Puerto Rico", why: "Beach time, culture, dining, and flexible trip styles in one destination.", kind: "destination" },
        { title: "Resort reset", subtitle: "Cancún & Riviera Maya", why: "Strong fit for all-inclusive stays and a simple resort-centered vacation.", kind: "destination" },
        { title: "Entertainment", subtitle: "Las Vegas", why: "A compact option for dining, shows, nightlife, and short getaways.", kind: "destination" },
      ],
      nextPrompts: ["I want a warm beach trip", "Help me choose a cruise", "Something romantic", "Family trip ideas"],
      readyForAdvisor: false,
      source: "demo",
    };
  }

  if (!inferred.dates) {
    return {
      reply: `${destination} gives us a strong starting point. What travel window are you considering? Exact dates are great, but “sometime in November” or “flexible” works too.`,
      profile: inferred,
      recommendations: [],
      nextPrompts: ["My dates are flexible", "A long weekend", "About 5 nights", "I need help choosing dates"],
      readyForAdvisor: false,
      source: "demo",
    };
  }

  if (!travelers) {
    return {
      reply: `Great. For ${destination}, how many people are traveling? I’ll use that to shape the pace, lodging direction, and the advisor brief.`,
      profile: inferred,
      recommendations: [],
      nextPrompts: ["2 travelers", "Family of 4", "Solo trip", "Group of 6"],
      readyForAdvisor: false,
      source: "demo",
    };
  }

  if (!inferred.budget) {
    return {
      reply: `I have ${destination}, ${inferred.dates}, and ${travelers} traveler${travelers === 1 ? "" : "s"}. Should I optimize around value, comfortable mid-range, or premium/luxury? A rough total budget works too.`,
      profile: inferred,
      recommendations: [],
      nextPrompts: ["Value-focused", "Comfortable mid-range", "Premium", "Around $3,000 total"],
      readyForAdvisor: false,
      source: "demo",
    };
  }

  const interests = inferred.interests?.length ? inferred.interests.join(", ") : "a balanced mix of local highlights and downtime";
  return {
    reply: `This is taking shape. I’d frame ${destination} as a ${inferred.pace ?? "balanced"} ${inferred.tripType ?? "vacation"} for ${travelers} traveler${travelers === 1 ? "" : "s"}, centered on ${interests}. I can keep refining this with you, or package the brief for a Waylume advisor to research real supplier options.`,
    profile: inferred,
    recommendations: [
      { title: "Stay strategy", subtitle: inferred.lodging ?? "Advisor-selected area or property", why: `Prioritize location and amenities that fit a ${inferred.pace ?? "balanced"} pace and ${inferred.budget} budget.`, kind: "stay" },
      { title: "Signature day", subtitle: "Destination-defining experience", why: `Build one memorable anchor around ${inferred.interests?.[0] ?? "the strongest local experience"}, then keep the rest flexible.`, kind: "experience" },
      { title: "Supplier research", subtitle: "Live options through your advisor", why: "Waylume can use this brief to compare actual supplier availability, terms, and current pricing before anything is booked.", kind: "flight" },
    ],
    nextPrompts: ["Make it more relaxing", "Add nightlife", "Focus on food", "What should I do for 5 days?"],
    readyForAdvisor: true,
    source: "demo",
  };
}

function schema() {
  const nullableString = { type: ["string", "null"] };
  return {
    type: "object",
    properties: {
      reply: { type: "string" },
      profile: {
        type: "object",
        properties: {
          origin: nullableString,
          destination: nullableString,
          dates: nullableString,
          travelers: { type: ["integer", "null"] },
          budget: nullableString,
          tripType: nullableString,
          pace: nullableString,
          lodging: nullableString,
          interests: { type: "array", items: { type: "string" } },
        },
        required: ["origin", "destination", "dates", "travelers", "budget", "tripType", "pace", "lodging", "interests"],
        additionalProperties: false,
      },
      recommendations: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            subtitle: { type: "string" },
            why: { type: "string" },
            kind: { type: "string", enum: ["destination", "stay", "experience", "flight", "cruise"] },
          },
          required: ["title", "subtitle", "why", "kind"],
          additionalProperties: false,
        },
      },
      nextPrompts: { type: "array", maxItems: 4, items: { type: "string" } },
      readyForAdvisor: { type: "boolean" },
    },
    required: ["reply", "profile", "recommendations", "nextPrompts", "readyForAdvisor"],
    additionalProperties: false,
  };
}

function extractOutputText(response: any) {
  for (const item of Array.isArray(response?.output) ? response.output : []) {
    if (item?.type !== "message") continue;
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (content?.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

async function callOpenAI(profile: TripProfile, messages: ChatMessage[], pageContext: string): Promise<ConciergeResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.WAYLUME_AI_MODEL || "gpt-5.4-mini",
      store: false,
      max_output_tokens: 900,
      instructions: [
        "You are Waylume AI, a warm, concise travel-planning concierge for Waylume Travel, an Independent Agent of Archer.",
        "Hold a continuous conversation. Ask only the most useful next question instead of dumping a questionnaire.",
        "Extract and preserve trip facts in the profile. Never invent a user's dates, budget, traveler count, or origin.",
        "You may suggest destinations, trip structures, neighborhoods, experience categories, and planning tradeoffs.",
        "Do not claim live pricing, live availability, private rates, guaranteed savings, confirmed reservations, or that a booking has occurred.",
        "Clearly frame flights, hotels, cruises, packages, and prices as requiring advisor/supplier confirmation unless live supplier data is explicitly provided.",
        "When enough information exists for advisor research, set readyForAdvisor true. Keep reply under 120 words and nextPrompts short.",
      ].join(" "),
      input: [
        {
          role: "user",
          content: [{
            type: "input_text",
            text: `Return JSON matching the requested schema. Current page: ${pageContext || "/"}. Existing trip profile: ${JSON.stringify(profile)}. Conversation: ${JSON.stringify(messages)}`,
          }],
        },
      ],
      text: {
        verbosity: "low",
        format: { type: "json_schema", name: "waylume_concierge", strict: true, schema: schema() },
      },
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) return null;
  const raw = await response.json().catch(() => null);
  const text = extractOutputText(raw);
  if (!text) return null;
  const parsed = JSON.parse(text);
  const normalized = normalizeProfile(parsed.profile);
  return {
    reply: clean(parsed.reply, 1400),
    profile: normalized,
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.slice(0, 3).map((item: any) => ({
          title: clean(item?.title, 80),
          subtitle: clean(item?.subtitle, 120),
          why: clean(item?.why, 320),
          kind: ["destination", "stay", "experience", "flight", "cruise"].includes(item?.kind) ? item.kind : "experience",
        }))
      : [],
    nextPrompts: Array.isArray(parsed.nextPrompts) ? parsed.nextPrompts.slice(0, 4).map((item: unknown) => clean(item, 80)).filter(Boolean) : [],
    readyForAdvisor: Boolean(parsed.readyForAdvisor),
    source: "openai",
  };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 32768) return NextResponse.json({ error: "Request too large" }, { status: 413 });

  const rate = allowRequest(`ai:${requestFingerprint(request)}`, 30, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many concierge messages. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  try {
    const body = await request.json();
    const messages = normalizeMessages(body?.messages);
    const profile = normalizeProfile(body?.profile);
    const pageContext = clean(body?.pageContext, 120);
    if (!messages.length) return NextResponse.json({ error: "A message is required" }, { status: 400 });

    try {
      const ai = await callOpenAI(profile, messages, pageContext);
      if (ai?.reply) return NextResponse.json(ai);
    } catch {
      // The demo conversation engine intentionally takes over when the AI provider is unavailable.
    }

    return NextResponse.json(fallbackResult(profile, messages));
  } catch {
    return NextResponse.json({ error: "Unable to continue the travel conversation" }, { status: 400 });
  }
}
