import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const listActiveInternal = internalQuery({
  args: {},
  handler: async (ctx) => await ctx.db.query("promotions").withIndex("by_active", q => q.eq("active", true)).collect(),
});

export const listAllInternal = internalQuery({
  args: {},
  handler: async (ctx) => await ctx.db.query("promotions").collect(),
});

export const upsertInternal = internalMutation({
  args: {
    id: v.optional(v.id("promotions")),
    title: v.string(), description: v.string(), destination: v.optional(v.string()), badge: v.optional(v.string()),
    ctaLabel: v.string(), active: v.boolean(), sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...values } = args;
    if (id) {
      await ctx.db.patch(id, { ...values, updatedAt: Date.now() });
      return id;
    }
    return await ctx.db.insert("promotions", { ...values, createdAt: Date.now() });
  },
});
