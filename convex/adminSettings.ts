import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const KEY = "singleton";

function requireAdmin(secret: string) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  if (!expected || secret !== expected) throw new Error("Unauthorized");
}

/** Settings safe to expose to a signed-in advisor: never includes passcode material. */
export const get = query({
  args: { adminSecret: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    const row = await ctx.db.query("adminSettings").withIndex("by_key", q => q.eq("key", KEY)).unique();
    if (!row) return null;
    return {
      displayName: row.displayName,
      roleTitle: row.roleTitle,
      photo: row.photo,
      theme: row.theme,
      accent: row.accent,
      density: row.density,
      landingPage: row.landingPage,
      visibleMetrics: row.visibleMetrics,
      hasCustomPasscode: Boolean(row.passcodeHash),
      passcodeUpdatedAt: row.passcodeUpdatedAt,
      updatedAt: row.updatedAt,
    };
  },
});

/** Passcode hash + salt. Server-side use only (login verification). */
export const getCredential = query({
  args: { adminSecret: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    const row = await ctx.db.query("adminSettings").withIndex("by_key", q => q.eq("key", KEY)).unique();
    if (!row?.passcodeHash || !row.passcodeSalt) return null;
    return { hash: row.passcodeHash, salt: row.passcodeSalt };
  },
});

export const save = mutation({
  args: {
    adminSecret: v.string(),
    displayName: v.optional(v.string()),
    roleTitle: v.optional(v.string()),
    photo: v.optional(v.string()),
    theme: v.optional(v.string()),
    accent: v.optional(v.string()),
    density: v.optional(v.string()),
    landingPage: v.optional(v.string()),
    visibleMetrics: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    const { adminSecret, ...patch } = args;
    void adminSecret;
    const existing = await ctx.db.query("adminSettings").withIndex("by_key", q => q.eq("key", KEY)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, { ...patch, updatedAt: Date.now() });
      return { ok: true };
    }
    await ctx.db.insert("adminSettings", { key: KEY, ...patch, updatedAt: Date.now() });
    return { ok: true };
  },
});

/** Passing empty strings clears the custom passcode and reverts to the setup token. */
export const setPasscode = mutation({
  args: { adminSecret: v.string(), passcodeHash: v.string(), passcodeSalt: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    const now = Date.now();
    const clearing = args.passcodeHash === "" || args.passcodeSalt === "";
    const existing = await ctx.db.query("adminSettings").withIndex("by_key", q => q.eq("key", KEY)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, clearing
        ? { passcodeHash: undefined, passcodeSalt: undefined, passcodeUpdatedAt: undefined, updatedAt: now }
        : { passcodeHash: args.passcodeHash, passcodeSalt: args.passcodeSalt, passcodeUpdatedAt: now, updatedAt: now });
      return { ok: true };
    }
    await ctx.db.insert("adminSettings", { key: KEY, passcodeHash: args.passcodeHash, passcodeSalt: args.passcodeSalt, passcodeUpdatedAt: now, updatedAt: now });
    return { ok: true };
  },
});
