"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then(response => response.json())
      .then(data => { if (data.authenticated) router.replace("/admin/overview"); })
      .catch(() => undefined);
  }, [router]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    setLoading(false);
    if (!response.ok) return setError("Invalid advisor passcode.");
    setPasscode("");
    router.push("/admin/overview");
    router.refresh();
  }

  return <main className="admin-shell"><div className="shell"><div className="admin-header"><div><Link href="/" className="back-link">← Public website</Link><span className="eyebrow">Waylume advisor</span><h1>Secure admin sign in</h1></div></div><form className="admin-login" onSubmit={login}><h2>Start an advisor session</h2><p>Your passcode is exchanged for an HttpOnly signed session cookie. The browser does not need to keep resending the passcode after login.</p><input type="password" autoComplete="current-password" value={passcode} onChange={event=>setPasscode(event.target.value)} placeholder="Advisor passcode" required/><button className="button" disabled={loading}>{loading?"Signing in…":"Sign in"}</button>{error&&<p className="error">{error}</p>}</form></div></main>;
}
