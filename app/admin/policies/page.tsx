"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { hasAdminSession } from "@/lib/adminClient";

type Section = { heading: string; level: number; paragraphs: string[] };

type Policy = {
  _id: string;
  slug: string;
  title: string;
  updatedLabel: string;
  sourceUrl: string;
  advisorNotes?: string;
  sectionCount: number;
  sections?: Section[];
  hits?: number;
};

/** The clauses that most often decide whether something is allowed. */
const QUICK_RULES: { rule: string; detail: string; slug: string }[] = [
  { rule: "Exclusivity", detail: "Fora must be your exclusive channel for commissionable bookings — no other host agency or channel. You are not required to book only preferred partners.", slug: "membership" },
  { rule: "Supplier payments", detail: "Partners pay Fora directly. Never take commission, bonus or incentive money from a supplier yourself.", slug: "booking-and-commissions" },
  { rule: "New partners", detail: "Introduce a new supplier to Fora at support@fora.travel before working with them.", slug: "booking-and-commissions" },
  { rule: "Reporting window", detail: "Bookings made outside Portal must be submitted within 48 hours. After 90 days commission may not be paid.", slug: "booking-and-commissions" },
  { rule: "Net rates", detail: "Certification required · booking over $1,500 · minimum 10% commission (12% preferred DMCs) · Fora invoices the client.", slug: "booking-and-commissions" },
  { rule: "Public promotion", detail: "Do not publicly promote specific rates, discounts or benefits unless the partner advertises the same offer publicly.", slug: "communications-and-branding" },
  { rule: "Affiliation language", detail: "Public marketing must say “independent travel advisor of Fora Travel”, “powered by Fora Travel” or “affiliate of Fora Travel”.", slug: "communications-and-branding" },
  { rule: "Imagery", detail: "Your own photos, Advisor Portal images, or Unsplash/Pexels — never photos lifted from a hotel website.", slug: "communications-and-branding" },
  { rule: "Outside businesses", detail: "Disclose any other travel-related business to support@fora.travel; never promote it inside the Fora community.", slug: "conflict-of-interest" },
];

function highlight(text: string, term: string) {
  if (!term) return text;
  const index = text.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length)}
    </>
  );
}

export default function ForaPoliciesAdminPage() {
  const [token, setToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [activeSlug, setActiveSlug] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [matchesOnly, setMatchesOnly] = useState(false);
  const [notes, setNotes] = useState("");
  const [lastImportedAt, setLastImportedAt] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeaders = useCallback((json = false) => ({
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { "x-admin-token": token } : {}),
  }), [token]);

  const load = useCallback(async (slug?: string, term?: string) => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    const nextTerm = term ?? appliedSearch;
    if (nextTerm.trim()) params.set("search", nextTerm.trim());
    if (slug) params.set("slug", slug);

    const response = await fetch(`/api/admin/fora-policies?${params.toString()}`, { headers: authHeaders(), cache: "no-store" });
    setLoading(false);
    if (!response.ok) {
      setAuthorized(false);
      setError("Unable to open the policy library.");
      return;
    }
    const data = await response.json();
    setAuthorized(true);
    setPolicies(data.policies ?? []);
    setLastImportedAt(data.lastImportedAt ?? 0);
    const current = (data.policies ?? []).find((p: Policy) => p.slug === (slug || activeSlug));
    if (current) setNotes(current.advisorNotes || "");
  }, [authHeaders, appliedSearch, activeSlug]);

  useEffect(() => {
    hasAdminSession().then(async ok => {
      if (ok) await load();
      setChecking(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = useMemo(() => policies.find(p => p.slug === activeSlug), [policies, activeSlug]);

  async function open(policy: Policy) {
    setActiveSlug(policy.slug);
    setNotes(policy.advisorNotes || "");
    setMessage("");
    await load(policy.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function runSearch(event: FormEvent) {
    event.preventDefault();
    setAppliedSearch(search);
    setMatchesOnly(Boolean(search.trim()));
    await load(activeSlug || undefined, search);
  }

  async function saveNotes(event: FormEvent) {
    event.preventDefault();
    if (!active) return;
    setError("");
    const response = await fetch("/api/admin/fora-policies", {
      method: "PATCH",
      headers: authHeaders(true),
      body: JSON.stringify({ slug: active.slug, advisorNotes: notes }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Unable to save your note.");
      return;
    }
    setMessage("Note saved against this policy.");
    await load(active.slug);
  }

  const term = appliedSearch.trim();
  const visibleSections = (active?.sections ?? []).filter(section => {
    if (!matchesOnly || !term) return true;
    return `${section.heading} ${section.paragraphs.join(" ")}`.toLowerCase().includes(term.toLowerCase());
  });

  return (
    <main className="admin-shell">
      <div className="shell">
        <div className="admin-header">
          <div>
            <Link href="/admin" className="back-link">← Trip inquiries</Link>
            <span className="eyebrow">Compliance</span>
            <h1>Fora policy library</h1>
          </div>
          <Link href="/admin/fora-deals" className="button small">Fora deals</Link>
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
            <div className="cms-list" style={{ marginBottom: 18 }}>
              <article>
                <div>
                  <small>Captured from advisor.fora.travel/policies</small>
                  <h3>{policies.length} policies · reference only</h3>
                  <p>
                    Fora&apos;s policies are incorporated into the Terms of Membership &amp; Service, which is the binding
                    contract — where they conflict, the Terms govern. This library is internal: none of it is served to
                    the public site.
                    {lastImportedAt ? ` Last refreshed ${new Date(lastImportedAt).toLocaleDateString()}.` : ""}
                  </p>
                </div>
              </article>
            </div>

            <form className="cms-form" onSubmit={runSearch}>
              <label className="wide">Search every policy
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="e.g. net rate, commission, logo, FAM, exclusivity" />
              </label>
              <label className="check-label">
                <input type="checkbox" checked={matchesOnly} onChange={e => setMatchesOnly(e.target.checked)} /> Show matching sections only
              </label>
              <div className="wide cms-actions">
                <button className="button">Search</button>
                {term && (
                  <button type="button" className="ghost" onClick={async () => { setSearch(""); setAppliedSearch(""); setMatchesOnly(false); await load(activeSlug || undefined, ""); }}>
                    Clear
                  </button>
                )}
              </div>
            </form>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            {loading && <p>Loading policies…</p>}

            {!active && (
              <>
                <h2 style={{ marginTop: 26 }}>Quick reference</h2>
                <div className="cms-list">
                  {QUICK_RULES.map(item => (
                    <article key={item.rule}>
                      <div>
                        <small>{item.slug.replace(/-/g, " ")}</small>
                        <h3>{item.rule}</h3>
                        <p>{item.detail}</p>
                      </div>
                      <div className="cms-actions">
                        <button className="ghost" onClick={() => { const p = policies.find(x => x.slug === item.slug); if (p) open(p); }}>
                          Open policy
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            <h2 style={{ marginTop: 26 }}>{term ? `Policies mentioning “${term}”` : "Policies"}</h2>
            {!policies.length && !loading && (
              <div className="empty-state">
                <h2>Nothing matches.</h2>
                <p>Clear the search, or run the policy import to populate the library.</p>
              </div>
            )}
            <div className="cms-list">
              {policies.map(policy => (
                <article key={policy._id}>
                  <div>
                    <small>
                      Last updated {policy.updatedLabel || "—"} · {policy.sectionCount} sections
                      {typeof policy.hits === "number" ? ` · ${policy.hits} matching section${policy.hits === 1 ? "" : "s"}` : ""}
                      {policy.advisorNotes ? " · has your note" : ""}
                    </small>
                    <h3>{policy.title}</h3>
                    {policy.advisorNotes && <p><em>{policy.advisorNotes}</em></p>}
                  </div>
                  <div className="cms-actions">
                    <button className={policy.slug === activeSlug ? "ghost" : "button"} onClick={() => open(policy)}>
                      {policy.slug === activeSlug ? "Reading" : "Read"}
                    </button>
                    <a className="ghost" href={policy.sourceUrl} target="_blank" rel="noreferrer">Open in Fora</a>
                  </div>
                </article>
              ))}
            </div>

            {active && (
              <section style={{ marginTop: 30, borderTop: "1px solid rgba(0,0,0,0.15)", paddingTop: 20 }}>
                <span className="eyebrow">Last updated {active.updatedLabel}</span>
                <h2>{active.title}</h2>

                <form className="cms-form" onSubmit={saveNotes}>
                  <label className="wide">Your note on this policy
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g. confirmed with Fora on 2026-09-02 that…" />
                  </label>
                  <div className="wide cms-actions"><button className="button">Save note</button></div>
                </form>

                {matchesOnly && term && (
                  <p><small>Showing {visibleSections.length} of {active.sections?.length ?? 0} sections containing “{term}”.</small></p>
                )}

                {visibleSections.map((section, index) => (
                  <div key={`${section.heading}-${index}`}>
                    {section.level >= 3
                      ? <h4 style={{ marginTop: 18, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 12 }}>{section.heading}</h4>
                      : <h3 style={{ marginTop: 22 }}>{section.heading}</h3>}
                    {section.paragraphs.map((paragraph, i) => (
                      <p key={i} style={{ maxWidth: "68ch" }}>{highlight(paragraph, term)}</p>
                    ))}
                  </div>
                ))}

                <p style={{ marginTop: 22 }}>
                  <a className="ghost" href={active.sourceUrl} target="_blank" rel="noreferrer">View this policy in the Fora portal</a>
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
