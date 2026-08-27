import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function requireAdmin(secret: string) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  if (!expected || secret !== expected) throw new Error("Unauthorized");
}

const source = v.optional(v.union(v.literal("manual"), v.literal("draft-builder"), v.literal("ai")));

export const listByRequest = query({
  args: { adminSecret: v.string(), travelRequestId: v.id("travelRequests") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    return await ctx.db.query("itineraries").withIndex("by_request", q => q.eq("travelRequestId", args.travelRequestId)).collect();
  },
});

export const upsert = mutation({
  args: {
    adminSecret: v.string(),
    id: v.optional(v.id("itineraries")),
    travelRequestId: v.id("travelRequests"),
    title: v.string(),
    summary: v.string(),
    days: v.array(v.object({ day: v.number(), title: v.string(), details: v.string() })),
    published: v.boolean(),
    source,
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    const { adminSecret, id, ...values } = args;
    void adminSecret;
    const record = { ...values, source: values.source ?? "manual" as const };
    if (id) {
      await ctx.db.patch(id, { ...record, updatedAt: Date.now() });
      return id;
    }
    return await ctx.db.insert("itineraries", { ...record, createdAt: Date.now() });
  },
});
