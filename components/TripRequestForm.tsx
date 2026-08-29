"use client";

import { ArrowRight } from "lucide-react";
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

const emptyForm: FormState = {
  name: "",
  email: "",
  destination: "",
  dates: "",
  travelers: "2",
  budget: "",
  tripType: "Vacation Package",
  notes: "",
};

export default function TripRequestForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const destination = new URLSearchParams(window.location.search).get("destination");
    if (destination) setForm((current) => ({ ...current, destination }));
  }, []);

  async function submitTrip(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/trip-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Unable to submit request");
      setForm(emptyForm);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submitTrip} className="trip-form inspiration-form">
      <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>
      <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
      <label>Destination or region<input required value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} placeholder="Puerto Rico, Caribbean, Europe..." /></label>
      <label>Travel dates<input value={form.dates} onChange={(event) => setForm({ ...form, dates: event.target.value })} placeholder="Flexible or preferred dates" /></label>
      <label>Travelers<input value={form.travelers} onChange={(event) => setForm({ ...form, travelers: event.target.value })} /></label>
      <label>Planning budget<input value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} placeholder="Optional planning guidance" /></label>
      <label>Trip type<select value={form.tripType} onChange={(event) => setForm({ ...form, tripType: event.target.value })}><option>Vacation Package</option><option>Flight + Hotel</option><option>All-Inclusive Resort</option><option>Cruise</option><option>Custom Trip</option></select></label>
      <label className="wide">What should the trip feel like?<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Celebration, pace, culture, nightlife, room preferences, departure airport, cruise style..." /></label>
      <button className="button wide" disabled={status === "loading"}>{status === "loading" ? "Sending..." : "Send for Advisor Research"}<ArrowRight size={18} /></button>
      {status === "success" && <p className="success wide" role="status">Your trip direction is ready for Waylume advisor research.</p>}
      {status === "error" && <p className="error wide" role="alert">We could not send the request yet. Please try again shortly.</p>}
    </form>
  );
}
