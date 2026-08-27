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
