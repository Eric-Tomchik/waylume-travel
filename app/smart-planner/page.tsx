"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const suggestions = {
  beach: ["Puerto Rico", "Cancún & Riviera Maya", "Jamaica"],
  family: ["Orlando", "Cancún & Riviera Maya", "Puerto Rico"],
  nightlife: ["Las Vegas", "Puerto Rico", "Cancún & Riviera Maya"],
  culture: ["Europe", "Puerto Rico", "Jamaica"],
  cruise: ["Caribbean cruise", "Mediterranean cruise", "River cruise"],
};

export default function SmartPlannerPage() {
  const [style, setStyle] = useState<keyof typeof suggestions>("beach");
  const [budget, setBudget] = useState("mid-range");
  const [pace, setPace] = useState("balanced");
  const [travelers, setTravelers] = useState("2");

  const recommendation = useMemo(() => {
    const [primary, secondary, third] = suggestions[style];
    return {
      title: `${primary} is a strong starting point`,
      text: `For ${travelers} traveler${travelers === "1" ? "" : "s"}, a ${budget} budget and ${pace} pace, start by comparing ${primary}, then ${secondary} and ${third}. This is preference matching—not live pricing or an automated booking recommendation.`,
      destination: primary,
    };
  }, [style, budget, pace, travelers]);

  return (
    <main>
      <section className="subhero">
        <div className="shell">
          <Link className="back-link" href="/">← Waylume Travel</Link>
          <span className="eyebrow"><Sparkles size={16}/> Smart trip builder</span>
          <h1>Turn preferences into a better starting point.</h1>
          <p className="lead">Use a guided matching tool to narrow the kind of trip that may fit you best, then hand the structured idea to a human advisor for supplier research.</p>
        </div>
      </section>
      <section className="section shell smart-grid">
        <div className="smart-form">
          <label>What sounds most like your trip?<select value={style} onChange={e=>setStyle(e.target.value as keyof typeof suggestions)}><option value="beach">Beach / resort</option><option value="family">Family fun</option><option value="nightlife">Entertainment / nightlife</option><option value="culture">Culture / sightseeing</option><option value="cruise">Cruise</option></select></label>
          <label>Budget style<select value={budget} onChange={e=>setBudget(e.target.value)}><option>value-focused</option><option>mid-range</option><option>premium</option></select></label>
          <label>Vacation pace<select value={pace} onChange={e=>setPace(e.target.value)}><option>relaxed</option><option>balanced</option><option>activity-packed</option></select></label>
          <label>Travelers<input value={travelers} onChange={e=>setTravelers(e.target.value)} inputMode="numeric" /></label>
        </div>
        <aside className="smart-result">
          <span className="eyebrow">Waylume match</span>
          <h2>{recommendation.title}</h2>
          <p>{recommendation.text}</p>
          <Link className="button" href={`/?destination=${encodeURIComponent(recommendation.destination)}#plan`}>Send this starting point <ArrowRight size={17}/></Link>
          <small>Final prices, availability, supplier terms, and booking recommendations require advisor/supplier confirmation.</small>
        </aside>
      </section>
    </main>
  );
}
