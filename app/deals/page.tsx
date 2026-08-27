"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type Promotion = { _id?: string; badge?: string; title: string; description: string; destination?: string; ctaLabel?: string; sortOrder?: number };

const fallbackPromos: Promotion[] = [
  { badge: "Beach escape", title: "All-inclusive resort ideas", description: "Explore Caribbean and Mexico resort options built around your dates, departure airport, traveler count, and preferred experience.", destination: "Caribbean or Mexico", ctaLabel: "Request current options" },
  { badge: "Cruise planning", title: "Find the right sailing", description: "Start with cruise length, region, preferred port, and travel style. Waylume can help narrow the supplier options that fit.", destination: "Cruise", ctaLabel: "Explore cruise options" },
  { badge: "City + stay", title: "Flight and hotel getaways", description: "Build a short escape or longer vacation around flexible flight and hotel combinations instead of one-size-fits-all packages.", destination: "Flight + Hotel", ctaLabel: "Build my getaway" },
];

export default function DealsPage() {
  const [promos, setPromos] = useState<Promotion[]>(fallbackPromos);

  useEffect(() => {
    fetch("/api/promotions", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data.promotions) && data.promotions.length) {
          setPromos([...data.promotions].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <main>
      <section className="subhero">
        <div className="shell">
          <Link className="back-link" href="/">← Waylume Travel</Link>
          <span className="eyebrow"><Sparkles size={16}/> Promotions & inspiration</span>
          <h1>Start with an idea. Confirm the real offer with an advisor.</h1>
          <p className="lead">Active Waylume promotions can now be managed from the advisor workspace. Final availability, supplier terms, and pricing are confirmed during the booking process.</p>
        </div>
      </section>
      <section className="section shell">
        <div className="promo-grid">
          {promos.map((promo) => (
            <article className="promo-card" key={promo._id ?? promo.title}>
              <small>{promo.badge || "Travel inspiration"}</small>
              <h2>{promo.title}</h2>
              <p>{promo.description}</p>
              <Link href={`/?destination=${encodeURIComponent(promo.destination || promo.title)}#plan`}>{promo.ctaLabel || "Request current options"} <ArrowRight size={15}/></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
