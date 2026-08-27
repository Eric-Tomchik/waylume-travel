import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const createAccessInternal = internalMutation({
  args: { email: v.string(), tokenHash: v.string(), travelRequestId: v.optional(v.id("travelRequests")), expiresAt: v.number() },
  handler: async (ctx, args) => await ctx.db.insert("portalAccess", { ...args, email: args.email.toLowerCase(), createdAt: Date.now() }),
});

export const resolveAccessInternal = internalQuery({
  args: { tokenHash: v.string() },
  handler: async (ctx, args) => {
    const access = await ctx.db.query("portalAccess").withIndex("by_tokenHash", q => q.eq("tokenHash", args.tokenHash)).unique();
    if (!access || access.revokedAt || access.expiresAt < Date.now()) return null;
    const request = access.travelRequestId ? await ctx.db.get(access.travelRequestId) : null;
    const quotes = access.travelRequestId ? await ctx.db.query("quotes").withIndex("by_request", q => q.eq("travelRequestId", access.travelRequestId!)).collect() : [];
    const itineraries = access.travelRequestId ? await ctx.db.query("itineraries").withIndex("by_request", q => q.eq("travelRequestId", access.travelRequestId!)).collect() : [];
    return { access, request, quotes: quotes.filter(q => q.status !== "draft"), itineraries: itineraries.filter(i => i.published) };
  },
});

export const markUsedInternal = internalMutation({
  args: { id: v.id("portalAccess") },
  handler: async (ctx, args) => { await ctx.db.patch(args.id, { lastUsedAt: Date.now() }); return { ok: true }; },
});
