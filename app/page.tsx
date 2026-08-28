"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Compass, Plane, Ship, Sparkles, Waves } from "lucide-react";
import WaylumeLogo from "@/components/WaylumeLogo";

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

export default function Home() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const destination = new URLSearchParams(window.location.search).get("destination");
    if (destination) setForm(current => ({ ...current, destination }));
  }, []);

  async function submitTrip(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    <main>
      <header className="nav shell">
        <a href="#top" className="brand" aria-label="Waylume Travel home">
          <WaylumeLogo cropMark className="brand-mark" alt="Waylume Travel" />
          <span><strong>WAYLUME</strong> <em>TRAVEL</em><small>Independent Agent of Archer</small></span>
        </a>
        <nav>
          <a href="/concierge">AI Concierge</a><a href="/destinations">Destinations</a><a href="/deals">Promotions</a><a href="/smart-planner">Smart Planner</a><a href="#plan">Plan a Trip</a>
        </nav>
        <a className="button small" href="/concierge">Ask Waylume AI</a>
      </header>

      <section id="top" className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="eyebrow"><Sparkles size={16}/> Travel, illuminated.</div>
            <h1>Find your next <span>unforgettable</span> escape.</h1>
            <p className="lead">Tell Waylume AI what you want in plain language, refine the same trip conversationally, and hand a finished planning brief to a real travel advisor for supplier research and booking support.</p>
            <div className="actions"><a className="button" href="/concierge">Ask Waylume AI <ArrowRight size={18}/></a><a className="ghost" href="/smart-planner">Use guided planner</a></div>
            <div className="trust"><span><Check/>Conversational trip planning</span><span><Check/>Supplier-backed options</span><span><Check/>Human advisor support</span></div>
          </div>
          <div className="hero-card">
            <div className="orb"><WaylumeLogo cropMark alt="Waylume Travel compass, air and ocean mark" /></div>
            <div className="floating one">✈ Flights + stays</div><div className="floating two">✦ Curated escapes</div><div className="floating three">⚓ Cruise ideas</div>
          </div>
        </div>
      </section>

      <section id="experiences" className="section shell">
        <div className="section-head"><div><span className="eyebrow">Explore your way</span><h2>One place to start every kind of journey.</h2></div><p>Start with a conversation or browse on your own. When your idea is ready, Waylume turns it into an advisor-ready brief for real supplier research.</p></div>
        <div className="cards">
          <article><Sparkles/><h3>AI Concierge</h3><p>Describe your trip naturally, refine it without restarting, and watch your live planning brief take shape.</p><a href="/concierge">Start a conversation →</a></article>
          <article><Plane/><h3>Flights + Stays</h3><p>Build a city escape, family trip, or flexible flight-and-hotel itinerary.</p><a href="#plan">Request options →</a></article>
          <article><Waves/><h3>Resorts + Cruises</h3><p>Explore beachfront resorts, all-inclusive stays, ocean cruises, and river journeys.</p><a href="/destinations">Browse ideas →</a></article>
          <article><Compass/><h3>Smart Planner</h3><p>Prefer menus over chat? Use the guided planner to narrow the kind of trip that fits you best.</p><a href="/smart-planner">Match my trip →</a></article>
        </div>
      </section>

      <section id="why" className="section band">
        <div className="shell split"><div><span className="eyebrow">Why Waylume</span><h2>AI for discovery. A real person for the details.</h2><p className="lead compact">Use the AI to shape and refine the idea, then let Waylume compare practical supplier options and guide the next step.</p></div><div className="benefits"><div><b>01</b><span><strong>Talk instead of search</strong><small>Describe destination, dates, budget, travelers, lodging, cruise interests, and the experience you want in normal conversation.</small></span></div><div><b>02</b><span><strong>Watch the brief evolve</strong><small>Your preferences stay together while the AI suggests directions and builds an itinerary preview.</small></span></div><div><b>03</b><span><strong>Hand off with context</strong><small>Send the finished brief to Waylume for current supplier pricing, availability, terms, and booking support.</small></span></div></div></div>
      </section>

      <section id="plan" className="section shell plan-grid">
        <div><span className="eyebrow">Plan my trip</span><h2>Prefer a traditional request? Start here.</h2><p className="lead compact">The form remains connected to the Waylume lead pipeline for travelers who already know the basics and want advisor follow-up.</p><div className="notice"><strong>Independent travel advisor disclosure</strong><p>Waylume Travel operates as an Independent Agent of Archer. Website content is for travel discovery and lead generation. Final supplier availability, pricing, booking terms, and confirmations may vary and are provided at the time of booking.</p></div></div>
        <form onSubmit={submitTrip} className="trip-form">
          <label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label>
          <label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
          <label>Destination<input required value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} placeholder="Puerto Rico, Caribbean, Europe..."/></label>
          <label>Travel dates<input value={form.dates} onChange={e=>setForm({...form,dates:e.target.value})} placeholder="Flexible or preferred dates"/></label>
          <label>Travelers<input value={form.travelers} onChange={e=>setForm({...form,travelers:e.target.value})}/></label>
          <label>Approx. budget<input value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} placeholder="$3,000"/></label>
          <label>Trip type<select value={form.tripType} onChange={e=>setForm({...form,tripType:e.target.value})}><option>Vacation Package</option><option>Flight + Hotel</option><option>Resort</option><option>Cruise</option><option>Custom Trip</option></select></label>
          <label className="wide">Anything else?<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Celebration, room preferences, departure airport, cruise line preferences..."/></label>
          <button className="button wide" disabled={status==="loading"}>{status==="loading"?"Sending...":"Send My Trip Request"}<ArrowRight size={18}/></button>
          {status==="success"&&<p className="success wide">Request received. Your trip is officially in motion.</p>}
          {status==="error"&&<p className="error wide">We couldn’t send the request yet. Confirm the Convex deployment is configured, then try again.</p>}
        </form>
      </section>

      <footer><div className="shell footer"><div className="brand"><WaylumeLogo cropMark className="brand-mark" alt="Waylume Travel"/><span><strong>WAYLUME</strong> <em>TRAVEL</em><small>Independent Agent of Archer</small></span></div><p>AI-assisted travel discovery with real advisor support. <a href="/concierge">AI Concierge</a> · <a href="/destinations">Destinations</a> · <a href="/deals">Promotions</a></p><small>© {new Date().getFullYear()} Waylume Travel. All rights reserved.</small></div></footer>
    </main>
  );
}
