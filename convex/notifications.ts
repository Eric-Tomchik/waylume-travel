import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function requireAdmin(secret: string) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  if (!expected || secret !== expected) throw new Error("Unauthorized");
}

export const list = query({
  args: { adminSecret: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    return await ctx.db.query("notificationQueue").order("desc").take(Math.min(args.limit ?? 50, 100));
  },
});

export const enqueue = mutation({
  args: { adminSecret: v.string(), channel: v.union(v.literal("email"), v.literal("sms")), recipient: v.string(), subject: v.optional(v.string()), message: v.string(), relatedTravelRequestId: v.optional(v.id("travelRequests")) },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    const { adminSecret, ...record } = args;
    void adminSecret;
    return await ctx.db.insert("notificationQueue", { ...record, status: "queued", createdAt: Date.now() });
  },
});

export const markResult = mutation({
  args: { adminSecret: v.string(), id: v.id("notificationQueue"), status: v.union(v.literal("sent"), v.literal("failed")), provider: v.optional(v.string()), providerMessageId: v.optional(v.string()), failureReason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    await ctx.db.patch(args.id, { status: args.status, provider: args.provider, providerMessageId: args.providerMessageId, failureReason: args.failureReason, sentAt: args.status === "sent" ? Date.now() : undefined, updatedAt: Date.now() });
    return { ok: true };
  },
});
