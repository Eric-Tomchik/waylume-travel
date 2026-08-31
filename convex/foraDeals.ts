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

/**
 * Fora Communications & Branding Policy: advisors may not publicly promote specific rates,
 * discounts, benefits or promotions, and may not describe offers as exclusive to Fora.
 * Partner Engagement Policy: preferred partner rates and access are confidential.
 */
const RATE_PROMOTION_PATTERNS: Array<[RegExp, string]> = [
  [/\d+\s*(%|percent)/i, "a percentage discount"],
  [/[$€£]\s?\d/i, "a currency amount"],
  [/\b(third|fourth|fifth|second)\s+night\s+(free|complimentary|on\s+us)/i, "a free-night offer"],
  [/\bfree\s+night/i, "a free-night offer"],
  [/\bstay\s+\d+\s*,?\s*pay\s+\d+/i, "a stay/pay offer"],
  [/\b(discount|discounted|save|savings|reduced\s+rate|special\s+rate|preferred\s+rate|rebate)\b/i, "discount or rate language"],
  [/\b\d+\s*(usd|eur|gbp|dollars?|euros?)\b/i, "a currency amount"],
  [/\bexclusive(ly)?\b/i, "\"exclusive\" framing"],
  [/\b(off\s+(your|the|room|rates?|nightly))/i, "discount language"],
];

/** Brands Eric is not eligible to showcase publicly at his current Fora certification level. */
const RESTRICTED_BRAND_PATTERNS: Array<[RegExp, string]> = [
  [/four\s+seasons/i, "Four Seasons (Preferred Partner — Pro/X advisors only)"],
  [/virtuoso/i, "Virtuoso (Pro/X advisors only)"],
  [/\bmarriott\s+stars\b|\bluminous\b|\bstars\s*&\s*luminous\b/i, "Marriott STARS & LUMINOUS (X advisors only)"],
];

/** Returns a human-readable reason when public copy breaches Fora policy, else null. */
export function restrictedBrand(text: string): string | null {
  for (const [pattern, label] of RESTRICTED_BRAND_PATTERNS) {
    if (pattern.test(text)) {
      return `References ${label}. Fora restricts showcasing this partner affiliation publicly at your certification level.`;
    }
  }
  return null;
}

export function policyViolation(text: string): string | null {
  for (const [pattern, label] of RATE_PROMOTION_PATTERNS) {
    if (pattern.test(text)) {
      return `Public copy names ${label}. Fora's Communications & Branding Policy prohibits publicly promoting specific rates, discounts or promotions. Describe the value without the numbers.`;
    }
  }
  return restrictedBrand(text);
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

/** ISO date (YYYY-MM-DD) for "today" in UTC — Fora windows are plain dates. */
export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

type WindowFields = { bookingEnd?: string; travelEnd?: string };

/** A deal is dead once its booking window closed, or once all travel is in the past. */
export function isExpired(deal: WindowFields, today = todayIso()) {
  if (deal.bookingEnd && deal.bookingEnd < today) return true;
  if (deal.travelEnd && deal.travelEnd < today) return true;
  return false;
}

/** Days until the booking window closes, or null when there is no end date. */
export function daysUntilBookingEnd(deal: WindowFields, today = todayIso()) {
  if (!deal.bookingEnd) return null;
  const end = Date.parse(`${deal.bookingEnd}T00:00:00Z`);
  const now = Date.parse(`${today}T00:00:00Z`);
  if (!Number.isFinite(end)) return null;
  return Math.round((end - now) / 86_400_000);
}

/**
 * Everything blocking a deal from going public, or null when it is publishable.
 * Shared by the single-deal update, the bulk action and the admin list so the
 * rules can never drift apart.
 */
export function publishBlocker(deal: {
  supplier: string; title: string; publicTitle?: string; publicSummary?: string; bookingEnd?: string; travelEnd?: string;
}, today = todayIso()): string | null {
  const publicSummary = (deal.publicSummary || "").trim();
  if (!publicSummary) return "Write a traveler-facing summary before publishing this deal.";
  const publicText = `${deal.publicTitle || ""} ${publicSummary}`;
  if (hasTradeLanguage(publicText)) {
    return "Public copy still contains advisor-only language (commission, net rate, fam trip). Rewrite it for travelers.";
  }
  const violation = policyViolation(publicText) ?? restrictedBrand(`${deal.supplier} ${deal.title}`);
  if (violation) return violation;
  if (isExpired(deal, today)) return "This offer's booking or travel window has already closed.";
  return null;
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
    status: v.optional(v.string()),
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

    const today = todayIso();
    if (args.status && args.status !== "all") {
      deals = deals.filter(d => {
        const blocker = publishBlocker(d, today);
        switch (args.status) {
          case "published": return d.published;
          case "unpublished": return !d.published;
          // Copy written, no policy or expiry blocker — one click from going live.
          case "ready": return !d.published && !blocker;
          case "needs_copy": return !(d.publicSummary || "").trim();
          case "blocked": return Boolean((d.publicSummary || "").trim() && blocker && !isExpired(d, today));
          case "expired": return isExpired(d, today);
          default: return true;
        }
      });
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
        expired: isExpired(d, today),
        daysUntilBookingEnd: daysUntilBookingEnd(d, today),
        blocker: publishBlocker(d, today),
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
      readyToPublish: deals.filter(d => !d.published && !publishBlocker(d)).length,
      needsCopy: deals.filter(d => !(d.publicSummary || "").trim()).length,
      expiredPublished: deals.filter(d => d.published && isExpired(d)).length,
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

    // Publishing gate: copy exists, reads for travelers, respects Fora policy, still in window.
    if (published) {
      const blocker = publishBlocker({ ...deal, publicTitle, publicSummary });
      if (blocker) return { ok: false as const, error: blocker };
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

/**
 * Bulk publish / unpublish. Publishing runs the same gate per deal and reports
 * each rejection instead of failing the whole batch, so a curation pass over
 * thousands of imported offers stays a single action.
 */
export const bulkSetPublishedInternal = internalMutation({
  args: { ids: v.array(v.id("foraDeals")), published: v.boolean() },
  handler: async (ctx, args) => {
    const today = todayIso();
    const now = Date.now();
    const failures: Array<{ id: string; title: string; error: string }> = [];
    let updated = 0;

    for (const id of args.ids) {
      const deal = await ctx.db.get(id);
      if (!deal) {
        failures.push({ id, title: "Unknown deal", error: "Deal not found" });
        continue;
      }
      if (args.published) {
        const blocker = publishBlocker(deal, today);
        if (blocker) {
          failures.push({ id, title: deal.publicTitle || deal.title, error: blocker });
          continue;
        }
      }
      if (deal.published !== args.published) {
        await ctx.db.patch(id, { published: args.published, updatedAt: now });
      }
      updated += 1;
    }

    return { updated, failures };
  },
});
