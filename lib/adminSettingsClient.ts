export type AdminSettings = {
  displayName?: string;
  roleTitle?: string;
  photo?: string;
  theme?: "light" | "dark" | "system";
  accent?: string;
  density?: "comfortable" | "compact";
  landingPage?: string;
  visibleMetrics?: string[];
  hasCustomPasscode?: boolean;
  passcodeUpdatedAt?: number;
};

export const THEME_STORAGE_KEY = "waylume-admin-theme";
export const ACCENT_STORAGE_KEY = "waylume-admin-accent";
export const DENSITY_STORAGE_KEY = "waylume-admin-density";

export const ALL_METRICS: Array<{ id: string; label: string }> = [
  { id: "totalLeads", label: "Total inquiries" },
  { id: "openLeads", label: "Open pipeline" },
  { id: "bookedLeads", label: "Booked" },
  { id: "totalQuotes", label: "Quotes" },
  { id: "acceptedQuotes", label: "Accepted quotes" },
  { id: "activePromotions", label: "Active promos" },
];

/** Applies theme/accent/density to <html> so every admin page picks them up. */
export function applyAppearance(settings: Pick<AdminSettings, "theme" | "accent" | "density">) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const theme = settings.theme || "system";
  const resolved = theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;
  root.setAttribute("data-admin-theme", resolved);
  root.setAttribute("data-admin-density", settings.density || "comfortable");
  if (settings.accent) root.style.setProperty("--admin-accent", settings.accent);
  else root.style.removeProperty("--admin-accent");

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(DENSITY_STORAGE_KEY, settings.density || "comfortable");
    if (settings.accent) localStorage.setItem(ACCENT_STORAGE_KEY, settings.accent);
    else localStorage.removeItem(ACCENT_STORAGE_KEY);
  } catch {
    // Private browsing modes can block storage; appearance still applies for this page view.
  }
}

export async function loadAdminSettings(): Promise<AdminSettings | null> {
  try {
    const response = await fetch("/api/admin/settings", { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) return null;
    const data = await response.json();
    return (data.settings as AdminSettings) ?? {};
  } catch {
    return null;
  }
}

export async function saveAdminSettings(patch: Partial<AdminSettings> & { photo?: string }) {
  const response = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(patch),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to save settings");
  return data;
}
