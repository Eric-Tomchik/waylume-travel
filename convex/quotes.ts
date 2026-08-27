import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

const quoteStatus = v.union(v.literal("draft"), v.literal("sent"), v.literal("accepted"), v.literal("expired"), v.literal("declined"));

export const listByRequestInternal = internalQuery({
  args: { travelRequestId: v.id("travelRequests") },
  handler: async (ctx, args) => await ctx.db.query("quotes").withIndex("by_request", q => q.eq("travelRequestId", args.travelRequestId)).order("desc").collect(),
});

export const createInternal = internalMutation({
  args: {
    travelRequestId: v.id("travelRequests"), title: v.string(), summary: v.string(), amount: v.optional(v.number()),
    currency: v.string(), supplierName: v.optional(v.string()), supplierReference: v.optional(v.string()), expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("quotes", { ...args, status: "draft", createdAt: Date.now() });
    await ctx.db.patch(args.travelRequestId, { status: "quoted", updatedAt: Date.now() });
    return id;
  },
});

export const updateStatusInternal = internalMutation({
  args: { id: v.id("quotes"), status: quoteStatus },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() });
    return { ok: true };
  },
});
