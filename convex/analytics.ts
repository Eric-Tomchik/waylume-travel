import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const track = mutation({
  args: {
    event: v.string(),
    surface: v.string(),
    travelRequestId: v.optional(v.id("travelRequests")),
    quoteId: v.optional(v.id("quotes")),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => await ctx.db.insert("analyticsEvents", { ...args, createdAt: Date.now() }),
});

export const summary = query({
  args: { adminSecret: v.string(), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const expected = process.env.WAYLUME_ADMIN_TOKEN;
    if (!expected || args.adminSecret !== expected) throw new Error("Unauthorized");
    const cutoff = Date.now() - Math.max(1, Math.min(args.days ?? 30, 365)) * 86400000;
    const events = (await ctx.db.query("analyticsEvents").withIndex("by_createdAt").order("desc").collect()).filter(e => e.createdAt >= cutoff);
    const counts: Record<string, number> = {};
    for (const item of events) counts[item.event] = (counts[item.event] ?? 0) + 1;
    return { total: events.length, counts, recent: events.slice(0, 50) };
  },
});
