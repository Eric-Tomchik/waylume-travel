import { internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";

const status = v.union(v.literal("new"), v.literal("contacted"), v.literal("quoted"), v.literal("booked"), v.literal("closed"));

function requireAdmin(secret: string) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  if (!expected || secret !== expected) throw new Error("Unauthorized");
}

export const create = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    contactPreference: v.optional(v.string()),
    bestTime: v.optional(v.string()),
    heardAbout: v.optional(v.string()),
    marketingOptIn: v.optional(v.boolean()),
    destination: v.string(),
    dates: v.optional(v.string()),
    travelers: v.string(),
    budget: v.optional(v.string()),
    tripType: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => await ctx.db.insert("travelRequests", {
    ...args,
    status: "new",
    source: "waylume-website",
    createdAt: Date.now(),
  }),
});

export const listRecentInternal = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => await ctx.db.query("travelRequests").withIndex("by_createdAt").order("desc").take(Math.min(args.limit ?? 50, 100)),
});

export const getForAdmin = query({
  args: { adminSecret: v.string(), id: v.id("travelRequests") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    return await ctx.db.get(args.id);
  },
});

export const updateInternal = internalMutation({
  args: {
    id: v.id("travelRequests"),
    status: v.optional(status),
    advisorNotes: v.optional(v.string()),
    followUpAt: v.optional(v.number()),
    clearFollowUp: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const patch: { status?: "new" | "contacted" | "quoted" | "booked" | "closed"; advisorNotes?: string; followUpAt?: number | undefined; updatedAt: number } = { updatedAt: Date.now() };
    if (args.status) patch.status = args.status;
    if (args.advisorNotes !== undefined) patch.advisorNotes = args.advisorNotes;
    if (args.clearFollowUp) patch.followUpAt = undefined;
    else if (args.followUpAt !== undefined) patch.followUpAt = args.followUpAt;
    await ctx.db.patch(args.id, patch);
    return { ok: true };
  },
});

/**
 * Permanently deletes a trip request and every record that hangs off it:
 * quotes, itineraries, portal access grants, and queued notifications.
 * Without this cascade the dashboard would keep showing orphaned children.
 */
export const removeInternal = internalMutation({
  args: { id: v.id("travelRequests") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) return { ok: false, reason: "not-found" };

    const quotes = await ctx.db.query("quotes").withIndex("by_request", q => q.eq("travelRequestId", args.id)).collect();
    for (const quote of quotes) await ctx.db.delete(quote._id);

    const itineraries = await ctx.db.query("itineraries").withIndex("by_request", q => q.eq("travelRequestId", args.id)).collect();
    for (const itinerary of itineraries) await ctx.db.delete(itinerary._id);

    const access = await ctx.db.query("portalAccess").withIndex("by_request", q => q.eq("travelRequestId", args.id)).collect();
    for (const grant of access) await ctx.db.delete(grant._id);

    const notifications = await ctx.db.query("notificationQueue").collect();
    for (const notification of notifications) {
      if (notification.relatedTravelRequestId === args.id) await ctx.db.delete(notification._id);
    }

    await ctx.db.delete(args.id);
    return { ok: true, deletedQuotes: quotes.length, deletedItineraries: itineraries.length };
  },
});
