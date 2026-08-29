"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Compass, Plane, Sparkles, Waves } from "lucide-react";
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
          <span><strong>WAYLUME</strong> <em>TRAVEL</em><small>Independent Agent of Fora Travel, Inc.</small></span>
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
            <p className="lead">Use Waylume AI to explore what your trip could include—from destinations and hotel styles to flight approaches, cruises, and experiences. When the plan feels right, send the brief to a real advisor for current supplier research and final pricing.</p>
            <div className="actions"><a className="button" href="/concierge">Explore with Waylume AI <ArrowRight size={18}/></a><a className="ghost" href="/smart-planner">Use guided planner</a></div>
            <div className="trust"><span><Check/>Conversational trip discovery</span><span><Check/>Advisor-researched supplier options</span><span><Check/>Human booking support</span></div>
          </div>
          <div className="hero-card">
            <div className="orb"><WaylumeLogo cropMark alt="Waylume Travel compass, air and ocean mark" /></div>
            <div className="floating one">✈ Flight possibilities</div><div className="floating two">✦ Hotel + resort ideas</div><div className="floating three">⚓ Cruise directions</div>
          </div>
        </div>
      </section>

      <section id="experiences" className="section shell">
        <div className="section-head"><div><span className="eyebrow">Explore your way</span><h2>See what is possible before the advisor search begins.</h2></div><p>Start with a conversation or browse on your own. Waylume helps shape the possibilities into a structured trip brief, then your advisor researches current supplier options manually.</p></div>
        <div className="cards">
          <article><Sparkles/><h3>AI Concierge</h3><p>Describe your trip naturally and explore possible destinations, stays, transportation, cruises, and experiences without pretending the AI has live rates.</p><a href="/concierge">Start a conversation →</a></article>
          <article><Plane/><h3>Flights + Stays</h3><p>Explore how a city escape, family trip, or flight-and-hotel itinerary could be structured before current options are researched.</p><a href="#plan">Send trip parameters →</a></article>
          <article><Waves/><h3>Resorts + Cruises</h3><p>Explore beachfront resorts, all-inclusive styles, ocean cruises, river journeys, and other vacation directions.</p><a href="/destinations">Browse possibilities →</a></article>
          <article><Compass/><h3>Smart Planner</h3><p>Prefer menus over chat? Use the guided planner to narrow the kind of trip that fits you best.</p><a href="/smart-planner">Match my trip →</a></article>
        </div>
      </section>

      <section id="why" className="section band">
        <div className="shell split"><div><span className="eyebrow">Why Waylume</span><h2>AI for possibilities. A real advisor for supplier research.</h2><p className="lead compact">Use the AI to discover and refine the trip you want. Once your parameters are clear, Waylume manually researches current supplier availability, final pricing, terms, and booking choices.</p></div><div className="benefits"><div><b>01</b><span><strong>Explore naturally</strong><small>Talk through destination, dates, travelers, comfort level, lodging, cruise interests, flights, and experiences in normal conversation.</small></span></div><div><b>02</b><span><strong>Build one clear trip brief</strong><small>Your preferences stay together while the AI suggests possibilities and shows how the itinerary could take shape.</small></span></div><div><b>03</b><span><strong>Advisor researches the real options</strong><small>Waylume uses your completed brief to manually research current supplier availability and final pricing before presenting bookable choices.</small></span></div></div></div>
      </section>

      <section id="plan" className="section shell plan-grid">
        <div><span className="eyebrow">Plan my trip</span><h2>Already know what you want? Send the parameters directly.</h2><p className="lead compact">The traditional form sends your trip details into the same Waylume advisor pipeline for manual supplier research and follow-up.</p><div className="notice"><strong>Independent travel advisor disclosure</strong><p>Waylume Travel operates as an Independent Agent of Fora Travel, Inc. Website content is for travel discovery and lead generation. Final supplier availability, pricing, booking terms, and confirmations may vary and are provided at the time of booking.</p></div></div>
        <form onSubmit={submitTrip} className="trip-form">
          <label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label>
          <label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
          <label>Destination<input required value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} placeholder="Puerto Rico, Caribbean, Europe..."/></label>
          <label>Travel dates<input value={form.dates} onChange={e=>setForm({...form,dates:e.target.value})} placeholder="Flexible or preferred dates"/></label>
          <label>Travelers<input value={form.travelers} onChange={e=>setForm({...form,travelers:e.target.value})}/></label>
          <label>Planning budget<input value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} placeholder="Optional guidance, e.g. $3,000"/></label>
          <label>Trip type<select value={form.tripType} onChange={e=>setForm({...form,tripType:e.target.value})}><option>Vacation Package</option><option>Flight + Hotel</option><option>Resort</option><option>Cruise</option><option>Custom Trip</option></select></label>
          <label className="wide">Anything else?<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Celebration, room preferences, departure airport, cruise line preferences..."/></label>
          <button className="button wide" disabled={status==="loading"}>{status==="loading"?"Sending...":"Send My Trip Request"}<ArrowRight size={18}/></button>
          {status==="success"&&<p className="success wide">Request received. Your trip details are ready for advisor research.</p>}
          {status==="error"&&<p className="error wide">We couldn’t send the request yet. Confirm the Convex deployment is configured, then try again.</p>}
        </form>
      </section>

      <footer><div className="shell footer"><div className="brand"><WaylumeLogo cropMark className="brand-mark" alt="Waylume Travel"/><span><strong>WAYLUME</strong> <em>TRAVEL</em><small>Independent Agent of Fora Travel, Inc.</small></span></div><p>AI-assisted trip discovery with advisor-researched supplier options. <a href="/concierge">AI Concierge</a> · <a href="/destinations">Destinations</a> · <a href="/deals">Promotions</a></p><small>© {new Date().getFullYear()} Waylume Travel. All rights reserved.</small></div></footer>
    </main>
  );
}
