import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";

const quoteStatus = v.union(v.literal("draft"), v.literal("sent"), v.literal("accepted"), v.literal("expired"), v.literal("declined"));

export const listByRequestInternal = internalQuery({
  args: { travelRequestId: v.id("travelRequests") },
  handler: async (ctx, args) => await ctx.db.query("quotes").withIndex("by_request", q => q.eq("travelRequestId", args.travelRequestId)).order("desc").collect(),
});

/**
 * Every quote across all trips, newest first, with enough trip context to be
 * usable on the standalone /admin/quotes screen (no requestId in the URL).
 */
export const listAllInternal = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const quotes = await ctx.db.query("quotes").order("desc").take(Math.min(args.limit ?? 100, 300));
    return await Promise.all(quotes.map(async quote => {
      const trip = await ctx.db.get(quote.travelRequestId);
      return {
        ...quote,
        travelerName: trip?.name,
        destination: trip?.destination,
      };
    }));
  },
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

export const travelerRespond = mutation({
  args: {
    tokenHash: v.string(),
    quoteId: v.id("quotes"),
    response: v.union(v.literal("accepted"), v.literal("declined")),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const access = await ctx.db.query("portalAccess").withIndex("by_tokenHash", q => q.eq("tokenHash", args.tokenHash)).unique();
    if (!access || access.revokedAt || access.expiresAt < Date.now() || !access.travelRequestId) throw new Error("Invalid or expired portal access");
    const quote = await ctx.db.get(args.quoteId);
    if (!quote || quote.travelRequestId !== access.travelRequestId || quote.status === "draft") throw new Error("Quote is not available for this traveler");
    if (quote.expiresAt && quote.expiresAt < Date.now()) throw new Error("Quote has expired");
    const now = Date.now();
    await ctx.db.patch(args.quoteId, { status: args.response, travelerMessage: args.message?.trim() || undefined, travelerRespondedAt: now, updatedAt: now });
    await ctx.db.patch(access.travelRequestId, { status: "quoted", updatedAt: now });
    await ctx.db.insert("analyticsEvents", { event: `quote_${args.response}`, surface: "traveler_portal", travelRequestId: access.travelRequestId, quoteId: args.quoteId, createdAt: now });
    return { ok: true, status: args.response };
  },
});
