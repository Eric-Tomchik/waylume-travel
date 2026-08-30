"use client";

import { useEffect, useState } from "react";
import { useShortlist } from "@/components/wl/Interactive";

type FormState = {
  name: string;
  email: string;
  phone: string;
  contactPreference: string;
  bestTime: string;
  destination: string;
  dates: string;
  travelers: string;
  tripType: string;
  heardAbout: string;
  notes: string;
  marketingOptIn: boolean;
  website: string; // honeypot
};

const EMPTY: FormState = {
  name: "", email: "", phone: "", contactPreference: "Email", bestTime: "Anytime",
  destination: "", dates: "", travelers: "2 adults", tripType: "Hotel & resort stay",
  heardAbout: "", notes: "", marketingOptIn: true, website: "",
};

const TRIP_TYPES = [
  "Hotel & resort stay", "Honeymoon / anniversary", "Cruise", "Safari / adventure",
  "Multi-city itinerary", "All-inclusive package", "Family trip", "Group / celebration",
  "Not sure yet",
];

const HEARD = ["", "Google search", "Instagram or Facebook", "A friend referred me", "I know Eric", "Fora", "Somewhere else"];

/**
 * Contact / intake form. Posts to /api/trip-request, which writes to the CRM and
 * fires the advisor alert plus the traveler acknowledgement.
 */
export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const { items, clear } = useShortlist();

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("destination");
    const seed = requested || items.join(", ");
    if (seed) setForm((current) => (current.destination ? current : { ...current, destination: seed }));
  }, [items]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/trip-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { error?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to send that right now.");
      setForm(EMPTY);
      clear();
      setStatus("sent");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form" style={{ display: "block", textAlign: "center", padding: 44 }}>
        <div className="eyebrow">Message received</div>
        <h2 style={{ fontSize: 34, margin: "14px 0 12px" }}>Thank you — it&apos;s with me.</h2>
        <p className="lead" style={{ margin: "0 auto", maxWidth: "46ch" }}>
          You&apos;ll get a confirmation email in a moment, and a personal reply from me within one
          business day. If it&apos;s urgent, email{" "}
          <a href="mailto:eric.tomchik@fora.travel" style={{ color: "var(--aqua)" }}>eric.tomchik@fora.travel</a>.
        </p>
        <button type="button" className="btn ghost" style={{ marginTop: 26 }} onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>Full name *
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Traveler" autoComplete="name" />
      </label>
      <label>Email *
        <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" autoComplete="email" />
      </label>
      <label>Phone
        <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(615) 555-0134" autoComplete="tel" />
      </label>
      <label>Preferred contact
        <select value={form.contactPreference} onChange={(e) => update("contactPreference", e.target.value)}>
          <option>Email</option>
          <option>Phone call</option>
          <option>Text message</option>
        </select>
      </label>
      <label>Best time to reach you
        <select value={form.bestTime} onChange={(e) => update("bestTime", e.target.value)}>
          <option>Anytime</option>
          <option>Mornings</option>
          <option>Afternoons</option>
          <option>Evenings</option>
          <option>Weekends</option>
        </select>
      </label>
      <label>Where to (or “surprise me”) *
        <input required value={form.destination} onChange={(e) => update("destination", e.target.value)} placeholder="Italy, Japan, undecided…" />
      </label>
      <label>Approximate dates
        <input value={form.dates} onChange={(e) => update("dates", e.target.value)} placeholder="Late September, 10 nights" />
      </label>
      <label>Travelers
        <select value={form.travelers} onChange={(e) => update("travelers", e.target.value)}>
          <option>1 adult</option>
          <option>2 adults</option>
          <option>Family with kids</option>
          <option>Group / multi-family</option>
        </select>
      </label>
      <label>Trip type
        <select value={form.tripType} onChange={(e) => update("tripType", e.target.value)}>
          {TRIP_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
      <label>How did you hear about me?
        <select value={form.heardAbout} onChange={(e) => update("heardAbout", e.target.value)}>
          {HEARD.map((option) => <option key={option} value={option}>{option || "Prefer not to say"}</option>)}
        </select>
      </label>

      <label className="wide">What would make this trip a success?
        <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)}
          placeholder="Anything you're excited about, worried about, or celebrating — plus room preferences, departure airport, pace." />
      </label>

      {/* honeypot: real people never see or fill this */}
      <label className="sr-only" aria-hidden style={{ position: "absolute", left: "-9999px" }}>
        Leave this empty
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} />
      </label>

      <label className="wide consent">
        <input type="checkbox" checked={form.marketingOptIn} onChange={(e) => update("marketingOptIn", e.target.checked)} />
        <span>Send me occasional travel news, promotions and destination ideas. No spam, unsubscribe anytime.</span>
      </label>

      <p className="form-note">
        By sending this you agree I may contact you about your trip. Please don&apos;t enter payment
        details here — payment always happens through a Fora-approved or supplier-secure workflow.
      </p>

      {status === "error" ? (
        <p className="status err wide" role="alert">
          {message} You can always email me directly at advisor@waylumetravel.com.
        </p>
      ) : null}

      <div className="wide" style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send my details"}
        </button>
      </div>
    </form>
  );
}
