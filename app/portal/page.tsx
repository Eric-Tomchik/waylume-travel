"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, MapPin, Plane, ReceiptText, XCircle } from "lucide-react";
import WaylumeLogo from "@/components/WaylumeLogo";
import { HOST_AGENCY } from "@/lib/hostAgency";

type Portal = {
  email: string;
  expiresAt: number;
  request: null | { _id: string; destination: string; dates?: string; travelers: string; tripType: string; status: string };
  quotes: Array<{ _id: string; title: string; summary: string; amount?: number; currency: string; supplierName?: string; expiresAt?: number; status: string; travelerMessage?: string; travelerRespondedAt?: number }>;
  itineraries: Array<{ _id: string; title: string; summary: string; days: Array<{ day: number; title: string; details: string }>; updatedAt: number }>;
};

export default function TravelerPortalPage() {
  const [portal, setPortal] = useState<Portal | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [message, setMessage] = useState<Record<string, string>>({});
  const [focusQuote, setFocusQuote] = useState("");

  async function loadPortal(accessToken: string) {
    const response = await fetch(`/api/portal?token=${encodeURIComponent(accessToken)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to open traveler portal");
    setPortal(data.portal);
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "portal_opened", surface: "traveler_portal", travelRequestId: data.portal?.request?._id }) });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token") || "";
    setFocusQuote(params.get("quote") || "");
    setToken(accessToken);
    if (!accessToken) { setError("This traveler portal link is missing its secure access token."); setLoading(false); return; }
    loadPortal(accessToken).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  async function respondToQuote(quoteId: string, response: "accepted" | "declined") {
    setResponding(quoteId);
    setError("");
    const result = await fetch("/api/portal/quote-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, quoteId, response, message: message[quoteId] || undefined }),
    });
    const data = await result.json();
    if (!result.ok) setError(data.error || "Unable to save your response.");
    else await loadPortal(token);
    setResponding(null);
  }

  return <main className="portal-shell"><div className="shell">
    <header className="portal-header"><Link href="/" className="brand"><WaylumeLogo cropMark className="brand-mark" alt="Waylume Travel"/><span><strong>WAYLUME</strong> <em>TRAVEL</em><small>{HOST_AGENCY.disclosure}</small></span></Link><span className="portal-badge">Traveler Portal</span></header>
    {loading && <div className="portal-state"><h1>Opening your trip…</h1><p>Securely loading your Waylume travel workspace.</p></div>}
    {error && !portal && <div className="portal-state"><h1>We couldn’t open this trip.</h1><p>{error}</p><Link className="button" href="/#plan">Contact Waylume</Link></div>}
    {portal && <>
      <section className="portal-hero"><div><span className="eyebrow"><Plane size={16}/> Your Waylume trip</span><h1>{portal.request?.destination || "Your upcoming journey"}</h1><p>Review your trip status, advisor-published quotes, and itinerary details in one private workspace.</p></div><div className="portal-status"><small>Planning status</small><strong>{portal.request?.status || "Planning"}</strong><span>Access expires {new Date(portal.expiresAt).toLocaleDateString()}</span></div></section>
      {error && <div className="portal-inline-error">{error}</div>}
      {portal.request && <section className="portal-summary"><article><MapPin/><span><small>Destination</small><b>{portal.request.destination}</b></span></article><article><CalendarDays/><span><small>Dates</small><b>{portal.request.dates || "Flexible"}</b></span></article><article><Plane/><span><small>Trip type</small><b>{portal.request.tripType}</b></span></article><article><CheckCircle2/><span><small>Travelers</small><b>{portal.request.travelers}</b></span></article></section>}
      <section className="portal-grid"><div><div className="portal-section-title"><ReceiptText/><div><span className="eyebrow">Advisor quotes</span><h2>Current options</h2></div></div>{portal.quotes.length ? <div className="portal-cards">{portal.quotes.map(q=><article className={`portal-card${focusQuote===q._id?" portal-card-focus":""}`} key={q._id} id={`quote-${q._id}`}><div className="portal-card-head"><div><small>{q.supplierName || "Travel option"}</small><h3>{q.title}</h3></div><span className="status-pill">{q.status}</span></div><p>{q.summary}</p>{q.amount!==undefined&&<strong className="portal-price">{new Intl.NumberFormat("en-US",{style:"currency",currency:q.currency||"USD"}).format(q.amount)}</strong>}{q.expiresAt&&<small>Quote valid through {new Date(q.expiresAt).toLocaleDateString()}</small>}{q.status==="sent"&&<div className="quote-response"><textarea value={message[q._id]||""} onChange={e=>setMessage(current=>({...current,[q._id]:e.target.value}))} placeholder="Optional message for your advisor"/><div><button className="button" disabled={responding===q._id} onClick={()=>respondToQuote(q._id,"accepted")}><CheckCircle2 size={16}/> Accept option</button><button className="ghost danger" disabled={responding===q._id} onClick={()=>respondToQuote(q._id,"declined")}><XCircle size={16}/> Decline</button></div></div>}{q.travelerRespondedAt&&<div className="quote-confirmation">Response recorded {new Date(q.travelerRespondedAt).toLocaleString()}{q.travelerMessage?` · “${q.travelerMessage}”`:""}</div>}</article>)}</div>:<div className="portal-empty">Your advisor has not published a quote yet.</div>}</div>
      <div><div className="portal-section-title"><CalendarDays/><div><span className="eyebrow">Itinerary</span><h2>Trip plan</h2></div></div>{portal.itineraries.length ? <div className="portal-cards">{portal.itineraries.map(i=><article className="portal-card" key={i._id}><h3>{i.title}</h3><p>{i.summary}</p><div className="itinerary-days">{i.days.map(day=><div key={day.day}><b>Day {day.day}</b><span><strong>{day.title}</strong><small>{day.details}</small></span></div>)}</div></article>)}</div>:<div className="portal-empty">Your advisor has not published an itinerary yet.</div>}</div></section>
      <div className="portal-disclaimer">Accepting an option here records your preference for your advisor; it does not independently issue a ticket, charge a card, or finalize a supplier booking. Final pricing, availability, payment, and booking terms remain subject to advisor and supplier confirmation.</div>
    </>}
  </div></main>;
}
