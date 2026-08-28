"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasAdminSession, logoutAdminSession } from "@/lib/adminClient";

type Summary = {
  totalLeads: number; openLeads: number; bookedLeads: number; totalQuotes: number; acceptedQuotes: number; activePromotions: number;
  counts: Record<string, number>;
  upcoming: Array<{ _id: string; name: string; destination: string; followUpAt?: number; status: string }>;
};

export default function OverviewPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  async function load(e?: FormEvent) {
    e?.preventDefault(); setError("");
    const response = await fetch("/api/admin/dashboard", { headers: token ? { "x-admin-token": token } : undefined, cache: "no-store" });
    if (!response.ok) return setError("Unable to open dashboard.");
    setSummary(await response.json());
  }

  useEffect(() => {
    hasAdminSession().then(async authenticated => {
      if (authenticated) await load();
      setCheckingSession(false);
    });
  }, []);

  async function logout() {
    await logoutAdminSession();
    router.push("/admin/login");
    router.refresh();
  }

  return <main className="admin-shell"><div className="shell">
    <div className="admin-header"><div><Link href="/" className="back-link">← Public website</Link><span className="eyebrow">Waylume operations</span><h1>Advisor dashboard</h1></div>{summary&&<button className="ghost" onClick={logout}>Sign out</button>}</div>
    {checkingSession ? <div className="admin-login"><h2>Checking advisor session…</h2></div> : !summary ? <form className="admin-login" onSubmit={load}><h2>Advisor access</h2><p>Sign in once to create an 8-hour secure advisor session, or use the legacy passcode fallback below.</p><Link className="button" href="/admin/login">Secure sign in</Link><input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Legacy admin passcode"/><button className="ghost">Open with passcode</button>{error && <p className="error">{error}</p>}</form> : <>
      <nav className="operations-nav"><Link href="/admin">Trip inquiries</Link><Link href="/admin/promotions">Promotions</Link><Link href="/admin/suppliers">Suppliers</Link><Link href="/admin/portal-access">Portal access</Link><Link href="/admin/notifications">Notifications</Link><Link href="/admin/analytics">Analytics</Link></nav>
      <section className="metric-grid">
        <article><small>Total inquiries</small><b>{summary.totalLeads}</b></article><article><small>Open pipeline</small><b>{summary.openLeads}</b></article><article><small>Booked</small><b>{summary.bookedLeads}</b></article><article><small>Quotes</small><b>{summary.totalQuotes}</b></article><article><small>Accepted quotes</small><b>{summary.acceptedQuotes}</b></article><article><small>Active promos</small><b>{summary.activePromotions}</b></article>
      </section>
      <section className="dashboard-grid"><article className="dashboard-panel"><h2>Pipeline</h2>{Object.entries(summary.counts).map(([label,value])=><div className="pipeline-row" key={label}><span>{label}</span><b>{value}</b></div>)}</article><article className="dashboard-panel"><h2>Upcoming follow-ups</h2>{summary.upcoming.length ? summary.upcoming.map(item=><div className="follow-row" key={item._id}><div><b>{item.name}</b><small>{item.destination} · {item.status}</small></div><time>{item.followUpAt ? new Date(item.followUpAt).toLocaleDateString() : ""}</time></div>) : <p className="muted">No upcoming follow-ups are scheduled.</p>}</article></section>
    </>}
  </div></main>;
}
