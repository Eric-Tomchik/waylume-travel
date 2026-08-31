"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { hasAdminSession } from "@/lib/adminClient";

type Deal = {
  _id: string;
  foraId: string;
  title: string;
  supplier: string;
  supplierType?: string;
  location?: string;
  rawDescription: string;
  publicTitle?: string;
  publicSummary?: string;
  bookingStart?: string;
  bookingEnd?: string;
  travelStart?: string;
  travelEnd?: string;
  exclusiveToFora?: boolean;
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
  tradeLanguage: boolean;
};

type Stats = { total: number; published: number; readyToPublish: number; lastImportedAt: number; byType: Record<string, number> };

const TYPES = ["hotel", "cruise", "DMC", "multiday_tours", "home_villa", "Package", "day_tours_and_activities", "ground_transportation"];

function window_(start?: string, end?: string) {
  if (!start && !end) return "—";
  return `${start || "…"} → ${end || "…"}`;
}

/** Mirrors convex/foraDeals.ts — Fora restricts public promotion of these partner brands. */
const RESTRICTED_BRANDS = /four\s+seasons|virtuoso|\bmarriott\s+stars\b|\bluminous\b/i;
function restrictedBrand(text: string) {
  return RESTRICTED_BRANDS.test(text);
}

export default function ForaDealsAdminPage() {
  const [token, setToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [supplierType, setSupplierType] = useState("");
  const [publishedOnly, setPublishedOnly] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSummary, setDraftSummary] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeaders = useCallback((json = false) => ({
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { "x-admin-token": token } : {}),
  }), [token]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (supplierType) params.set("supplierType", supplierType);
    if (publishedOnly) params.set("publishedOnly", "true");
    params.set("limit", "150");

    const response = await fetch(`/api/admin/fora-deals?${params.toString()}`, { headers: authHeaders(), cache: "no-store" });
    setLoading(false);
    if (!response.ok) {
      setAuthorized(false);
      setError("Unable to open the deals library.");
      return;
    }
    const data = await response.json();
    setAuthorized(true);
    setDeals(data.deals ?? []);
    setTotal(data.total ?? 0);
    setStats(data.stats ?? null);
  }, [authHeaders, search, supplierType, publishedOnly]);

  useEffect(() => {
    hasAdminSession().then(async ok => {
      if (ok) await load();
      setChecking(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    setError("");
    setMessage("");
    const response = await fetch("/api/admin/fora-deals", {
      method: "PATCH",
      headers: authHeaders(true),
      body: JSON.stringify({ id, ...body }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Unable to update this deal.");
      return false;
    }
    await load();
    return true;
  }

  async function togglePublish(deal: Deal) {
    const ok = await patch(deal._id, { published: !deal.published });
    if (ok) setMessage(deal.published ? "Deal removed from the public site." : "Deal is live on the public site.");
  }

  function startEdit(deal: Deal) {
    setEditing(deal);
    setDraftTitle(deal.publicTitle || deal.title);
    setDraftSummary(deal.publicSummary || "");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveCopy(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const ok = await patch(editing._id, { publicTitle: draftTitle, publicSummary: draftSummary });
    if (ok) {
      setMessage("Traveler-facing copy saved. Publish it when you're happy with it.");
      setEditing(null);
    }
  }

  return (
    <main className="admin-shell">
      <div className="shell">
        <div className="admin-header">
          <div>
            <Link href="/admin" className="back-link">← Trip inquiries</Link>
            <span className="eyebrow">Advisor content</span>
            <h1>Fora deals library</h1>
          </div>
          <Link href="/promotions" className="button small">View public promotions</Link>
        </div>

        {checking && <div className="admin-login"><h2>Checking advisor session…</h2></div>}

        {!checking && !authorized && (
          <form className="admin-login" onSubmit={e => { e.preventDefault(); load(); }}>
            <h2>Advisor access</h2>
            <Link className="button" href="/admin/login">Secure sign in</Link>
            <input type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="Legacy admin passcode" />
            <button className="ghost">Open with passcode</button>
            {error && <p className="error">{error}</p>}
          </form>
        )}

        {authorized && (
          <>
            {stats && (
              <div className="cms-list" style={{ marginBottom: 18 }}>
                <article>
                  <div>
                    <small>Imported from Fora</small>
                    <h3>{stats.total} deals · {stats.published} live · {stats.readyToPublish} drafted</h3>
                    <p>
                      Nothing reaches the public site until you publish it. Advisor copy from Fora stays internal —
                      write traveler-facing wording first, then publish.
                    </p>
                  </div>
                </article>
              </div>
            )}

            {editing && (
              <form className="cms-form" onSubmit={saveCopy}>
                <h2>Traveler-facing copy</h2>
                <p className="wide">
                  <strong>{editing.supplier}</strong> · {editing.location || "—"} · book by {editing.bookingEnd || "—"}
                </p>
                <details className="wide">
                  <summary>Fora&apos;s advisor copy (internal — never published)</summary>
                  <p style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{editing.rawDescription}</p>
                </details>
                <label className="wide">Public title
                  <input value={draftTitle} onChange={e => setDraftTitle(e.target.value)} required />
                </label>
                <label className="wide">Public summary
                  <textarea
                    value={draftSummary}
                    onChange={e => setDraftSummary(e.target.value)}
                    placeholder="Rewrite for travelers. No commission, net rates or fam-trip language."
                    rows={5}
                    required
                  />
                </label>
                <div className="wide cms-actions">
                  <button className="button">Save copy</button>
                  <button type="button" className="ghost" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </form>
            )}

            <form className="cms-form" onSubmit={e => { e.preventDefault(); load(); }}>
              <label>Search<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Supplier, title or destination" /></label>
              <label>Type
                <select value={supplierType} onChange={e => setSupplierType(e.target.value)}>
                  <option value="">All types</option>
                  {TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="check-label">
                <input type="checkbox" checked={publishedOnly} onChange={e => setPublishedOnly(e.target.checked)} /> Published only
              </label>
              <div className="wide cms-actions"><button className="button">Apply filters</button></div>
            </form>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            {loading && <p>Loading deals…</p>}

            {!loading && !deals.length && (
              <div className="empty-state">
                <h2>No deals match.</h2>
                <p>Clear the filters, or run the Fora import to populate the library.</p>
              </div>
            )}

            {!loading && Boolean(deals.length) && (
              <p><small>Showing {deals.length} of {total} matching deals.</small></p>
            )}

            <div className="cms-list">
              {deals.map(deal => (
                <article key={deal._id}>
                  <div>
                    <small>
                      {deal.published ? "● Live on site" : "○ Not published"}
                      {" · "}{deal.supplierType || "other"}
                      {deal.exclusiveToFora ? " · Fora exclusive" : ""}
                      {deal.tradeLanguage ? " · ⚠ advisor-only wording in source" : ""}
                      {restrictedBrand(`${deal.supplier} ${deal.title}`) ? " · ⛔ partner brand restricted by Fora policy" : ""}
                    </small>
                    <h3>{deal.publicTitle || deal.title}</h3>
                    <p>
                      <strong>{deal.supplier}</strong>{deal.location ? ` · ${deal.location}` : ""}<br />
                      Book: {window_(deal.bookingStart, deal.bookingEnd)} · Travel: {window_(deal.travelStart, deal.travelEnd)}
                    </p>
                    <p>{deal.publicSummary || <em>No traveler-facing copy yet — write it before publishing.</em>}</p>
                  </div>
                  <div className="cms-actions">
                    <button className="ghost" onClick={() => startEdit(deal)}>Edit copy</button>
                    <button
                      className={deal.published ? "ghost" : "button"}
                      onClick={() => togglePublish(deal)}
                      disabled={!deal.published && !(deal.publicSummary || "").trim()}
                      title={!deal.published && !(deal.publicSummary || "").trim() ? "Add traveler-facing copy first" : undefined}
                    >
                      {deal.published ? "Unpublish" : "Publish"}
                    </button>
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
