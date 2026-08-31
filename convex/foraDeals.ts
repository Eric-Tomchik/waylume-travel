import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Fora supplier deals imported from the Fora advisor portal.
 *
 * Two-tier content model, on purpose:
 *  - `rawDescription` is advisor-facing copy straight from Fora. It routinely
 *    contains commission rates and other trade-only language, so it is NEVER
 *    exposed on the public site — admin surfaces only.
 *  - `publicTitle` / `publicSummary` are the traveler-facing copy Eric writes.
 *    A deal cannot be published without a public summary, and the summary is
 *    rejected if it still reads like trade copy.
 */

/** Words that must never reach a traveler-facing page. */
const TRADE_PATTERNS = [
  /commission/i,
  /\bfam\b/i,
  /familiari[sz]ation/i,
  /advisor\s+(bonus|incentive|reward)/i,
  /\bnet\s+rate/i,
  /booking\s+incentive/i,
];

export function hasTradeLanguage(text: string) {
  return TRADE_PATTERNS.some(pattern => pattern.test(text));
}

/** Shape returned to the public website. Raw advisor copy is deliberately absent. */
function toPublic(deal: {
  _id: string; publicTitle?: string; title: string; publicSummary?: string; supplier: string;
  supplierType?: string; location?: string; imageUrl?: string; bookingEnd?: string;
  travelStart?: string; travelEnd?: string; exclusiveToFora?: boolean; sortOrder: number;
}) {
  return {
    id: deal._id,
    title: deal.publicTitle || deal.title,
    summary: deal.publicSummary || "",
    supplier: deal.supplier,
    supplierType: deal.supplierType,
    location: deal.location,
    imageUrl: deal.imageUrl,
    bookBy: deal.bookingEnd,
    travelStart: deal.travelStart,
    travelEnd: deal.travelEnd,
    exclusiveToFora: deal.exclusiveToFora === true,
    sortOrder: deal.sortOrder,
  };
}

export const listPublishedInternal = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const deals = await ctx.db
      .query("foraDeals")
      .withIndex("by_published", q => q.eq("published", true))
      .take(args.limit ?? 60);
    return deals.map(toPublic);
  },
});

export const listForAdminInternal = internalQuery({
  args: {
    search: v.optional(v.string()),
    supplierType: v.optional(v.string()),
    publishedOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 100, 300);
    const search = (args.search || "").trim().toLowerCase();

    let deals = args.publishedOnly
      ? await ctx.db.query("foraDeals").withIndex("by_published", q => q.eq("published", true)).collect()
      : await ctx.db.query("foraDeals").collect();

    if (args.supplierType) deals = deals.filter(d => d.supplierType === args.supplierType);
    if (search) {
      deals = deals.filter(d =>
        d.title.toLowerCase().includes(search) ||
        d.supplier.toLowerCase().includes(search) ||
        (d.location || "").toLowerCase().includes(search));
    }

    deals.sort((a, b) => Number(b.published) - Number(a.published) || a.sortOrder - b.sortOrder || a.supplier.localeCompare(b.supplier));

    return {
      total: deals.length,
      deals: deals.slice(args.offset ?? 0, (args.offset ?? 0) + limit).map(d => ({
        _id: d._id,
        foraId: d.foraId,
        title: d.title,
        supplier: d.supplier,
        supplierType: d.supplierType,
        location: d.location,
        rawDescription: d.rawDescription,
        publicTitle: d.publicTitle,
        publicSummary: d.publicSummary,
        bookingStart: d.bookingStart,
        bookingEnd: d.bookingEnd,
        travelStart: d.travelStart,
        travelEnd: d.travelEnd,
        exclusiveToFora: d.exclusiveToFora,
        imageUrl: d.imageUrl,
        published: d.published,
        sortOrder: d.sortOrder,
        tradeLanguage: d.tradeLanguage,
      })),
    };
  },
});

export const statsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const deals = await ctx.db.query("foraDeals").collect();
    const byType: Record<string, number> = {};
    for (const deal of deals) byType[deal.supplierType || "other"] = (byType[deal.supplierType || "other"] || 0) + 1;
    return {
      total: deals.length,
      published: deals.filter(d => d.published).length,
      readyToPublish: deals.filter(d => !d.published && (d.publicSummary || "").trim().length > 0).length,
      lastImportedAt: deals.reduce((max, d) => Math.max(max, d.importedAt), 0),
      byType,
    };
  },
});

const dealInput = v.object({
  foraId: v.string(),
  title: v.string(),
  supplier: v.string(),
  supplierType: v.optional(v.string()),
  location: v.optional(v.string()),
  rawDescription: v.string(),
  bookingStart: v.optional(v.string()),
  bookingEnd: v.optional(v.string()),
  travelStart: v.optional(v.string()),
  travelEnd: v.optional(v.string()),
  exclusiveToFora: v.optional(v.boolean()),
  imageUrl: v.optional(v.string()),
});

/**
 * Idempotent bulk import. Re-importing refreshes the Fora-sourced fields and
 * leaves Eric's edits (public copy, publish state, ordering) untouched.
 */
export const importBatchInternal = internalMutation({
  args: { deals: v.array(dealInput) },
  handler: async (ctx, args) => {
    let created = 0;
    let updated = 0;
    const now = Date.now();

    for (const deal of args.deals) {
      const existing = await ctx.db
        .query("foraDeals")
        .withIndex("by_foraId", q => q.eq("foraId", deal.foraId))
        .first();

      const sourceFields = { ...deal, tradeLanguage: hasTradeLanguage(`${deal.title} ${deal.rawDescription}`) };

      if (existing) {
        await ctx.db.patch(existing._id, { ...sourceFields, updatedAt: now });
        updated += 1;
      } else {
        await ctx.db.insert("foraDeals", { ...sourceFields, published: false, sortOrder: 0, importedAt: now });
        created += 1;
      }
    }

    return { created, updated };
  },
});

export const updateInternal = internalMutation({
  args: {
    id: v.id("foraDeals"),
    publicTitle: v.optional(v.string()),
    publicSummary: v.optional(v.string()),
    published: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.id);
    if (!deal) return { ok: false as const, error: "Deal not found" };

    const publicSummary = args.publicSummary === undefined ? deal.publicSummary : args.publicSummary.trim();
    const publicTitle = args.publicTitle === undefined ? deal.publicTitle : args.publicTitle.trim();
    const published = args.published === undefined ? deal.published : args.published;

    // Publishing gate: traveler-facing copy must exist and must be free of trade language.
    if (published) {
      if (!publicSummary) {
        return { ok: false as const, error: "Write a traveler-facing summary before publishing this deal." };
      }
      if (hasTradeLanguage(`${publicTitle || ""} ${publicSummary}`)) {
        return { ok: false as const, error: "Public copy still contains advisor-only language (commission, net rate, fam trip). Rewrite it for travelers." };
      }
    }

    await ctx.db.patch(args.id, {
      publicTitle: publicTitle || undefined,
      publicSummary: publicSummary || undefined,
      published,
      sortOrder: args.sortOrder === undefined ? deal.sortOrder : args.sortOrder,
      updatedAt: Date.now(),
    });

    return { ok: true as const };
  },
});

export const unpublishAllInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    const published = await ctx.db.query("foraDeals").withIndex("by_published", q => q.eq("published", true)).collect();
    for (const deal of published) await ctx.db.patch(deal._id, { published: false, updatedAt: Date.now() });
    return { unpublished: published.length };
  },
});
