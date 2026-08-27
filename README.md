# Waylume Travel

Modern travel-discovery and lead-generation prototype for **Waylume Travel — Independent Agent of Archer**.

## What is included

- Responsive Next.js 15 landing experience
- Waylume navy/aqua brand system and compass-inspired mark
- Flights, resorts, cruises, and custom-trip discovery sections
- Functional trip-request form
- Next.js API proxy for lead submission
- Convex schema, HTTP endpoint, mutation, and recent-leads query
- Compliance-oriented disclosure language
- GitHub Actions frontend build/typecheck workflow

## Local setup

```bash
npm install
cp .env.example .env.local
npm run convex:dev
npm run dev
```

The example environment references the existing `secret-heron-979` Convex deployment. `convex dev` connects/configures the backend and generates the `convex/_generated` files used by Convex functions.

## Convex endpoints

- `NEXT_PUBLIC_CONVEX_URL=https://secret-heron-979.convex.cloud` — standard Convex client endpoint.
- `CONVEX_SITE_URL=https://secret-heron-979.convex.site` — HTTP Actions endpoint used by the server-side trip request proxy.

## Production deployment

1. Deploy Convex functions with `npm run convex:deploy`.
2. Set both `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_SITE_URL` in the web host environment.
3. Deploy the Next.js app to Vercel or another Node-compatible host.

## Lead flow

Browser form → `/api/trip-request` → Convex HTTP Action `/trip-request` → `travelRequests` table.

New requests are created with status `new` and source `waylume-website`, ready for a future advisor dashboard, notifications, CRM integration, and supplier research workflow.

## Brand asset

`public/waylume-mark.svg` is a lightweight web mark based on the supplied Waylume identity and color direction. The original high-resolution company logo can later be added as `public/waylume-logo.png` for full wordmark usage without changing the application architecture.

## Next milestones

- Advisor/admin dashboard
- Promotions management
- Destination detail pages
- AI-assisted trip discovery
- Supplier / affiliate integrations where permitted
- Email notifications and follow-up automations
- Authentication and saved traveler profiles
