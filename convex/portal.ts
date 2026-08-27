import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function requireAdmin(secret: string) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  if (!expected || secret !== expected) throw new Error("Unauthorized");
}

export const createAccess = mutation({
  args: { adminSecret: v.string(), email: v.string(), tokenHash: v.string(), travelRequestId: v.optional(v.id("travelRequests")), expiresAt: v.number() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    return await ctx.db.insert("portalAccess", { email: args.email.toLowerCase(), tokenHash: args.tokenHash, travelRequestId: args.travelRequestId, expiresAt: args.expiresAt, createdAt: Date.now() });
  },
});

export const listAccess = query({
  args: { adminSecret: v.string(), travelRequestId: v.id("travelRequests") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    const records = await ctx.db.query("portalAccess").withIndex("by_request", q => q.eq("travelRequestId", args.travelRequestId)).order("desc").collect();
    return records.map(item => ({ _id: item._id, email: item.email, expiresAt: item.expiresAt, revokedAt: item.revokedAt, createdAt: item.createdAt, lastUsedAt: item.lastUsedAt }));
  },
});

export const revokeAccess = mutation({
  args: { adminSecret: v.string(), id: v.id("portalAccess") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    await ctx.db.patch(args.id, { revokedAt: Date.now() });
    return { ok: true };
  },
});

export const resolveAccess = query({
  args: { tokenHash: v.string() },
  handler: async (ctx, args) => {
    const access = await ctx.db.query("portalAccess").withIndex("by_tokenHash", q => q.eq("tokenHash", args.tokenHash)).unique();
    if (!access || access.revokedAt || access.expiresAt < Date.now()) return null;
    const request = access.travelRequestId ? await ctx.db.get(access.travelRequestId) : null;
    const quotes = access.travelRequestId ? await ctx.db.query("quotes").withIndex("by_request", q => q.eq("travelRequestId", access.travelRequestId!)).collect() : [];
    const itineraries = access.travelRequestId ? await ctx.db.query("itineraries").withIndex("by_request", q => q.eq("travelRequestId", access.travelRequestId!)).collect() : [];
    return {
      email: access.email,
      expiresAt: access.expiresAt,
      request: request ? { _id: request._id, destination: request.destination, dates: request.dates, travelers: request.travelers, tripType: request.tripType, status: request.status } : null,
      quotes: quotes.filter(q => q.status !== "draft").map(q => ({ _id: q._id, title: q.title, summary: q.summary, amount: q.amount, currency: q.currency, supplierName: q.supplierName, expiresAt: q.expiresAt, status: q.status, travelerMessage: q.travelerMessage, travelerRespondedAt: q.travelerRespondedAt })),
      itineraries: itineraries.filter(i => i.published).map(i => ({ _id: i._id, title: i.title, summary: i.summary, days: i.days, updatedAt: i.updatedAt ?? i.createdAt })),
    };
  },
});
