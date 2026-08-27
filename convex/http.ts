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

http.route({
  path: "/trip-request",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      if (!body.name || !body.email || !body.destination) {
        return new Response(JSON.stringify({ error: "Name, email, and destination are required." }), { status: 400, headers: jsonHeaders });
      }
      const id = await ctx.runMutation(internal.travelRequests.create, {
        name: String(body.name).trim(), email: String(body.email).trim().toLowerCase(), destination: String(body.destination).trim(),
        dates: body.dates ? String(body.dates).trim() : undefined, travelers: body.travelers ? String(body.travelers).trim() : "2",
        budget: body.budget ? String(body.budget).trim() : undefined, tripType: body.tripType ? String(body.tripType).trim() : "Vacation Package",
        notes: body.notes ? String(body.notes).trim() : undefined,
      });
      return new Response(JSON.stringify({ ok: true, id }), { status: 201, headers: jsonHeaders });
    } catch {
      return new Response(JSON.stringify({ error: "Unable to process trip request." }), { status: 400, headers: jsonHeaders });
    }
  }),
});

http.route({
  path: "/promotions",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const promotions = await ctx.runQuery(internal.promotions.listActiveInternal, {});
    return new Response(JSON.stringify({ promotions }), { status: 200, headers: jsonHeaders });
  }),
});

http.route({
  path: "/admin/leads",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!isAdmin(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });
    const leads = await ctx.runQuery(internal.travelRequests.listRecentInternal, { limit: 100 });
    return new Response(JSON.stringify({ leads }), { status: 200, headers: jsonHeaders });
  }),
});

http.route({
  path: "/admin/leads",
  method: "PATCH",
  handler: httpAction(async (ctx, request) => {
    if (!isAdmin(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });
    try {
      const body = await request.json();
      if (!body.id) return new Response(JSON.stringify({ error: "Lead id is required" }), { status: 400, headers: jsonHeaders });
      const validStatus = body.status === undefined || ["new", "contacted", "quoted", "booked", "closed"].includes(body.status);
      if (!validStatus) return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400, headers: jsonHeaders });
      await ctx.runMutation(internal.travelRequests.updateInternal, {
        id: body.id as Id<"travelRequests">,
        status: body.status,
        advisorNotes: body.advisorNotes === undefined ? undefined : String(body.advisorNotes),
        followUpAt: typeof body.followUpAt === "number" ? body.followUpAt : undefined,
        clearFollowUp: Boolean(body.clearFollowUp),
      });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
    } catch {
      return new Response(JSON.stringify({ error: "Unable to update inquiry" }), { status: 400, headers: jsonHeaders });
    }
  }),
});

http.route({
  path: "/admin/promotions",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!isAdmin(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });
    const promotions = await ctx.runQuery(internal.promotions.listAllInternal, {});
    return new Response(JSON.stringify({ promotions }), { status: 200, headers: jsonHeaders });
  }),
});

http.route({
  path: "/admin/promotions",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!isAdmin(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: jsonHeaders });
    try {
      const body = await request.json();
      if (!body.title || !body.description) return new Response(JSON.stringify({ error: "Title and description are required" }), { status: 400, headers: jsonHeaders });
      const id = await ctx.runMutation(internal.promotions.upsertInternal, {
        id: body.id as Id<"promotions"> | undefined,
        title: String(body.title), description: String(body.description), destination: body.destination ? String(body.destination) : undefined,
        badge: body.badge ? String(body.badge) : undefined, ctaLabel: body.ctaLabel ? String(body.ctaLabel) : "Request options",
        active: body.active !== false, sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      });
      return new Response(JSON.stringify({ ok: true, id }), { status: 200, headers: jsonHeaders });
    } catch {
      return new Response(JSON.stringify({ error: "Unable to save promotion" }), { status: 400, headers: jsonHeaders });
    }
  }),
});

export default http;
