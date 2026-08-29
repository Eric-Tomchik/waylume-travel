"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminAvatarCropper from "@/components/AdminAvatarCropper";
import { hasAdminSession } from "@/lib/adminClient";
import { ALL_METRICS, AdminSettings, applyAppearance, loadAdminSettings, saveAdminSettings } from "@/lib/adminSettingsClient";

const ACCENTS = ["#0aa7b5", "#0d6efd", "#7c3aed", "#0f9d58", "#e07a3f", "#d94a6a"];
const LANDING_PAGES = [
  { value: "/admin/overview", label: "Dashboard overview" },
  { value: "/admin", label: "Trip inquiries" },
  { value: "/admin/notifications", label: "Notifications" },
  { value: "/admin/quotes", label: "Quotes" },
  { value: "/admin/analytics", label: "Analytics" },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({});
  const [cropping, setCropping] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [passcodeStatus, setPasscodeStatus] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  useEffect(() => {
    hasAdminSession().then(async ok => {
      setAuthorized(ok);
      if (ok) {
        const loaded = await loadAdminSettings();
        if (loaded) {
          setSettings(loaded);
          applyAppearance(loaded);
        }
      }
      setChecking(false);
    });
  }, []);

  async function persist(patch: Partial<AdminSettings>, message = "Saved") {
    setError(""); setStatus("");
    const next = { ...settings, ...patch };
    setSettings(next);
    applyAppearance(next);
    try {
      await saveAdminSettings(patch);
      setStatus(message);
      setTimeout(() => setStatus(""), 2500);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save settings");
    }
  }

  async function changePasscode(event: FormEvent) {
    event.preventDefault();
    setPasscodeError(""); setPasscodeStatus("");
    if (newPasscode !== confirmPasscode) return setPasscodeError("The new passcodes do not match.");
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ currentPasscode, newPasscode }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setPasscodeError(data.error || "Unable to change passcode.");
    setPasscodeStatus("Passcode updated. Use it the next time you sign in.");
    setCurrentPasscode(""); setNewPasscode(""); setConfirmPasscode("");
    setSettings(current => ({ ...current, hasCustomPasscode: true, passcodeUpdatedAt: Date.now() }));
  }

  const metrics = settings.visibleMetrics ?? ALL_METRICS.map(metric => metric.id);

  if (checking) return <main className="admin-shell"><div className="shell"><div className="admin-login"><h2>Checking advisor session…</h2></div></div></main>;
  if (!authorized) return <main className="admin-shell"><div className="shell"><div className="admin-login"><h2>Advisor access</h2><p>Sign in to manage dashboard settings.</p><Link className="button" href="/admin/login">Secure sign in</Link></div></div></main>;

  return <main className="admin-shell"><div className="shell">
    <div className="admin-header">
      <div>
        <Link href="/admin/overview" className="back-link">← Dashboard overview</Link>
        <span className="eyebrow">Advisor workspace</span>
        <h1>Settings</h1>
      </div>
    </div>

    <div className="settings-grid">
      <section className="settings-card">
        <h2>Profile</h2>
        <p>Your name and photo appear in the dashboard header.</p>
        <div className="avatar-row">
          {settings.photo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img className="avatar-preview" src={settings.photo} alt="Profile" />
            : <div className="avatar-empty">No photo yet</div>}
          <div className="cropper-actions">
            <button type="button" className="button small" onClick={() => setCropping(true)}>{settings.photo ? "Replace photo" : "Upload photo"}</button>
            {settings.photo && <button type="button" className="ghost" onClick={() => persist({ photo: "" }, "Photo removed")}>Remove</button>}
          </div>
        </div>
        {cropping && (
          <div style={{ marginTop: 18 }}>
            <AdminAvatarCropper
              onCancel={() => setCropping(false)}
              onCropped={async dataUrl => { setCropping(false); await persist({ photo: dataUrl }, "Photo saved"); }}
            />
          </div>
        )}
        <div className="settings-row" style={{ marginTop: 18 }}>
          <label>Display name
            <input type="text" value={settings.displayName ?? ""} onChange={event => setSettings({ ...settings, displayName: event.target.value })} onBlur={event => persist({ displayName: event.target.value })} placeholder="Eric Tomchik" />
          </label>
          <label>Title
            <input type="text" value={settings.roleTitle ?? ""} onChange={event => setSettings({ ...settings, roleTitle: event.target.value })} onBlur={event => persist({ roleTitle: event.target.value })} placeholder="Travel Advisor" />
          </label>
        </div>
      </section>

      <section className="settings-card">
        <h2>Appearance</h2>
        <p>Applies to every admin page on this device and is saved to your account.</p>
        <label style={{ marginBottom: 14 }}>Theme</label>
        <div className="choice-row">
          {(["light", "dark", "system"] as const).map(theme => (
            <button key={theme} type="button" className="choice" aria-pressed={(settings.theme ?? "system") === theme} onClick={() => persist({ theme })}>
              {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Match system"}
            </button>
          ))}
        </div>
        <label style={{ margin: "20px 0 12px" }}>Accent colour</label>
        <div className="swatch-row">
          {ACCENTS.map(accent => (
            <button key={accent} type="button" className="swatch" style={{ background: accent }} aria-pressed={(settings.accent ?? ACCENTS[0]) === accent} aria-label={`Accent ${accent}`} onClick={() => persist({ accent })} />
          ))}
        </div>
        <label style={{ margin: "20px 0 12px" }}>Density</label>
        <div className="choice-row">
          {(["comfortable", "compact"] as const).map(density => (
            <button key={density} type="button" className="choice" aria-pressed={(settings.density ?? "comfortable") === density} onClick={() => persist({ density })}>
              {density === "comfortable" ? "Comfortable" : "Compact"}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-card">
        <h2>Dashboard</h2>
        <p>Choose which metric tiles appear on the overview, and where signing in takes you.</p>
        <div className="metric-toggles">
          {ALL_METRICS.map(metric => (
            <label key={metric.id}>
              <input
                type="checkbox"
                checked={metrics.includes(metric.id)}
                onChange={event => {
                  const next = event.target.checked ? [...metrics, metric.id] : metrics.filter(id => id !== metric.id);
                  persist({ visibleMetrics: next });
                }}
              />
              {metric.label}
            </label>
          ))}
        </div>
        <div className="settings-row" style={{ marginTop: 18 }}>
          <label>Landing page after sign-in
            <select value={settings.landingPage ?? "/admin/overview"} onChange={event => persist({ landingPage: event.target.value })}>
              {LANDING_PAGES.map(page => <option key={page.value} value={page.value}>{page.label}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="settings-card">
        <h2>Security</h2>
        <p>
          {settings.hasCustomPasscode
            ? "You are signing in with your own passcode."
            : "You are still using the setup token generated during installation. Changing it here is recommended."}
        </p>
        <form onSubmit={changePasscode}>
          <div className="settings-row">
            <label>Current passcode
              <input type="password" value={currentPasscode} onChange={event => setCurrentPasscode(event.target.value)} autoComplete="current-password" required />
            </label>
            <label>New passcode
              <input type="password" value={newPasscode} onChange={event => setNewPasscode(event.target.value)} autoComplete="new-password" required />
            </label>
            <label>Confirm new passcode
              <input type="password" value={confirmPasscode} onChange={event => setConfirmPasscode(event.target.value)} autoComplete="new-password" required />
            </label>
          </div>
          <div className="settings-actions">
            <button className="button small" type="submit">Update passcode</button>
            {passcodeStatus && <span className="settings-status">{passcodeStatus}</span>}
            {passcodeError && <span className="error">{passcodeError}</span>}
          </div>
        </form>
        <p style={{ marginTop: 16, fontSize: 12 }}>
          At least 12 characters, with a letter and a number or symbol. The original setup token stays valid as an emergency recovery key.
        </p>
      </section>
    </div>

    <div className="settings-actions">
      {status && <span className="settings-status">{status}</span>}
      {error && <span className="error">{error}</span>}
      <button className="ghost" type="button" onClick={() => router.push("/admin/overview")}>Back to dashboard</button>
    </div>
  </div></main>;
}
