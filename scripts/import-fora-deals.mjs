#!/usr/bin/env node
/**
 * Imports Fora advisor-portal deals into Convex.
 *
 * Idempotent: matched on Fora's deal id, so re-running refreshes source fields
 * and never touches published state or the traveler-facing copy you wrote.
 *
 *   CONVEX_SITE_URL=https://secret-heron-979.convex.site \
 *   WAYLUME_ADMIN_TOKEN=... \
 *   node scripts/import-fora-deals.mjs data/fora-deals.json
 */
import { readFileSync } from "node:fs";

const siteUrl = process.env.CONVEX_SITE_URL;
const token = process.env.WAYLUME_ADMIN_TOKEN;
const file = process.argv[2] || "data/fora-deals.json";
const BATCH = 100;

if (!siteUrl || !token) {
  console.error("Set CONVEX_SITE_URL and WAYLUME_ADMIN_TOKEN.");
  process.exit(1);
}

const source = JSON.parse(readFileSync(file, "utf8"));

const deals = source.map(deal => ({
  foraId: deal.id,
  title: deal.title,
  supplier: deal.supplier,
  supplierType: deal.supplier_type ?? undefined,
  location: deal.location ?? undefined,
  rawDescription: deal.description ?? "",
  bookingStart: deal.booking_window?.[0]?.start ?? undefined,
  bookingEnd: deal.booking_window?.[0]?.end ?? undefined,
  travelStart: deal.travel_window?.[0]?.start ?? undefined,
  travelEnd: deal.travel_window?.[0]?.end ?? undefined,
  exclusiveToFora: deal.exclusive_to_fora === true ? true : undefined,
  imageUrl: deal.image_url ?? undefined,
})).filter(deal => deal.foraId && deal.title && deal.supplier);

let created = 0;
let updated = 0;

for (let index = 0; index < deals.length; index += BATCH) {
  const batch = deals.slice(index, index + BATCH);
  const response = await fetch(`${siteUrl}/admin/fora-deals/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify({ deals: batch }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(`Batch at ${index} failed:`, data.error || response.status);
    process.exit(1);
  }
  created += data.created ?? 0;
  updated += data.updated ?? 0;
  process.stdout.write(`\rImported ${Math.min(index + BATCH, deals.length)}/${deals.length}`);
}

console.log(`\nDone. ${created} created, ${updated} updated.`);
