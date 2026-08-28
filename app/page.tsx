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
          <a href="/destinations">Destinations</a><a href="/deals">Promotions</a><a href="/smart-planner">Smart Planner</a><a href="#plan">Plan a Trip</a>
        </nav>
        <a className="button small" href="#plan">Start Planning</a>
      </header>

      <section id="top" className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="eyebrow"><Sparkles size={16}/> Travel, illuminated.</div>
            <h1>Find your next <span>unforgettable</span> escape.</h1>
            <p className="lead">Waylume combines modern trip discovery with personal travel-advisor support—so you can explore ideas, request options, and move from inspiration to vacation with confidence.</p>
            <div className="actions"><a className="button" href="/smart-planner">Try Smart Planner <ArrowRight size={18}/></a><a className="ghost" href="/destinations">Explore destinations</a></div>
            <div className="trust"><span><Check/>Personalized planning</span><span><Check/>Supplier-backed options</span><span><Check/>Human advisor support</span></div>
          </div>
          <div className="hero-card">
            <div className="orb"><WaylumeLogo cropMark alt="Waylume Travel compass, air and ocean mark" /></div>
            <div className="floating one">✈ Flights + stays</div><div className="floating two">✦ Curated escapes</div><div className="floating three">⚓ Cruise ideas</div>
          </div>
        </div>
      </section>

      <section id="experiences" className="section shell">
        <div className="section-head"><div><span className="eyebrow">Explore your way</span><h2>One place to start every kind of journey.</h2></div><p>Tell us what sounds good. We’ll help shape it into real options using available travel suppliers and advisor resources.</p></div>
        <div className="cards">
          <article><Plane/><h3>Flights + Stays</h3><p>Build a city escape, family trip, or flexible flight-and-hotel itinerary.</p><a href="#plan">Request options →</a></article>
          <article><Waves/><h3>Resorts</h3><p>Beachfront, all-inclusive, adults-only, luxury, and family-friendly stays.</p><a href="/destinations">Browse destinations →</a></article>
          <article><Ship/><h3>Cruises</h3><p>Ocean cruises, river journeys, quick getaways, and bucket-list sailings.</p><a href="/deals">Explore ideas →</a></article>
          <article><Compass/><h3>Smart Planner</h3><p>Answer a few preference questions and get a stronger destination starting point.</p><a href="/smart-planner">Match my trip →</a></article>
        </div>
      </section>

      <section id="why" className="section band">
        <div className="shell split"><div><span className="eyebrow">Why Waylume</span><h2>Technology for discovery. A real person for the details.</h2><p className="lead compact">Use the site to shape your idea, then let Waylume help compare practical options and guide the next step.</p></div><div className="benefits"><div><b>01</b><span><strong>Start with your priorities</strong><small>Destination, dates, budget, traveler count, and the experience you want.</small></span></div><div><b>02</b><span><strong>Receive curated direction</strong><small>Your request becomes a structured lead ready for advisor research and supplier pricing.</small></span></div><div><b>03</b><span><strong>Book with clarity</strong><small>Final availability, terms, and pricing are confirmed through applicable travel suppliers.</small></span></div></div></div>
      </section>

      <section id="plan" className="section shell plan-grid">
        <div><span className="eyebrow">Plan my trip</span><h2>Tell us where your next story begins.</h2><p className="lead compact">This form is connected to the Waylume lead pipeline. Submit the basics and we’ll have a structured request ready for follow-up.</p><div className="notice"><strong>Independent travel advisor disclosure</strong><p>Waylume Travel operates as an Independent Agent of Archer. Website content is for travel discovery and lead generation. Final supplier availability, pricing, booking terms, and confirmations may vary and are provided at the time of booking.</p></div></div>
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

      <footer><div className="shell footer"><div className="brand"><WaylumeLogo cropMark className="brand-mark" alt="Waylume Travel"/><span><strong>WAYLUME</strong> <em>TRAVEL</em><small>Independent Agent of Archer</small></span></div><p>Personalized travel discovery, planning support, and vacation inspiration. <a href="/destinations">Destinations</a> · <a href="/deals">Promotions</a> · <a href="/smart-planner">Smart Planner</a></p><small>© {new Date().getFullYear()} Waylume Travel. All rights reserved.</small></div></footer>
    </main>
  );
}
