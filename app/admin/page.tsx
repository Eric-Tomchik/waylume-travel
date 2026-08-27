"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Lead = {
  _id: string;
  name: string;
  email: string;
  destination: string;
  dates?: string;
  travelers: string;
  budget?: string;
  tripType: string;
  notes?: string;
  status: "new" | "contacted" | "quoted" | "booked" | "closed";
  createdAt: number;
};

const statuses: Lead["status"][] = ["new", "contacted", "quoted", "booked", "closed"];

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadLeads(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/leads", { headers: { "x-admin-token": token }, cache: "no-store" });
    if (!response.ok) {
      setError(response.status === 401 ? "Invalid advisor passcode." : "Unable to load inquiries.");
      setLeads([]);
    } else {
      const data = await response.json();
      setLeads(data.leads ?? []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: Lead["status"]) {
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok) setLeads(current => current.map(lead => lead._id === id ? { ...lead, status } : lead));
    else setError("Unable to update inquiry status.");
  }

  return (
    <main className="admin-shell">
      <div className="shell">
        <div className="admin-header">
          <div><Link href="/" className="back-link">← Public website</Link><span className="eyebrow">Advisor workspace</span><h1>Trip inquiry pipeline</h1></div>
          <div className="pipeline-stats"><b>{leads.length}</b><span>loaded inquiries</span></div>
        </div>
        {!leads.length && (
          <form className="admin-login" onSubmit={loadLeads}>
            <h2>Advisor access</h2>
            <p>Enter the admin passcode configured in the hosting environment. It is never bundled into the browser application.</p>
            <input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Admin passcode" required />
            <button className="button" disabled={loading}>{loading ? "Loading…" : "Open workspace"}</button>
            {error && <p className="error">{error}</p>}
          </form>
        )}
        {!!leads.length && (
          <div className="lead-list">
            {leads.map(lead => (
              <article className="lead-card" key={lead._id}>
                <div className="lead-top"><div><small>{new Date(lead.createdAt).toLocaleString()}</small><h2>{lead.name}</h2><a href={`mailto:${lead.email}`}>{lead.email}</a></div><select value={lead.status} onChange={e=>updateStatus(lead._id, e.target.value as Lead["status"])}>{statuses.map(status=><option key={status}>{status}</option>)}</select></div>
                <div className="lead-detail-grid"><div><span>Destination</span><b>{lead.destination}</b></div><div><span>Trip type</span><b>{lead.tripType}</b></div><div><span>Travelers</span><b>{lead.travelers}</b></div><div><span>Dates</span><b>{lead.dates || "Flexible"}</b></div><div><span>Budget</span><b>{lead.budget || "Not specified"}</b></div></div>
                {lead.notes && <p className="lead-notes">{lead.notes}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
