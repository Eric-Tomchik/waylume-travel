"use client";

import { useEffect, useState } from "react";

type FormState = {
  name: string;
  email: string;
  destination: string;
  dates: string;
  travelers: string;
  budget: string;
  tripType: string;
  notes: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  destination: "",
  dates: "",
  travelers: "2 adults",
  budget: "Not sure yet",
  tripType: "Hotel & resort stay",
  notes: "",
};

/** Enquiry form. Posts to the existing /api/trip-request handler. */
export default function PlanForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const destination = new URLSearchParams(window.location.search).get("destination");
    if (destination) setForm((current) => ({ ...current, destination }));
  }, []);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/trip-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("request failed");
      setForm(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>Full name
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Traveler" />
      </label>
      <label>Email
        <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" />
      </label>
      <label>Where to (or “surprise me”)
        <input required value={form.destination} onChange={(e) => update("destination", e.target.value)} placeholder="Italy, Japan, undecided…" />
      </label>
      <label>Approximate dates
        <input value={form.dates} onChange={(e) => update("dates", e.target.value)} placeholder="Late September, 10 nights" />
      </label>
      <label>Travelers
        <select value={form.travelers} onChange={(e) => update("travelers", e.target.value)}>
          <option>2 adults</option>
          <option>1 adult</option>
          <option>Family with kids</option>
          <option>Group / multi-family</option>
        </select>
      </label>
      <label>Budget range
        <select value={form.budget} onChange={(e) => update("budget", e.target.value)}>
          <option>$5–10k</option>
          <option>$10–20k</option>
          <option>$20–40k</option>
          <option>$40k+</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label className="wide">Trip type
        <select value={form.tripType} onChange={(e) => update("tripType", e.target.value)}>
          <option>Hotel &amp; resort stay</option>
          <option>Honeymoon / anniversary</option>
          <option>Cruise</option>
          <option>Safari / adventure</option>
          <option>Multi-city itinerary</option>
          <option>All-inclusive package</option>
        </select>
      </label>
      <label className="wide">What would make this trip a success?
        <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Anything you're excited about, worried about, or celebrating." />
      </label>
      <p className="form-note">
        By sending this you agree I may contact you about your trip. No spam, ever — and please don&apos;t
        enter payment details here.
      </p>
      {status === "sent" ? (
        <p className="status ok wide" role="status">
          Got it — your request is with me. I&apos;ll reply within one business day.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="status err wide" role="alert">
          That didn&apos;t send. Please email me directly at advisor@waylumetravel.com.
        </p>
      ) : null}
      <div className="wide" style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send my trip request"}
        </button>
      </div>
    </form>
  );
}
