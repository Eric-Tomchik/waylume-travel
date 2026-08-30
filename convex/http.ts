import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const http = httpRouter();
const jsonHeaders = { "Content-Type": "application/json" };

function isAdmin(request: Request) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  return Boolean(expected && request.headers.get("x-admin-token") === expected);
}

function isTrustedIntake(request: Request) {
  const expected = process.env.WAYLUME_INTAKE_SECRET;
  return Boolean(expected && request.headers.get("x-waylume-intake-secret") === expected);
}

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });
}

http.route({ path: "/trip-request", method: "POST", handler: httpAction(async (ctx, request) => {
  if (!isTrustedIntake(request)) return unauthorized();
  try {
    const body = await request.json();
    const name = String(body.name || "").trim().slice(0, 100);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
    const destination = String(body.destination || "").trim().slice(0, 120);
    if (!name || !email || !destination || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response(JSON.stringify({ error: "Valid name, email, and destination are required." }), { status: 400, headers: jsonHeaders });
    const id = await ctx.runMutation(internal.travelRequests.create, {
      name, email, destination,
      phone: body.phone ? String(body.phone).trim().slice(0, 40) : undefined,
      contactPreference: body.contactPreference ? String(body.contactPreference).trim().slice(0, 20) : undefined,
      bestTime: body.bestTime ? String(body.bestTime).trim().slice(0, 40) : undefined,
      heardAbout: body.heardAbout ? String(body.heardAbout).trim().slice(0, 60) : undefined,
      marketingOptIn: body.marketingOptIn === true ? true : undefined,
      dates: body.dates ? String(body.dates).trim().slice(0, 100) : undefined,
      travelers: body.travelers ? String(body.travelers).trim().slice(0, 20) : "2",
      budget: body.budget ? String(body.budget).trim().slice(0, 50) : undefined,
      tripType: body.tripType ? String(body.tripType).trim().slice(0, 50) : "Vacation Package",
      notes: body.notes ? String(body.notes).trim().slice(0, 2000) : undefined,
    });
    return new Response(JSON.stringify({ ok: true, id }), { status: 201, headers: jsonHeaders });
  } catch { return new Response(JSON.stringify({ error: "Unable to process trip request." }), { status: 400, headers: jsonHeaders }); }
}) });

http.route({ path: "/promotions", method: "GET", handler: httpAction(async (ctx) => {
  const promotions = await ctx.runQuery(internal.promotions.listActiveInternal, {});
  return new Response(JSON.stringify({ promotions }), { status: 200, headers: jsonHeaders });
}) });

http.route({ path: "/admin/dashboard", method: "GET", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  const summary = await ctx.runQuery(internal.dashboard.summaryInternal, {});
  return new Response(JSON.stringify(summary), { status: 200, headers: jsonHeaders });
}) });

http.route({ path: "/admin/leads", method: "GET", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  const leads = await ctx.runQuery(internal.travelRequests.listRecentInternal, { limit: 100 });
  return new Response(JSON.stringify({ leads }), { status: 200, headers: jsonHeaders });
}) });

http.route({ path: "/admin/leads", method: "PATCH", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  try {
    const body = await request.json();
    if (!body.id) return new Response(JSON.stringify({ error: "Lead id is required" }), { status: 400, headers: jsonHeaders });
    if (body.status !== undefined && !["new", "contacted", "quoted", "booked", "closed"].includes(body.status)) return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400, headers: jsonHeaders });
    await ctx.runMutation(internal.travelRequests.updateInternal, {
      id: body.id as Id<"travelRequests">, status: body.status,
      advisorNotes: body.advisorNotes === undefined ? undefined : String(body.advisorNotes),
      followUpAt: typeof body.followUpAt === "number" ? body.followUpAt : undefined, clearFollowUp: Boolean(body.clearFollowUp),
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
  } catch { return new Response(JSON.stringify({ error: "Unable to update inquiry" }), { status: 400, headers: jsonHeaders }); }
}) });

http.route({ path: "/admin/leads", method: "DELETE", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  try {
    const body = await request.json();
    if (!body.id) return new Response(JSON.stringify({ error: "Lead id is required" }), { status: 400, headers: jsonHeaders });
    const result = await ctx.runMutation(internal.travelRequests.removeInternal, { id: body.id as Id<"travelRequests"> });
    if (!result.ok) return new Response(JSON.stringify({ error: "Inquiry not found" }), { status: 404, headers: jsonHeaders });
    return new Response(JSON.stringify(result), { status: 200, headers: jsonHeaders });
  } catch { return new Response(JSON.stringify({ error: "Unable to delete inquiry" }), { status: 400, headers: jsonHeaders }); }
}) });

http.route({ path: "/admin/quotes", method: "GET", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  const requestId = new URL(request.url).searchParams.get("requestId");
  if (!requestId) return new Response(JSON.stringify({ error: "requestId is required" }), { status: 400, headers: jsonHeaders });
  const quotes = await ctx.runQuery(internal.quotes.listByRequestInternal, { travelRequestId: requestId as Id<"travelRequests"> });
  return new Response(JSON.stringify({ quotes }), { status: 200, headers: jsonHeaders });
}) });

http.route({ path: "/admin/quotes", method: "POST", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  try {
    const body = await request.json();
    if (!body.travelRequestId || !body.title || !body.summary) return new Response(JSON.stringify({ error: "Request, title, and summary are required" }), { status: 400, headers: jsonHeaders });
    const id = await ctx.runMutation(internal.quotes.createInternal, {
      travelRequestId: body.travelRequestId as Id<"travelRequests">, title: String(body.title), summary: String(body.summary),
      amount: body.amount === undefined || body.amount === "" ? undefined : Number(body.amount), currency: String(body.currency || "USD"),
      supplierName: body.supplierName ? String(body.supplierName) : undefined, supplierReference: body.supplierReference ? String(body.supplierReference) : undefined,
      expiresAt: body.expiresAt ? Number(body.expiresAt) : undefined,
    });
    return new Response(JSON.stringify({ ok: true, id }), { status: 201, headers: jsonHeaders });
  } catch { return new Response(JSON.stringify({ error: "Unable to create quote" }), { status: 400, headers: jsonHeaders }); }
}) });

http.route({ path: "/admin/quotes", method: "PATCH", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  try {
    const body = await request.json();
    if (!body.id || !["draft", "sent", "accepted", "expired", "declined"].includes(body.status)) return new Response(JSON.stringify({ error: "Valid quote id and status are required" }), { status: 400, headers: jsonHeaders });
    await ctx.runMutation(internal.quotes.updateStatusInternal, { id: body.id as Id<"quotes">, status: body.status });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
  } catch { return new Response(JSON.stringify({ error: "Unable to update quote" }), { status: 400, headers: jsonHeaders }); }
}) });

http.route({ path: "/admin/promotions", method: "GET", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  const promotions = await ctx.runQuery(internal.promotions.listAllInternal, {});
  return new Response(JSON.stringify({ promotions }), { status: 200, headers: jsonHeaders });
}) });

http.route({ path: "/admin/promotions", method: "POST", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  try {
    const body = await request.json();
    if (!body.title || !body.description) return new Response(JSON.stringify({ error: "Title and description are required" }), { status: 400, headers: jsonHeaders });
    const id = await ctx.runMutation(internal.promotions.upsertInternal, {
      id: body.id as Id<"promotions"> | undefined, title: String(body.title), description: String(body.description), destination: body.destination ? String(body.destination) : undefined,
      badge: body.badge ? String(body.badge) : undefined, ctaLabel: body.ctaLabel ? String(body.ctaLabel) : "Request options", active: body.active !== false,
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    });
    return new Response(JSON.stringify({ ok: true, id }), { status: 200, headers: jsonHeaders });
  } catch { return new Response(JSON.stringify({ error: "Unable to save promotion" }), { status: 400, headers: jsonHeaders }); }
}) });

http.route({ path: "/admin/suppliers", method: "GET", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  const suppliers = await ctx.runQuery(internal.suppliers.listInternal, {});
  return new Response(JSON.stringify({ suppliers }), { status: 200, headers: jsonHeaders });
}) });

http.route({ path: "/admin/suppliers", method: "POST", handler: httpAction(async (ctx, request) => {
  if (!isAdmin(request)) return unauthorized();
  try {
    const body = await request.json();
    if (!body.name || !body.category || !body.url) return new Response(JSON.stringify({ error: "Name, category, and URL are required" }), { status: 400, headers: jsonHeaders });
    const id = await ctx.runMutation(internal.suppliers.upsertInternal, {
      id: body.id as Id<"supplierLinks"> | undefined, name: String(body.name), category: String(body.category), url: String(body.url),
      notes: body.notes ? String(body.notes) : undefined, active: body.active !== false,
    });
    return new Response(JSON.stringify({ ok: true, id }), { status: 200, headers: jsonHeaders });
  } catch { return new Response(JSON.stringify({ error: "Unable to save supplier resource" }), { status: 400, headers: jsonHeaders }); }
}) });

export default http;
