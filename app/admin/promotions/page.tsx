"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { hasAdminSession } from "@/lib/adminClient";

type Promotion = {
  _id?: string;
  title: string;
  description: string;
  destination: string;
  badge: string;
  ctaLabel: string;
  active: boolean;
  sortOrder: number;
};

const emptyPromotion: Promotion = { title: "", description: "", destination: "", badge: "", ctaLabel: "Request current options", active: true, sortOrder: 0 };

export default function PromotionsAdminPage() {
  const [token, setToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [form, setForm] = useState<Promotion>(emptyPromotion);
  const [message, setMessage] = useState("");

  function authHeaders(json = false) {
    return { ...(json ? { "Content-Type": "application/json" } : {}), ...(token ? { "x-admin-token": token } : {}) };
  }

  async function load(e?: FormEvent) {
    e?.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/promotions", { headers: authHeaders(), cache: "no-store" });
    if (!response.ok) { setAuthorized(false); return setMessage("Unable to open promotions manager."); }
    const data = await response.json();
    setAuthorized(true);
    setPromotions(data.promotions ?? []);
  }

  useEffect(() => {
    hasAdminSession().then(async ok => { if (ok) await load(); setChecking(false); });
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    const response = await fetch("/api/admin/promotions", {
      method: "POST",
      headers: authHeaders(true),
      body: JSON.stringify(form),
    });
    if (!response.ok) return setMessage("Unable to save promotion.");
    setForm(emptyPromotion);
    await load();
    setMessage("Promotion saved.");
  }

  function edit(promo: Promotion) {
    setForm({ ...promo, destination: promo.destination || "", badge: promo.badge || "", ctaLabel: promo.ctaLabel || "Request current options" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="admin-shell">
      <div className="shell">
        <div className="admin-header"><div><Link href="/admin" className="back-link">← Trip inquiries</Link><span className="eyebrow">Advisor content</span><h1>Promotions manager</h1></div><Link href="/deals" className="button small">View public promotions</Link></div>
        {checking && <div className="admin-login"><h2>Checking advisor session…</h2></div>}
        {!checking && !authorized && (
          <form className="admin-login" onSubmit={load}>
            <h2>Advisor access</h2><Link className="button" href="/admin/login">Secure sign in</Link><input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Legacy admin passcode"/><button className="ghost">Open with passcode</button>{message && <p className="error">{message}</p>}
          </form>
        )}
        {authorized && <>
          <form className="cms-form" onSubmit={save}>
            <h2>{form._id ? "Edit promotion" : "Create promotion"}</h2>
            <label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></label>
            <label>Badge<input value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})} placeholder="Beach escape"/></label>
            <label className="wide">Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></label>
            <label>Destination / inquiry seed<input value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})}/></label>
            <label>CTA label<input value={form.ctaLabel} onChange={e=>setForm({...form,ctaLabel:e.target.value})}/></label>
            <label>Sort order<input type="number" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:Number(e.target.value)})}/></label>
            <label className="check-label"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/> Active on public page</label>
            <div className="wide cms-actions"><button className="button">Save promotion</button>{form._id && <button type="button" className="ghost" onClick={()=>setForm(emptyPromotion)}>Cancel edit</button>}</div>
            {message && <p className="wide success">{message}</p>}
          </form>
          {!promotions.length && <div className="empty-state"><h2>No promotions yet.</h2><p>Create the first promotion above. Active items automatically appear on the public promotions page.</p></div>}
          <div className="cms-list">{[...promotions].sort((a,b)=>a.sortOrder-b.sortOrder).map(promo=><article key={promo._id}><div><small>{promo.active ? "Active" : "Hidden"} · order {promo.sortOrder}</small><h3>{promo.title}</h3><p>{promo.description}</p></div><button className="ghost" onClick={()=>edit(promo)}>Edit</button></article>)}</div>
        </>}
      </div>
    </main>
  );
}
