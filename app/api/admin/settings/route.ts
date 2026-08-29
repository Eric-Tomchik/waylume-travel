import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { hashPasscode, passcodeProblem, verifyPasscode } from "@/lib/adminPasscode";
import {
  getConvexServerClient,
  adminSettingsGet,
  adminSettingsGetCredential,
  adminSettingsSave,
  adminSettingsSetPasscode,
} from "@/lib/convexServer";

const THEMES = ["light", "dark", "system"];
const DENSITIES = ["comfortable", "compact"];
const LANDING_PAGES = ["/admin/overview", "/admin", "/admin/notifications", "/admin/quotes", "/admin/analytics"];
const METRICS = ["totalLeads", "openLeads", "bookedLeads", "totalQuotes", "acceptedQuotes", "activePromotions"];
const MAX_PHOTO_BYTES = 400_000;

function adminSecretFor(request: Request) {
  const token = process.env.WAYLUME_ADMIN_TOKEN;
  return token && isAdminRequest(request) ? token : null;
}

export async function GET(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const client = getConvexServerClient();
    const settings = await client.query(adminSettingsGet, { adminSecret });
    return NextResponse.json({ settings }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to load settings" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const patch: Record<string, unknown> = {};

    if (body.displayName !== undefined) patch.displayName = String(body.displayName).slice(0, 80);
    if (body.roleTitle !== undefined) patch.roleTitle = String(body.roleTitle).slice(0, 80);
    if (body.theme !== undefined) {
      if (!THEMES.includes(body.theme)) return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
      patch.theme = body.theme;
    }
    if (body.density !== undefined) {
      if (!DENSITIES.includes(body.density)) return NextResponse.json({ error: "Invalid density" }, { status: 400 });
      patch.density = body.density;
    }
    if (body.accent !== undefined) {
      if (!/^#[0-9a-fA-F]{6}$/.test(String(body.accent))) return NextResponse.json({ error: "Invalid accent colour" }, { status: 400 });
      patch.accent = String(body.accent).toLowerCase();
    }
    if (body.landingPage !== undefined) {
      if (!LANDING_PAGES.includes(body.landingPage)) return NextResponse.json({ error: "Invalid landing page" }, { status: 400 });
      patch.landingPage = body.landingPage;
    }
    if (body.visibleMetrics !== undefined) {
      if (!Array.isArray(body.visibleMetrics)) return NextResponse.json({ error: "Invalid metric selection" }, { status: 400 });
      patch.visibleMetrics = body.visibleMetrics.filter((metric: unknown) => METRICS.includes(String(metric))).map(String);
    }
    if (body.photo !== undefined) {
      const photo = body.photo === null || body.photo === "" ? "" : String(body.photo);
      if (photo) {
        if (!photo.startsWith("data:image/")) return NextResponse.json({ error: "Photo must be an image" }, { status: 400 });
        if (photo.length > MAX_PHOTO_BYTES) return NextResponse.json({ error: "Photo is too large after cropping" }, { status: 413 });
      }
      patch.photo = photo;
    }

    const client = getConvexServerClient();
    await client.mutation(adminSettingsSave, { adminSecret, ...patch });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to save settings" }, { status: 400 });
  }
}

/** Change the dashboard passcode. Requires the current passcode. */
export async function POST(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const current = String(body.currentPasscode || "");
    const next = String(body.newPasscode || "");

    const reverting = body.revertToSetupToken === true;
    if (!reverting) {
      const problem = passcodeProblem(next);
      if (problem) return NextResponse.json({ error: problem }, { status: 400 });
    }

    const client = getConvexServerClient();
    const credential = await client.query(adminSettingsGetCredential, { adminSecret });

    const currentIsValid = credential
      ? await verifyPasscode(current, credential.hash, credential.salt) || current === process.env.WAYLUME_ADMIN_TOKEN
      : current === process.env.WAYLUME_ADMIN_TOKEN;
    if (!currentIsValid) return NextResponse.json({ error: "Current passcode is incorrect." }, { status: 401 });

    if (reverting) {
      await client.mutation(adminSettingsSetPasscode, { adminSecret, passcodeHash: "", passcodeSalt: "" });
      return NextResponse.json({ ok: true, reverted: true });
    }

    if (next === process.env.WAYLUME_ADMIN_TOKEN) return NextResponse.json({ error: "Choose a passcode different from the setup token." }, { status: 400 });

    const { hash, salt } = await hashPasscode(next);
    await client.mutation(adminSettingsSetPasscode, { adminSecret, passcodeHash: hash, passcodeSalt: salt });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: `Unable to change passcode${detail ? `: ${detail}` : ""}` }, { status: 400 });
  }
}
