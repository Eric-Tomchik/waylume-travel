import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const createInternal = internalMutation({
  args: { accessCode: v.string(), email: v.string(), title: v.string(), destination: v.string(), tripType: v.string(), notes: v.optional(v.string()) },
  handler: async (ctx, args) => await ctx.db.insert("savedTrips", { ...args, email: args.email.toLowerCase(), createdAt: Date.now() }),
});

export const getByAccessCodeInternal = internalQuery({
  args: { accessCode: v.string() },
  handler: async (ctx, args) => await ctx.db.query("savedTrips").withIndex("by_accessCode", q => q.eq("accessCode", args.accessCode)).unique(),
});

export const updateInternal = internalMutation({
  args: { id: v.id("savedTrips"), title: v.string(), destination: v.string(), tripType: v.string(), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { id, ...values } = args;
    await ctx.db.patch(id, { ...values, updatedAt: Date.now() });
    return { ok: true };
  },
});
