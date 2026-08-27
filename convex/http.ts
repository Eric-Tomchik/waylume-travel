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
        name: String(body.name).trim(),
        email: String(body.email).trim().toLowerCase(),
        destination: String(body.destination).trim(),
        dates: body.dates ? String(body.dates).trim() : undefined,
        travelers: body.travelers ? String(body.travelers).trim() : "2",
        budget: body.budget ? String(body.budget).trim() : undefined,
        tripType: body.tripType ? String(body.tripType).trim() : "Vacation Package",
        notes: body.notes ? String(body.notes).trim() : undefined,
      });
      return new Response(JSON.stringify({ ok: true, id }), { status: 201, headers: jsonHeaders });
    } catch {
      return new Response(JSON.stringify({ error: "Unable to process trip request." }), { status: 400, headers: jsonHeaders });
    }
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
      if (!body.id || !["new", "contacted", "quoted", "booked", "closed"].includes(body.status)) {
        return new Response(JSON.stringify({ error: "Valid id and status are required" }), { status: 400, headers: jsonHeaders });
      }
      await ctx.runMutation(internal.travelRequests.updateStatusInternal, { id: body.id as Id<"travelRequests">, status: body.status });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
    } catch {
      return new Response(JSON.stringify({ error: "Unable to update inquiry" }), { status: 400, headers: jsonHeaders });
    }
  }),
});

export default http;
