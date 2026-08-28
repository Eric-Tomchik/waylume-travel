"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Compass,
  Loader2,
  MapPin,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";

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

type ConciergeResponse = {
  reply: string;
  profile: TripProfile;
  recommendations: Recommendation[];
  nextPrompts: string[];
  readyForAdvisor: boolean;
  source: "openai" | "demo";
};

type Props = { mode?: "floating" | "full" };

const STARTER: ChatMessage = {
  role: "assistant",
  content: "Where are we going? Tell me a destination, a rough idea, or even just the kind of trip you want. I’ll shape it with you one question at a time.",
};

const STARTER_PROMPTS = ["Warm beach getaway", "Help me choose a cruise", "Romantic long weekend", "Family vacation ideas"];
const STORAGE_KEY = "waylume-ai-concierge-v1";

export default function AiConcierge({ mode = "floating" }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(mode === "full");
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER]);
  const [profile, setProfile] = useState<TripProfile>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [nextPrompts, setNextPrompts] = useState<string[]>(STARTER_PROMPTS);
  const [readyForAdvisor, setReadyForAdvisor] = useState(false);
  const [source, setSource] = useState<"openai" | "demo">("demo");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "" });
  const [handoffStatus, setHandoffStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [handoffMessage, setHandoffMessage] = useState("");
  const messagesEnd = useRef<HTMLDivElement | null>(null);

  const blockedPath = pathname?.startsWith("/admin") || pathname?.startsWith("/portal") || pathname === "/concierge";

  useEffect(() => {
    if (mode === "full") setOpen(true);
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.messages) && parsed.messages.length) setMessages(parsed.messages.slice(-18));
        if (parsed.profile && typeof parsed.profile === "object") setProfile(parsed.profile);
        if (Array.isArray(parsed.recommendations)) setRecommendations(parsed.recommendations.slice(0, 3));
        if (Array.isArray(parsed.nextPrompts) && parsed.nextPrompts.length) setNextPrompts(parsed.nextPrompts.slice(0, 4));
        setReadyForAdvisor(Boolean(parsed.readyForAdvisor));
        if (parsed.source === "openai") setSource("openai");
      }
    } catch {
      // Session persistence is optional.
    } finally {
      setHydrated(true);
    }
  }, [mode]);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages, profile, recommendations, nextPrompts, readyForAdvisor, source }),
    );
  }, [hydrated, messages, profile, recommendations, nextPrompts, readyForAdvisor, source]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading, showHandoff]);

  const briefItems = useMemo(
    () => [
      { icon: MapPin, label: "Destination", value: profile.destination },
      { icon: CalendarDays, label: "Dates", value: profile.dates },
      { icon: Users, label: "Travelers", value: profile.travelers ? String(profile.travelers) : undefined },
      { icon: WalletCards, label: "Budget", value: profile.budget },
    ],
    [profile],
  );

  async function sendMessage(text = input) {
    const value = text.trim().slice(0, 1200);
    if (!value || loading) return;
    const outgoing = [...messages, { role: "user", content: value } as ChatMessage].slice(-12);
    setMessages(outgoing);
    setInput("");
    setLoading(true);
    setShowHandoff(false);
    setHandoffStatus("idle");

    try {
      const response = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: outgoing, profile, pageContext: pathname }),
      });
      const data = (await response.json()) as ConciergeResponse & { error?: string };
      if (!response.ok || !data.reply) throw new Error(data.error || "Unable to continue the conversation");
      setProfile(data.profile || {});
      setRecommendations(data.recommendations || []);
      setNextPrompts(data.nextPrompts?.length ? data.nextPrompts : STARTER_PROMPTS);
      setReadyForAdvisor(Boolean(data.readyForAdvisor));
      setSource(data.source === "openai" ? "openai" : "demo");
      setMessages(current => [...current, { role: "assistant", content: data.reply }].slice(-18));
    } catch {
      setMessages(current => [
        ...current,
        {
          role: "assistant",
          content: "I hit a connection issue, but your trip notes are still here. Try that again, or send the current brief to a Waylume advisor.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    setMessages([STARTER]);
    setProfile({});
    setRecommendations([]);
    setNextPrompts(STARTER_PROMPTS);
    setReadyForAdvisor(false);
    setSource("demo");
    setInput("");
    setShowHandoff(false);
    setHandoffStatus("idle");
    sessionStorage.removeItem(STORAGE_KEY);
  }

  async function submitHandoff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact.name.trim() || !contact.email.trim()) return;
    setHandoffStatus("loading");
    setHandoffMessage("");

    const lastAssistant = [...messages].reverse().find(message => message.role === "assistant")?.content ?? "";
    const notes = [
      "AI-assisted Waylume planning brief.",
      profile.origin ? `Origin: ${profile.origin}.` : "",
      profile.pace ? `Pace: ${profile.pace}.` : "",
      profile.lodging ? `Lodging preference: ${profile.lodging}.` : "",
      profile.interests?.length ? `Interests: ${profile.interests.join(", ")}.` : "",
      lastAssistant ? `Latest planning summary: ${lastAssistant}` : "",
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 1900);

    try {
      const response = await fetch("/api/trip-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          destination: profile.destination || "Flexible / open to recommendations",
          dates: profile.dates || "Flexible",
          travelers: String(profile.travelers || 2),
          budget: profile.budget || "Not specified",
          tripType: profile.tripType || "AI-assisted custom trip",
          notes,
          website: "",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to send trip brief");
      setHandoffStatus("success");
      setHandoffMessage("Your planning brief is in the Waylume advisor pipeline.");
    } catch (error) {
      setHandoffStatus("error");
      setHandoffMessage(error instanceof Error ? error.message : "Advisor handoff is not configured yet.");
    }
  }

  if (mode === "floating" && blockedPath) return null;

  const content = (
    <div className={`ai-concierge ${mode === "full" ? "ai-concierge-full" : ""}`}>
      <header className="ai-concierge-header">
        <div className="ai-avatar"><Sparkles size={19} /></div>
        <div>
          <strong>Waylume AI</strong>
          <span><i /> Travel concierge · {source === "openai" ? "AI connected" : "interactive demo"}</span>
        </div>
        <div className="ai-header-actions">
          <button type="button" onClick={resetConversation} aria-label="Start over" title="Start over"><RotateCcw size={16} /></button>
          {mode === "floating" && <button type="button" onClick={() => setOpen(false)} aria-label="Close concierge"><X size={18} /></button>}
        </div>
      </header>

      <div className="ai-concierge-body">
        <div className="ai-chat-column">
          <div className="ai-chat-stream" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`ai-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.role === "assistant" && <span className="ai-mini-avatar"><Bot size={15} /></span>}
                <div>{message.content}</div>
              </div>
            ))}
            {loading && (
              <div className="ai-message assistant">
                <span className="ai-mini-avatar"><Bot size={15} /></span>
                <div className="ai-typing"><i /><i /><i /></div>
              </div>
            )}

            {!loading && recommendations.length > 0 && (
              <div className="ai-recommendations">
                {recommendations.map((item, index) => (
                  <button key={`${item.title}-${index}`} type="button" onClick={() => sendMessage(`Tell me more about ${item.subtitle}`)}>
                    <small>{item.title}</small>
                    <strong>{item.subtitle}</strong>
                    <span>{item.why}</span>
                    <ArrowRight size={15} />
                  </button>
                ))}
              </div>
            )}

            {!loading && nextPrompts.length > 0 && (
              <div className="ai-quick-prompts">
                {nextPrompts.map(prompt => <button type="button" key={prompt} onClick={() => sendMessage(prompt)}>{prompt}</button>)}
              </div>
            )}

            {showHandoff && (
              <form className="ai-handoff" onSubmit={submitHandoff}>
                <div><Sparkles size={17} /><span><strong>Send this trip to a real advisor</strong><small>Your conversation becomes a structured planning brief. Final supplier pricing and booking still require confirmation.</small></span></div>
                <label>Name<input required value={contact.name} onChange={event => setContact(current => ({ ...current, name: event.target.value }))} placeholder="Your name" /></label>
                <label>Email<input required type="email" value={contact.email} onChange={event => setContact(current => ({ ...current, email: event.target.value }))} placeholder="you@example.com" /></label>
                <button className="button" disabled={handoffStatus === "loading"}>{handoffStatus === "loading" ? <Loader2 className="ai-spin" size={17} /> : <Send size={16} />} Send planning brief</button>
                {handoffMessage && <p className={handoffStatus === "success" ? "ai-handoff-success" : "ai-handoff-error"}>{handoffMessage}</p>}
              </form>
            )}
            <div ref={messagesEnd} />
          </div>

          <div className="ai-composer-wrap">
            {readyForAdvisor && !showHandoff && (
              <button type="button" className="ai-advisor-cta" onClick={() => setShowHandoff(true)}>
                <CheckCircle2 size={16} /> Ready for real options? Send this plan to my advisor <ArrowRight size={15} />
              </button>
            )}
            <form className="ai-composer" onSubmit={event => { event.preventDefault(); void sendMessage(); }}>
              <textarea
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                maxLength={1200}
                rows={1}
                placeholder="Ask Waylume anything about your trip…"
              />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Send message"><Send size={18} /></button>
            </form>
            <small className="ai-disclaimer">Planning guidance only. Live supplier pricing, availability, terms, and bookings require confirmation.</small>
          </div>
        </div>

        {mode === "full" && (
          <aside className="ai-brief-panel">
            <span className="eyebrow"><Compass size={15} /> Live trip brief</span>
            <h2>Your trip takes shape as you chat.</h2>
            <p>Waylume AI keeps the important details organized so you can refine the same trip naturally instead of restarting a search.</p>
            <div className="ai-brief-grid">
              {briefItems.map(({ icon: Icon, label, value }) => (
                <article className={value ? "filled" : ""} key={label}>
                  <Icon size={18} />
                  <span><small>{label}</small><strong>{value || "Not set yet"}</strong></span>
                </article>
              ))}
            </div>
            {(profile.tripType || profile.pace || profile.interests?.length) && (
              <div className="ai-preference-card">
                <small>Trip preferences</small>
                {profile.tripType && <span>{profile.tripType}</span>}
                {profile.pace && <span>{profile.pace} pace</span>}
                {profile.interests?.map(item => <span key={item}>{item}</span>)}
              </div>
            )}
            <div className="ai-human-card">
              <MessageCircle size={20} />
              <div><strong>AI discovery. Human follow-through.</strong><p>When the brief is ready, Waylume can move it into the advisor workflow for actual supplier research and booking support.</p></div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );

  if (mode === "full") return content;

  return (
    <>
      {!open && (
        <button className="ai-launcher" type="button" onClick={() => setOpen(true)}>
          <span><Sparkles size={19} /></span><b>Ask Waylume AI</b><small>Plan a trip</small>
        </button>
      )}
      {open && <div className="ai-floating-wrap">{content}</div>}
    </>
  );
}
