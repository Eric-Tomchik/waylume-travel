import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const listByRequestInternal = internalQuery({
  args: { travelRequestId: v.id("travelRequests") },
  handler: async (ctx, args) => await ctx.db.query("itineraries").withIndex("by_request", q => q.eq("travelRequestId", args.travelRequestId)).collect(),
});

export const upsertInternal = internalMutation({
  args: {
    id: v.optional(v.id("itineraries")),
    travelRequestId: v.id("travelRequests"),
    title: v.string(),
    summary: v.string(),
    days: v.array(v.object({ day: v.number(), title: v.string(), details: v.string() })),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...values } = args;
    if (id) {
      await ctx.db.patch(id, { ...values, updatedAt: Date.now() });
      return id;
    }
    return await ctx.db.insert("itineraries", { ...values, createdAt: Date.now() });
  },
});
