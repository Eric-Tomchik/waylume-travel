"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { hasAdminSession } from "@/lib/adminClient";

type Notification = {
  _id: string;
  channel: "email" | "sms";
  recipient: string;
  subject?: string;
  message: string;
  status: "queued" | "sent" | "failed";
  provider?: string;
  failureReason?: string;
  createdAt: number;
  sentAt?: number;
  relatedTravelRequestId?: string;
};

type NotificationForm = {
  channel: "email" | "sms";
  recipient: string;
  subject: string;
  message: string;
  relatedTravelRequestId: string;
};

const emptyForm: NotificationForm = {
  channel: "email",
  recipient: "",
  subject: "",
  message: "",
  relatedTravelRequestId: "",
};

export default function NotificationsPage() {
  const [token, setToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [items, setItems] = useState<Notification[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<NotificationForm>(emptyForm);

  function authHeaders(json = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (json) headers["Content-Type"] = "application/json";
    if (token) headers["x-admin-token"] = token;
    return headers;
  }

  async function load(event?: FormEvent) {
    event?.preventDefault();
    const response = await fetch("/api/admin/notifications", {
      headers: authHeaders(),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      setAuthorized(false);
      setMessage(data.error || "Unable to open notifications.");
      return;
    }
    setAuthorized(true);
    setItems(data.notifications ?? []);
    setMessage("");
  }

  useEffect(() => {
    hasAdminSession().then(async authenticated => {
      if (authenticated) await load();
      setChecking(false);
    });
  }, []);

  async function queueNotification(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: authHeaders(true),
      body: JSON.stringify({
        ...form,
        relatedTravelRequestId: form.relatedTravelRequestId || undefined,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to queue notification.");
      return;
    }
    setForm(emptyForm);
    await load();
    setMessage("Notification queued.");
  }

  async function sendNotification(item: Notification) {
    setMessage("");
    const response = await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: authHeaders(true),
      body: JSON.stringify(item),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to deliver notification.");
    } else {
      const providerLabel = data.provider ? ` through ${String(data.provider)}` : "";
      setMessage(`Notification sent${providerLabel}.`);
    }
    await load();
  }

  return (
    <main className="admin-shell">
      <div className="shell">
        <div className="admin-header">
          <div>
            <Link href="/admin/overview" className="back-link">← Dashboard</Link>
            <span className="eyebrow">Outbound communication</span>
            <h1>Notification center</h1>
          </div>
        </div>

        {checking && (
          <div className="admin-login">
            <h2>Checking advisor session…</h2>
          </div>
        )}

        {!checking && !authorized && (
          <form className="admin-login" onSubmit={load}>
            <h2>Advisor access</h2>
            <p>Sign in once for an 8-hour secure session, or use the legacy passcode fallback.</p>
            <Link className="button" href="/admin/login">Secure sign in</Link>
            <input
              type="password"
              value={token}
              onChange={event => setToken(event.target.value)}
              placeholder="Legacy admin passcode"
            />
            <button className="ghost">Open with passcode</button>
            {message && <p className="error">{message}</p>}
          </form>
        )}

        {authorized && (
          <>
            <form className="cms-form" onSubmit={queueNotification}>
              <h2>Queue a traveler message</h2>
              <label>
                Channel
                <select
                  value={form.channel}
                  onChange={event => setForm({ ...form, channel: event.target.value as "email" | "sms" })}
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </label>
              <label>
                Recipient
                <input
                  value={form.recipient}
                  onChange={event => setForm({ ...form, recipient: event.target.value })}
                  placeholder={form.channel === "email" ? "traveler@example.com" : "+15555555555"}
                  required
                />
              </label>
              <label>
                Subject
                <input
                  value={form.subject}
                  onChange={event => setForm({ ...form, subject: event.target.value })}
                  disabled={form.channel === "sms"}
                />
              </label>
              <label>
                Trip request ID
                <input
                  value={form.relatedTravelRequestId}
                  onChange={event => setForm({ ...form, relatedTravelRequestId: event.target.value })}
                  placeholder="Optional"
                />
              </label>
              <label className="wide">
                Message
                <textarea
                  value={form.message}
                  onChange={event => setForm({ ...form, message: event.target.value })}
                  required
                />
              </label>
              <button className="button wide">Queue notification</button>
              {message && <p className="wide success">{message}</p>}
            </form>

            <div className="notification-list">
              {items.length ? items.map(item => (
                <article key={item._id}>
                  <div>
                    <small>{item.channel} · {new Date(item.createdAt).toLocaleString()}</small>
                    <h3>{item.recipient}</h3>
                    {item.subject && <b>{item.subject}</b>}
                    <p>{item.message}</p>
                    {item.provider && <span className="muted">Provider: {item.provider}</span>}
                    {item.failureReason && <span className="error">{item.failureReason}</span>}
                  </div>
                  <div className="notification-actions">
                    <span className={`status-pill ${item.status}`}>{item.status}</span>
                    {item.status !== "sent" && (
                      <button className="ghost" onClick={() => sendNotification(item)}>Send now</button>
                    )}
                  </div>
                </article>
              )) : (
                <div className="empty-state">
                  <h2>No notifications yet.</h2>
                  <p>Queue the first traveler message above.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
