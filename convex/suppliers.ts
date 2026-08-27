import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const listInternal = internalQuery({
  args: {},
  handler: async (ctx) => await ctx.db.query("supplierLinks").collect(),
});

export const upsertInternal = internalMutation({
  args: { id: v.optional(v.id("supplierLinks")), name: v.string(), category: v.string(), url: v.string(), notes: v.optional(v.string()), active: v.boolean() },
  handler: async (ctx, args) => {
    const { id, ...values } = args;
    if (id) {
      await ctx.db.patch(id, { ...values, updatedAt: Date.now() });
      return id;
    }
    return await ctx.db.insert("supplierLinks", { ...values, createdAt: Date.now() });
  },
});
