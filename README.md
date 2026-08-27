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

## Local setup

```bash
npm install
cp .env.example .env.local
npm run convex:dev
npm run dev
```

The example environment points at the existing Convex deployment URL. `convex dev` will connect/configure the project and generate the `convex/_generated` files used by the backend functions.

## Production deployment

1. Deploy Convex functions with `npm run convex:deploy`.
2. Set `NEXT_PUBLIC_CONVEX_URL` in the web host environment to the active Convex deployment URL.
3. Deploy the Next.js app to Vercel or another Node-compatible host.

## Lead flow

Browser form → `/api/trip-request` → Convex HTTP action `/trip-request` → `travelRequests` table.

New requests are created with status `new` and source `waylume-website`, ready for a future advisor dashboard, notifications, CRM integration, and supplier research workflow.

## Brand asset

`public/waylume-mark.svg` is a lightweight web mark based on the supplied Waylume identity and color direction. The original high-resolution company logo can be added later as `public/waylume-logo.png` for full wordmark usage without changing the application architecture.

## Next milestones

- Advisor/admin dashboard
- Promotions management
- Destination detail pages
- AI-assisted trip discovery
- Supplier / affiliate integrations where permitted
- Email notifications and follow-up automations
- Authentication and saved traveler profiles
