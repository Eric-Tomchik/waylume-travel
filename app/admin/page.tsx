"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { hasAdminSession } from "@/lib/adminClient";
import { applyAppearance, loadAdminSettings } from "@/lib/adminSettingsClient";

type Status = "new" | "contacted" | "quoted" | "booked" | "closed";

type Lead = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  contactPreference?: string;
  bestTime?: string;
  heardAbout?: string;
  marketingOptIn?: boolean;
  destination: string;
  dates?: string;
  travelers: string;
  budget?: string;
  tripType: string;
  notes?: string;
  advisorNotes?: string;
  followUpAt?: number;
  status: Status;
  createdAt: number;
};

const STATUSES: Status[] = ["new", "contacted", "quoted", "booked", "closed"];
const SEEN_KEY = "waylume-admin-last-seen";

function isOverdue(lead: Lead) {
  return Boolean(lead.followUpAt && lead.followUpAt < Date.now() && lead.status !== "booked" && lead.status !== "closed");
}

export default function AdminCrmPage() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState<Status | "all" | "follow-up">("all");
  const [query, setQuery] = useState("");
  const [lastSeen, setLastSeen] = useState<number>(0);

  function authHeaders(extra?: Record<string, string>) {
    return { ...(token ? { "x-admin-token": token } : {}), ...extra };
  }

  async function loadLeads(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/leads", { headers: authHeaders(), cache: "no-store" });
    if (!response.ok) {
      setAuthorized(false);
      setLeads([]);
      setError(response.status === 401 ? "Advisor authentication required." : "Unable to load inquiries.");
    } else {
      const data = await response.json();
      setAuthorized(true);
      setLeads(data.leads ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLastSeen(Number(window.localStorage.getItem(SEEN_KEY) || 0));
    hasAdminSession().then(async (ok) => {
      if (!ok) return setLoading(false);
      await loadLeads();
      const settings = await loadAdminSettings();
      if (settings) applyAppearance(settings);
    });
    // Keep the pipeline live without a refresh.
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadLeads();
    }, 60000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unseen = useMemo(() => leads.filter((lead) => lead.createdAt > lastSeen), [leads, lastSeen]);
  const followUps = useMemo(() => leads.filter(isOverdue), [leads]);

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (filter === "follow-up" && !isOverdue(lead)) return false;
      if (filter !== "all" && filter !== "follow-up" && lead.status !== filter) return false;
      if (!text) return true;
      return [lead.name, lead.email, lead.phone, lead.destination, lead.tripType, lead.notes, lead.advisorNotes]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text));
    });
  }, [leads, filter, query]);

  function markAllSeen() {
    const now = Date.now();
    window.localStorage.setItem(SEEN_KEY, String(now));
    setLastSeen(now);
  }

  async function updateLead(id: string, patch: Partial<Pick<Lead, "status" | "advisorNotes" | "followUpAt">> & { clearFollowUp?: boolean }) {
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ id, ...patch }),
    });
    if (!response.ok) return setError("Unable to update inquiry.");
    setLeads((current) => current.map((lead) => (lead._id === id
      ? { ...lead, ...patch, followUpAt: patch.clearFollowUp ? undefined : (patch.followUpAt ?? lead.followUpAt) }
      : lead)));
  }

  async function deleteLead(id: string) {
    setDeleting(true);
    setError("");
    const response = await fetch("/api/admin/leads", {
      method: "DELETE",
      headers: authHeaders({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ id }),
    });
    setDeleting(false);
    setConfirmingDelete(null);
    if (!response.ok) return setError("Unable to delete this inquiry.");
    setLeads((current) => current.filter((lead) => lead._id !== id));
  }

  function exportCsv() {
    const columns: (keyof Lead)[] = ["createdAt", "status", "name", "email", "phone", "contactPreference", "bestTime",
      "destination", "dates", "travelers", "tripType", "heardAbout", "marketingOptIn", "notes", "advisorNotes"];
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = [columns.join(",")].concat(shown.map((lead) => columns.map((column) => (
      column === "createdAt" ? escape(new Date(lead.createdAt).toISOString()) : escape(lead[column])
    )).join(",")));
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `waylume-clients-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const mailingList = leads.filter((lead) => lead.marketingOptIn).map((lead) => lead.email);

  return (
    <main className="admin-shell">
      <div className="shell">
        <div className="admin-header">
          <div>
            <Link href="/admin/overview" className="back-link">← Dashboard overview</Link>
            <span className="eyebrow">Advisor workspace</span>
            <h1>Client CRM</h1>
          </div>
          <div className="admin-actions">
            <Link className="button small" href="/admin/notifications">Notifications</Link>
            <Link className="button small" href="/admin/promotions">Promotions</Link>
            <Link className="button small" href="/admin/fora-deals">Fora deals</Link>
            <Link className="button small" href="/admin/policies">Fora policies</Link>
            <button className="ghost" onClick={() => loadLeads()}>Refresh</button>
            <div className="pipeline-stats"><b>{leads.length}</b><span>total clients</span></div>
          </div>
        </div>

        {loading && !authorized ? (
          <div className="admin-login"><h2>Checking advisor session…</h2></div>
        ) : !authorized ? (
          <form className="admin-login" onSubmit={loadLeads}>
            <h2>Advisor access</h2>
            <p>Use the secure sign-in page to start an 8-hour session, or enter the legacy passcode here.</p>
            <Link className="button" href="/admin/login">Secure sign in</Link>
            <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Legacy admin passcode" />
            <button className="ghost">Open with passcode</button>
            {error ? <p className="error">{error}</p> : null}
          </form>
        ) : (
          <>
            {unseen.length ? (
              <div className="alert-bar">
                <div>
                  <b>{unseen.length} new {unseen.length === 1 ? "submission" : "submissions"}</b>
                  <span>{unseen.slice(0, 3).map((lead) => `${lead.name} · ${lead.destination}`).join("  ·  ")}</span>
                </div>
                <button className="ghost" onClick={markAllSeen}>Mark as seen</button>
              </div>
            ) : null}

            {followUps.length ? (
              <div className="alert-bar warn">
                <div>
                  <b>{followUps.length} follow-up{followUps.length === 1 ? "" : "s"} due</b>
                  <span>{followUps.slice(0, 3).map((lead) => lead.name).join(", ")}</span>
                </div>
                <button className="ghost" onClick={() => setFilter("follow-up")}>Show them</button>
              </div>
            ) : null}

            <div className="crm-toolbar">
              <input className="crm-search" type="search" value={query} placeholder="Search name, email, phone, destination…"
                onChange={(e) => setQuery(e.target.value)} />
              <div className="crm-filters">
                <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All ({leads.length})</button>
                {STATUSES.map((status) => (
                  <button key={status} className={filter === status ? "on" : ""} onClick={() => setFilter(status)}>
                    {status} ({leads.filter((lead) => lead.status === status).length})
                  </button>
                ))}
                <button className={filter === "follow-up" ? "on" : ""} onClick={() => setFilter("follow-up")}>
                  follow-up due ({followUps.length})
                </button>
              </div>
              <div className="crm-tools">
                <button className="ghost" onClick={exportCsv}>Export CSV</button>
                <button className="ghost" disabled={!mailingList.length}
                  onClick={() => navigator.clipboard?.writeText(mailingList.join(", "))}>
                  Copy {mailingList.length} opt-in emails
                </button>
              </div>
            </div>

            {error ? <p className="error">{error}</p> : null}

            <div className="lead-list">
              {!shown.length ? (
                <div className="empty-state">
                  <h2>{leads.length ? "Nothing matches that filter." : "No inquiries yet."}</h2>
                  <p>{leads.length ? "Try clearing the search or choosing another status." : "New submissions from the contact page land here automatically."}</p>
                </div>
              ) : null}

              {shown.map((lead) => (
                <article className={`lead-card${lead.createdAt > lastSeen ? " is-new" : ""}`} key={lead._id}>
                  <div className="lead-top">
                    <div>
                      <small>
                        {new Date(lead.createdAt).toLocaleString()}
                        {lead.createdAt > lastSeen ? <span className="badge-new">New</span> : null}
                        {isOverdue(lead) ? <span className="badge-due">Follow-up due</span> : null}
                      </small>
                      <h2>{lead.name}</h2>
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                      {lead.phone ? <> · <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>{lead.phone}</a></> : null}
                    </div>
                    <div className="lead-controls">
                      <Link className="ghost" href={`/admin/quotes?requestId=${encodeURIComponent(lead._id)}`}>Quotes</Link>
                      <Link className="ghost" href={`/admin/itineraries?requestId=${encodeURIComponent(lead._id)}`}>Itinerary</Link>
                      <Link className="ghost" href={`/admin/portal-access?requestId=${encodeURIComponent(lead._id)}&email=${encodeURIComponent(lead.email)}`}>Portal</Link>
                      <select value={lead.status} onChange={(e) => updateLead(lead._id, { status: e.target.value as Status })}>
                        {STATUSES.map((status) => <option key={status}>{status}</option>)}
                      </select>
                      {confirmingDelete === lead._id ? (
                        <span className="confirm-delete">
                          Delete permanently?
                          <button className="danger-button" disabled={deleting} onClick={() => deleteLead(lead._id)}>
                            {deleting ? "Deleting…" : "Yes, delete"}
                          </button>
                          <button className="ghost" onClick={() => setConfirmingDelete(null)}>Keep</button>
                        </span>
                      ) : (
                        <button className="danger-button" onClick={() => setConfirmingDelete(lead._id)}>Delete</button>
                      )}
                    </div>
                  </div>

                  <div className="lead-detail-grid">
                    <div><span>Destination</span><b>{lead.destination}</b></div>
                    <div><span>Trip type</span><b>{lead.tripType}</b></div>
                    <div><span>Travelers</span><b>{lead.travelers}</b></div>
                    <div><span>Dates</span><b>{lead.dates || "Flexible"}</b></div>
                    <div><span>Prefers</span><b>{lead.contactPreference || "Email"}{lead.bestTime ? ` · ${lead.bestTime}` : ""}</b></div>
                    <div><span>Found me via</span><b>{lead.heardAbout || "Not specified"}</b></div>
                    <div><span>Marketing</span><b>{lead.marketingOptIn ? "Opted in" : "No"}</b></div>
                  </div>

                  {lead.notes ? <p className="lead-notes"><strong>Traveler notes:</strong> {lead.notes}</p> : null}

                  <div className="crm-grid">
                    <label>Advisor notes
                      <textarea
                        value={lead.advisorNotes || ""}
                        placeholder="Research, supplier options, call notes…"
                        onChange={(e) => setLeads((current) => current.map((item) => (item._id === lead._id ? { ...item, advisorNotes: e.target.value } : item)))}
                        onBlur={() => updateLead(lead._id, { advisorNotes: lead.advisorNotes || "" })}
                      />
                    </label>
                    <label>Follow-up date
                      <input
                        type="date"
                        value={lead.followUpAt ? new Date(lead.followUpAt).toISOString().slice(0, 10) : ""}
                        onChange={(e) => (e.target.value
                          ? updateLead(lead._id, { followUpAt: new Date(`${e.target.value}T12:00:00`).getTime() })
                          : updateLead(lead._id, { clearFollowUp: true }))}
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
