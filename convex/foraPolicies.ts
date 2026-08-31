import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Fora advisor policies, captured from the Policies tab of advisor.fora.travel.
 *
 * These are host-agency compliance documents. They are admin-only reference
 * material: nothing here is ever served to the public site, because the
 * policies are Fora's content and several of them are explicitly confidential.
 */

const sectionValidator = v.object({
  heading: v.string(),
  level: v.number(),
  paragraphs: v.array(v.string()),
});

export const listForAdminInternal = internalQuery({
  args: { search: v.optional(v.string()), slug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const policies = await ctx.db.query("foraPolicies").withIndex("by_sortOrder").collect();
    policies.sort((a, b) => a.sortOrder - b.sortOrder);

    const term = (args.search || "").trim().toLowerCase();
    const matches = term
      ? policies.filter(p => p.plainText.includes(term) || p.title.toLowerCase().includes(term))
      : policies;

    return {
      total: policies.length,
      lastImportedAt: policies.reduce((max, p) => Math.max(max, p.importedAt), 0),
      policies: matches.map(p => ({
        _id: p._id,
        slug: p.slug,
        title: p.title,
        updatedLabel: p.updatedLabel,
        sourceUrl: p.sourceUrl,
        advisorNotes: p.advisorNotes,
        sectionCount: p.sections.length,
        // Full body is only returned for the policy being read, to keep the
        // list response small.
        sections: args.slug === p.slug || matches.length === 1 ? p.sections : undefined,
        // Number of sections whose text contains the search term.
        hits: term ? p.sections.filter(s => sectionText(s).includes(term)).length : undefined,
      })),
    };
  },
});

function sectionText(section: { heading: string; paragraphs: string[] }) {
  return `${section.heading} ${section.paragraphs.join(" ")}`.toLowerCase();
}

export const getInternal = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const policy = await ctx.db
      .query("foraPolicies")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .unique();
    return policy ?? null;
  },
});

export const saveNotesInternal = internalMutation({
  args: { slug: v.string(), advisorNotes: v.string() },
  handler: async (ctx, args) => {
    const policy = await ctx.db
      .query("foraPolicies")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .unique();
    if (!policy) return { ok: false, error: "Unknown policy." };
    await ctx.db.patch(policy._id, { advisorNotes: args.advisorNotes, updatedAt: Date.now() });
    return { ok: true };
  },
});

/**
 * Upsert by slug. Re-running an import refreshes Fora's text and leaves any
 * notes Eric has written on the policy untouched.
 */
export const importBatchInternal = internalMutation({
  args: {
    policies: v.array(
      v.object({
        slug: v.string(),
        title: v.string(),
        updatedLabel: v.string(),
        sourceUrl: v.string(),
        sections: v.array(sectionValidator),
        plainText: v.string(),
        sortOrder: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let created = 0;
    let updated = 0;

    for (const incoming of args.policies) {
      const existing = await ctx.db
        .query("foraPolicies")
        .withIndex("by_slug", q => q.eq("slug", incoming.slug))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, { ...incoming, importedAt: now, updatedAt: now });
        updated += 1;
      } else {
        await ctx.db.insert("foraPolicies", { ...incoming, importedAt: now });
        created += 1;
      }
    }

    return { created, updated };
  },
});
