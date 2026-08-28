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
type Recommendation = {
  title: string;
  subtitle: string;
  why: string;
  kind: "destination" | "stay" | "experience" | "flight" | "cruise";
};
type PreviewDay = { day: number; title: string; details: string };
type ConciergeResult = {
  reply: string;
  profile: TripProfile;
  recommendations: Recommendation[];
  itineraryPreview: PreviewDay[];
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
  return {
    origin: clean(input.origin, 80) || undefined,
    destination: clean(input.destination, 100) || undefined,
    dates: clean(input.dates, 100) || undefined,
    travelers: Number.isFinite(travelers) && travelers > 0 && travelers <= 30 ? Math.round(travelers) : undefined,
    budget: clean(input.budget, 80) || undefined,
    tripType: clean(input.tripType, 80) || undefined,
    pace: clean(input.pace, 60) || undefined,
    lodging: clean(input.lodging, 100) || undefined,
    interests: Array.isArray(input.interests)
      ? input.interests.map(item => clean(item, 60)).filter(Boolean).slice(0, 8)
      : [],
  };
}

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-MAX_MESSAGES)
    .map(item => ({
      role: item?.role === "assistant" ? "assistant" : "user",
      content: clean(item?.content, MAX_MESSAGE_LENGTH),
    } as ChatMessage))
    .filter(item => item.content);
}

function inferProfile(profile: TripProfile, message: string): TripProfile {
  const next: TripProfile = { ...profile, interests: [...(profile.interests ?? [])] };
  const text = message.trim();
  const lower = text.toLowerCase();

  const route = text.match(/from\s+([A-Za-z .'-]{2,45})\s+to\s+([A-Za-z .&'-]{2,60})/i);
  if (route) {
    next.origin = clean(route[1], 80);
    next.destination = clean(route[2], 100);
  }

  const destinations = [
    "Puerto Rico", "Cancún", "Cancun", "Jamaica", "Bahamas", "Hawaii", "Orlando", "Las Vegas",
    "Miami", "New York", "Alaska", "Europe", "Caribbean", "Dominican Republic", "Mexico", "Costa Rica",
    "Greece", "Italy", "Spain", "France", "London", "Paris", "Rome", "Tokyo", "Japan",
  ];
  if (!next.destination) {
    const found = destinations.find(item => lower.includes(item.toLowerCase()));
    if (found) next.destination = found === "Cancun" ? "Cancún" : found;
  }

  const travelerMatch = lower.match(/(?:family|group|party)\s+of\s+(\d{1,2})/) ||
    lower.match(/(\d{1,2})\s*(?:travelers|people|adults|guests|of us|persons)/);
  if (travelerMatch) next.travelers = Math.min(30, Math.max(1, Number(travelerMatch[1])));
  else if (/\bsolo\b|just me|traveling alone/.test(lower)) next.travelers = 1;
  else if (/\bcouple\b|two of us/.test(lower)) next.travelers = 2;

  const money = text.match(/\$\s?\d[\d,]*(?:\.\d{2})?/);
  if (money) next.budget = money[0].replace(/\s/g, "");
  else if (/mid[ -]?range|comfortable/.test(lower)) next.budget = "comfortable mid-range";
  else if (/budget|value|cheap|affordable/.test(lower)) next.budget = "value-focused";
  else if (/luxury|premium|five.star|5.star/.test(lower)) next.budget = "premium";

  if (/cruise|sailing/.test(lower)) next.tripType = "Cruise";
  else if (/all[ -]?inclusive|resort/.test(lower)) next.tripType = "Resort";
  else if (/flight.*hotel|hotel.*flight/.test(lower)) next.tripType = "Flight + Hotel";
  else if (/road trip/.test(lower)) next.tripType = "Road Trip";

  if (/relax|slow|unwind|quiet/.test(lower)) next.pace = "relaxed";
  else if (/packed|busy|adventure|do a lot/.test(lower)) next.pace = "activity-packed";
  else if (/balanced|mix/.test(lower)) next.pace = "balanced";

  if (/adults?[ -]?only/.test(lower)) next.lodging = "adults-only";
  else if (/all[ -]?inclusive/.test(lower)) next.lodging = "all-inclusive resort";
  else if (/boutique/.test(lower)) next.lodging = "boutique hotel";
  else if (/luxury hotel|five.star hotel|5.star hotel/.test(lower)) next.lodging = "luxury hotel";
  else if (/vacation rental|villa|airbnb/.test(lower)) next.lodging = "vacation rental / villa";

  const interestMap: Array<[RegExp, string]> = [
    [/beach|ocean|snorkel|water/, "beaches & water"],
    [/food|dining|restaurant|culinary/, "food & dining"],
    [/nightlife|club|bar|party/, "nightlife"],
    [/history|museum|culture|historic/, "culture & history"],
    [/family|kids|children/, "family activities"],
    [/romantic|anniversary|honeymoon/, "romance"],
    [/adventure|hike|zipline|outdoor/, "adventure"],
    [/casino|gaming/, "casinos & entertainment"],
    [/spa|wellness|massage/, "wellness & spa"],
  ];
  for (const [pattern, interest] of interestMap) {
    if (pattern.test(lower) && !next.interests?.includes(interest)) next.interests?.push(interest);
  }
  next.interests = next.interests?.slice(0, 8);

  const dateWords = text.match(/(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[^.!?]{0,45}/i);
  if (dateWords) next.dates = clean(dateWords[0], 100);
  else if (/flexible dates|dates are flexible|anytime/.test(lower)) next.dates = "Flexible";
  else if (/long weekend/.test(lower)) next.dates = "Long weekend (dates flexible)";
  else {
    const nights = lower.match(/(?:about\s+)?(\d{1,2})\s+nights?/);
    if (nights) next.dates = `${nights[1]} nights (dates flexible)`;
  }

  return next;
}

function preview(profile: TripProfile): PreviewDay[] {
  if (!profile.destination || !profile.dates || !profile.travelers || !profile.budget) return [];
  const pace = profile.pace ?? "balanced";
  return [
    { day: 1, title: `Arrive + settle into ${profile.destination}`, details: `Easy arrival, check-in, and a ${pace} first evening with room for supplier-confirmed timing.` },
    { day: 2, title: "Signature experience", details: `Anchor the trip around ${profile.interests?.[0] ?? "a destination-defining experience"}, then keep the rest flexible.` },
    { day: 3, title: "Explore your way", details: `Blend ${profile.interests?.[1] ?? "local discovery"} with downtime, dining, or resort time based on your preferences.` },
  ];
}

function fallbackResult(profile: TripProfile, messages: ChatMessage[]): ConciergeResult {
  const inferred = inferProfile(profile, messages.at(-1)?.content ?? "");
  if (!inferred.destination) return {
    reply: inferred.tripType === "Cruise"
      ? "Absolutely. What kind of cruise sounds right—Caribbean beaches, Alaska scenery, Europe, a river cruise, or are you open to ideas?"
      : "Tell me the trip you have in mind in your own words. A destination is great, but you can also say “warm beach in November,” “romantic long weekend,” or “family cruise.” I’ll shape it with you one question at a time.",
    profile: inferred,
    recommendations: inferred.tripType === "Cruise" ? [
      { title: "Warm-weather sailing", subtitle: "Caribbean cruise", why: "Easy starting point for beaches, resort-style ships, and multiple island stops.", kind: "cruise" },
      { title: "Scenic journey", subtitle: "Alaska cruise", why: "Strong fit for scenery, wildlife, and destination-focused days ashore.", kind: "cruise" },
      { title: "Culture + variety", subtitle: "Mediterranean cruise", why: "Useful when you want several historic destinations in one trip.", kind: "cruise" },
    ] : [
      { title: "Warm + flexible", subtitle: "Puerto Rico", why: "Beach time, culture, dining, and several trip styles in one destination.", kind: "destination" },
      { title: "Resort reset", subtitle: "Cancún & Riviera Maya", why: "Strong for all-inclusive stays and a simple resort-centered vacation.", kind: "destination" },
      { title: "Entertainment", subtitle: "Las Vegas", why: "Compact option for dining, shows, nightlife, and short getaways.", kind: "destination" },
    ],
    itineraryPreview: [],
    nextPrompts: inferred.tripType === "Cruise" ? ["Caribbean cruise", "Alaska cruise", "Mediterranean cruise", "River cruise"] : ["Warm beach getaway", "Help me choose a cruise", "Romantic weekend", "Family vacation"],
    readyForAdvisor: false,
    source: "demo",
  };
  if (!inferred.dates) return {
    reply: `${inferred.destination} is a strong start. What travel window are you considering? Exact dates, a month, a long weekend, or “flexible” all work.`,
    profile: inferred, recommendations: [], itineraryPreview: [],
    nextPrompts: ["My dates are flexible", "A long weekend", "About 5 nights", "Sometime in November"],
    readyForAdvisor: false, source: "demo",
  };
  if (!inferred.travelers) return {
    reply: `How many people are traveling to ${inferred.destination}? I’ll use that to shape lodging, pace, and the advisor brief.`,
    profile: inferred, recommendations: [], itineraryPreview: [],
    nextPrompts: ["2 travelers", "Family of 4", "Solo trip", "Group of 6"],
    readyForAdvisor: false, source: "demo",
  };
  if (!inferred.budget) return {
    reply: `I have ${inferred.destination}, ${inferred.dates}, and ${inferred.travelers} traveler${inferred.travelers === 1 ? "" : "s"}. Should I optimize around value, comfortable mid-range, premium, or a rough total budget?`,
    profile: inferred, recommendations: [], itineraryPreview: [],
    nextPrompts: ["Value-focused", "Comfortable mid-range", "Premium", "Around $3,000 total"],
    readyForAdvisor: false, source: "demo",
  };

  const interestText = inferred.interests?.length ? inferred.interests.join(", ") : "a balanced mix of highlights and downtime";
  return {
    reply: `Your trip is taking shape. I’d frame ${inferred.destination} as a ${inferred.pace ?? "balanced"} ${inferred.tripType ?? "vacation"} for ${inferred.travelers} traveler${inferred.travelers === 1 ? "" : "s"}, centered on ${interestText}. Keep refining it here, or send the brief to Waylume for real supplier research and pricing.`,
    profile: inferred,
    recommendations: [
      { title: "Stay direction", subtitle: inferred.lodging ?? "Advisor-selected area", why: `Prioritize location and amenities that fit a ${inferred.pace ?? "balanced"} pace and ${inferred.budget} budget.`, kind: "stay" },
      { title: "Trip anchor", subtitle: "Signature experience", why: `Build one memorable day around ${inferred.interests?.[0] ?? "the strongest local experience"}.`, kind: "experience" },
      { title: "Real options", subtitle: "Waylume supplier research", why: "Your advisor can use this brief to compare current supplier availability, terms, and pricing before anything is booked.", kind: inferred.tripType === "Cruise" ? "cruise" : "flight" },
    ],
    itineraryPreview: preview(inferred),
    nextPrompts: ["Make it more relaxing", "Add nightlife", "Focus on food", "Upgrade the hotel"],
    readyForAdvisor: true,
    source: "demo",
  };
}

function schema() {
  const nullableString = { type: ["string", "null"] };
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      reply: { type: "string" },
      profile: {
        type: "object",
        additionalProperties: false,
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
      },
      recommendations: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" }, subtitle: { type: "string" }, why: { type: "string" },
            kind: { type: "string", enum: ["destination", "stay", "experience", "flight", "cruise"] },
          },
          required: ["title", "subtitle", "why", "kind"],
        },
      },
      itineraryPreview: {
        type: "array",
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          properties: { day: { type: "integer" }, title: { type: "string" }, details: { type: "string" } },
          required: ["day", "title", "details"],
        },
      },
      nextPrompts: { type: "array", maxItems: 4, items: { type: "string" } },
      readyForAdvisor: { type: "boolean" },
    },
    required: ["reply", "profile", "recommendations", "itineraryPreview", "nextPrompts", "readyForAdvisor"],
  };
}

function extractOutputText(response: unknown) {
  const raw = response as { output_text?: unknown; output?: unknown } | null;
  if (typeof raw?.output_text === "string") return raw.output_text;
  if (!Array.isArray(raw?.output)) return "";
  for (const item of raw.output as Array<Record<string, unknown>>) {
    if (item?.type !== "message" || !Array.isArray(item.content)) continue;
    for (const part of item.content as Array<Record<string, unknown>>) {
      if (part?.type === "output_text" && typeof part.text === "string") return part.text;
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
      model: process.env.WAYLUME_AI_MODEL || "gpt-5.6-luna",
      store: false,
      reasoning: { effort: "none" },
      max_output_tokens: 1100,
      instructions: [
        "You are Waylume AI, a warm, concise travel-planning concierge for Waylume Travel, an Independent Agent of Archer.",
        "Make the experience conversational like a skilled travel advisor: ask only the single most useful next question, preserve prior facts, and let the traveler refine naturally without restarting.",
        "Extract and preserve trip facts in profile. Never invent dates, budget, traveler count, origin, live prices, availability, private rates, guaranteed savings, reservations, or bookings.",
        "You may recommend destinations, trip structures, neighborhoods, experience categories, lodging styles, cruise directions, and planning tradeoffs.",
        "When enough information exists, include a short itineraryPreview and set readyForAdvisor true.",
        "Final flights, hotels, cruises, packages, prices, availability, payment, and booking terms require Waylume advisor/supplier confirmation.",
        "Keep reply under 120 words and nextPrompts very short.",
      ].join(" "),
      input: [{
        role: "user",
        content: [{
          type: "input_text",
          text: `Return JSON matching the schema. Current page: ${pageContext || "/"}. Existing profile: ${JSON.stringify(profile)}. Conversation: ${JSON.stringify(messages)}`,
        }],
      }],
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
  const kinds = ["destination", "stay", "experience", "flight", "cruise"];

  return {
    reply: clean(parsed.reply, 1400),
    profile: normalized,
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.slice(0, 3).map((item: Record<string, unknown>) => ({
          title: clean(item?.title, 80),
          subtitle: clean(item?.subtitle, 120),
          why: clean(item?.why, 320),
          kind: kinds.includes(String(item?.kind)) ? String(item.kind) as Recommendation["kind"] : "experience",
        }))
      : [],
    itineraryPreview: Array.isArray(parsed.itineraryPreview)
      ? parsed.itineraryPreview.slice(0, 5).map((item: Record<string, unknown>, index: number) => ({
          day: Number(item?.day) || index + 1,
          title: clean(item?.title, 120),
          details: clean(item?.details, 420),
        }))
      : [],
    nextPrompts: Array.isArray(parsed.nextPrompts)
      ? parsed.nextPrompts.slice(0, 4).map((item: unknown) => clean(item, 80)).filter(Boolean)
      : [],
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
      // Demo engine intentionally takes over when the configured AI provider is unavailable.
    }

    return NextResponse.json(fallbackResult(profile, messages));
  } catch {
    return NextResponse.json({ error: "Unable to continue the travel conversation" }, { status: 400 });
  }
}
