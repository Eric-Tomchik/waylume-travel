import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const allowedEvents = new Set([
  "page_view",
  "planner_started",
  "planner_match",
  "trip_request_started",
  "trip_request_submitted",
  "portal_opened",
  "quote_viewed",
  "itinerary_viewed",
  "ai_concierge_opened",
  "ai_message_sent",
  "ai_advisor_handoff",
]);

export const track = mutation({
  args: {
    intakeSecret: v.string(),
    event: v.string(),
    surface: v.string(),
    travelRequestId: v.optional(v.id("travelRequests")),
    quoteId: v.optional(v.id("quotes")),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expected = process.env.WAYLUME_INTAKE_SECRET;
    if (!expected || args.intakeSecret !== expected) throw new Error("Unauthorized");
    if (!allowedEvents.has(args.event)) throw new Error("Unsupported analytics event");
    if (!args.surface.trim() || args.surface.length > 80) throw new Error("Invalid analytics surface");
    if (args.metadata && args.metadata.length > 1000) throw new Error("Analytics metadata too large");

    const { intakeSecret: _intakeSecret, ...event } = args;
    return await ctx.db.insert("analyticsEvents", { ...event, createdAt: Date.now() });
  },
});

export const summary = query({
  args: { adminSecret: v.string(), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const expected = process.env.WAYLUME_ADMIN_TOKEN;
    if (!expected || args.adminSecret !== expected) throw new Error("Unauthorized");
    const cutoff = Date.now() - Math.max(1, Math.min(args.days ?? 30, 365)) * 86400000;
    const events = (await ctx.db.query("analyticsEvents").withIndex("by_createdAt").order("desc").collect()).filter(event => event.createdAt >= cutoff);
    const counts: Record<string, number> = {};
    for (const item of events) counts[item.event] = (counts[item.event] ?? 0) + 1;
    return { total: events.length, counts, recent: events.slice(0, 50) };
  },
});
