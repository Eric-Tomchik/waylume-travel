import { internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";

const status = v.union(v.literal("new"), v.literal("contacted"), v.literal("quoted"), v.literal("booked"), v.literal("closed"));

export const create = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    destination: v.string(),
    dates: v.optional(v.string()),
    travelers: v.string(),
    budget: v.optional(v.string()),
    tripType: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("travelRequests", {
      ...args,
      status: "new",
      source: "waylume-website",
      createdAt: Date.now(),
    });
  },
});

export const listRecentInternal = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => await ctx.db.query("travelRequests").withIndex("by_createdAt").order("desc").take(Math.min(args.limit ?? 50, 100)),
});

export const updateStatusInternal = internalMutation({
  args: { id: v.id("travelRequests"), status },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return { ok: true };
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => await ctx.db.query("travelRequests").withIndex("by_createdAt").order("desc").take(Math.min(args.limit ?? 25, 100)),
});
