"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, MapPin, Plane, ReceiptText } from "lucide-react";

type Portal = {
  email: string;
  expiresAt: number;
  request: null | { _id: string; destination: string; dates?: string; travelers: string; tripType: string; status: string };
  quotes: Array<{ _id: string; title: string; summary: string; amount?: number; currency: string; supplierName?: string; expiresAt?: number; status: string }>;
  itineraries: Array<{ _id: string; title: string; summary: string; days: Array<{ day: number; title: string; details: string }>; updatedAt: number }>;
};

export default function TravelerPortalPage() {
  const [portal, setPortal] = useState<Portal | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { setError("This traveler portal link is missing its secure access token."); setLoading(false); return; }
    fetch(`/api/portal?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to open traveler portal");
        setPortal(data.portal);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return <main className="portal-shell"><div className="shell">
    <header className="portal-header"><Link href="/" className="brand"><img src="/waylume-mark.svg" alt="" className="brand-mark"/><span><strong>WAYLUME</strong> <em>TRAVEL</em><small>Independent Agent of Archer</small></span></Link><span className="portal-badge">Traveler Portal</span></header>
    {loading && <div className="portal-state"><h1>Opening your trip…</h1><p>Securely loading your Waylume travel workspace.</p></div>}
    {error && <div className="portal-state"><h1>We couldn’t open this trip.</h1><p>{error}</p><Link className="button" href="/#plan">Contact Waylume</Link></div>}
    {portal && <>
      <section className="portal-hero"><div><span className="eyebrow"><Plane size={16}/> Your Waylume trip</span><h1>{portal.request?.destination || "Your upcoming journey"}</h1><p>Welcome back. This private workspace brings together the current trip status, advisor-published quotes, and itinerary details.</p></div><div className="portal-status"><small>Planning status</small><strong>{portal.request?.status || "Planning"}</strong><span>Access expires {new Date(portal.expiresAt).toLocaleDateString()}</span></div></section>
      {portal.request && <section className="portal-summary"><article><MapPin/><span><small>Destination</small><b>{portal.request.destination}</b></span></article><article><CalendarDays/><span><small>Dates</small><b>{portal.request.dates || "Flexible"}</b></span></article><article><Plane/><span><small>Trip type</small><b>{portal.request.tripType}</b></span></article><article><CheckCircle2/><span><small>Travelers</small><b>{portal.request.travelers}</b></span></article></section>}
      <section className="portal-grid"><div><div className="portal-section-title"><ReceiptText/><div><span className="eyebrow">Advisor quotes</span><h2>Current options</h2></div></div>{portal.quotes.length ? <div className="portal-cards">{portal.quotes.map(q=><article className="portal-card" key={q._id}><div className="portal-card-head"><div><small>{q.supplierName || "Travel option"}</small><h3>{q.title}</h3></div><span className="status-pill">{q.status}</span></div><p>{q.summary}</p>{q.amount!==undefined&&<strong className="portal-price">{new Intl.NumberFormat("en-US",{style:"currency",currency:q.currency||"USD"}).format(q.amount)}</strong>}{q.expiresAt&&<small>Quote valid through {new Date(q.expiresAt).toLocaleDateString()}</small>}</article>)}</div>:<div className="portal-empty">Your advisor has not published a quote yet.</div>}</div>
      <div><div className="portal-section-title"><CalendarDays/><div><span className="eyebrow">Itinerary</span><h2>Trip plan</h2></div></div>{portal.itineraries.length ? <div className="portal-cards">{portal.itineraries.map(i=><article className="portal-card" key={i._id}><h3>{i.title}</h3><p>{i.summary}</p><div className="itinerary-days">{i.days.map(day=><div key={day.day}><b>Day {day.day}</b><span><strong>{day.title}</strong><small>{day.details}</small></span></div>)}</div></article>)}</div>:<div className="portal-empty">Your advisor has not published an itinerary yet.</div>}</div></section>
      <div className="portal-disclaimer">Supplier pricing, availability, and booking terms remain subject to supplier confirmation. This portal displays advisor-curated trip information and does not independently issue tickets or reservations.</div>
    </>}
  </div></main>;
}
