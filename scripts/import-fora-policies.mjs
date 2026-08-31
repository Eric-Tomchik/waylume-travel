#!/usr/bin/env node
/**
 * Imports the Fora advisor-portal policy library into Convex.
 *
 * Idempotent: matched on policy slug, so re-running refreshes Fora's text
 * (useful when a policy's "Last Updated" date changes) and leaves any advisor
 * notes you have written on the policy untouched.
 *
 *   CONVEX_SITE_URL=https://secret-heron-979.convex.site \
 *   WAYLUME_ADMIN_TOKEN=... \
 *   node scripts/import-fora-policies.mjs data/fora-policies.json
 */
import { readFileSync } from "node:fs";

const siteUrl = process.env.CONVEX_SITE_URL;
const token = process.env.WAYLUME_ADMIN_TOKEN;
const file = process.argv[2] || "data/fora-policies.json";
const BATCH = 3;

if (!siteUrl || !token) {
  console.error("Set CONVEX_SITE_URL and WAYLUME_ADMIN_TOKEN.");
  process.exit(1);
}

const source = JSON.parse(readFileSync(file, "utf8"));

const policies = source
  .map(policy => ({
    slug: policy.slug,
    title: policy.title,
    updatedLabel: policy.updatedLabel ?? "",
    sourceUrl: policy.sourceUrl ?? "",
    sections: (policy.sections ?? []).map(section => ({
      heading: section.heading,
      level: Number(section.level) || 2,
      paragraphs: section.paragraphs ?? [],
    })),
    plainText: policy.plainText ?? "",
    sortOrder: Number(policy.sortOrder) || 0,
  }))
  .filter(policy => policy.slug && policy.title && policy.sections.length);

let created = 0;
let updated = 0;

for (let index = 0; index < policies.length; index += BATCH) {
  const batch = policies.slice(index, index + BATCH);
  const response = await fetch(`${siteUrl}/admin/fora-policies/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify({ policies: batch }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(`Batch at ${index} failed:`, data.error || response.status);
    process.exit(1);
  }
  created += data.created ?? 0;
  updated += data.updated ?? 0;
  process.stdout.write(`\rImported ${Math.min(index + BATCH, policies.length)}/${policies.length}`);
}

console.log(`\nDone. ${created} created, ${updated} updated.`);
