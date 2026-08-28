# Waylume Travel

Modern travel-discovery and lead-generation prototype for **Waylume Travel — Independent Agent of Archer**.

## Current capabilities

- Responsive Next.js 15 + TypeScript website
- Waylume navy/aqua brand system
- Flights, resorts, cruises, and custom-trip discovery sections
- Curated destination discovery page
- Promotions/inspiration page designed to avoid presenting unverified live pricing
- Functional trip-request form
- Convex-backed lead pipeline
- Protected advisor workspace at `/admin`
- Inquiry status workflow: `new → contacted → quoted → booked → closed`
- Server-side admin proxy so the Convex admin secret is never embedded in client code
- Private Convex lead queries/mutations
- GitHub Actions frontend build/typecheck workflow
- Archer independent-agent disclosure language

## Local setup

```bash
npm install
cp .env.example .env.local
npm run convex:dev
npm run dev
```

The example environment references the existing `secret-heron-979` Convex deployment. `convex dev` connects/configures the backend and generates the `convex/_generated` files used by Convex functions.

## Environment

- `NEXT_PUBLIC_CONVEX_URL=https://secret-heron-979.convex.cloud` — standard Convex client endpoint.
- `CONVEX_SITE_URL=https://secret-heron-979.convex.site` — HTTP Actions endpoint.
- `WAYLUME_ADMIN_TOKEN` — long random secret used for advisor access. Configure the same value in the web-host environment and the Convex deployment environment. Never commit the real value.

## Lead flow

Public workflow:

`Traveler → /api/trip-request → Convex /trip-request → travelRequests table`

Advisor workflow:

`/admin → Next.js protected API → Convex protected HTTP Action → private internal query/mutation`

The browser submits the advisor passcode to the Next.js server over HTTPS. The server verifies it before proxying a request to Convex. Convex independently verifies the same secret before allowing lead access or status changes.

## Production deployment

1. Configure/deploy Convex functions to `secret-heron-979` with `npm run convex:deploy`.
2. Set `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_SITE_URL` in the web host.
3. Generate a strong `WAYLUME_ADMIN_TOKEN` and set the same value in both the web host and Convex environment.
4. Deploy the Next.js app to Vercel, Cloudflare Workers, or another compatible host.
5. Test a public trip submission and verify it appears in `/admin`.

### Cloudflare Workers

This project is configured for Cloudflare Workers through OpenNext. Convex remains
the application database and HTTP Actions backend.

```bash
npm install
npm run cf:build
npm run cf:preview
```

Before the first permanent deployment, authenticate Wrangler and store secrets in
Cloudflare. Use the same production values already configured for Vercel and
Convex; do not place them in `wrangler.jsonc`.

```bash
npx wrangler login
npx wrangler secret put WAYLUME_ADMIN_TOKEN
npx wrangler secret put WAYLUME_ADMIN_SESSION_SECRET
npx wrangler secret put WAYLUME_INTAKE_SECRET
npm run cf:deploy
```

Add optional provider secrets with `wrangler secret put` only when those
integrations are enabled. After assigning a production hostname, set
`WAYLUME_SITE_ORIGIN` as a Worker variable or secret to that exact HTTPS origin.

Useful commands:

- `npm run cf:types` regenerates Cloudflare binding types.
- `npm run cf:check` validates the built Worker without deploying.
- `npm run cf:preview` runs the production Worker locally.

## Brand asset

`public/waylume-mark.svg` is the current lightweight web mark based on the supplied Waylume identity and color direction. The original high-resolution company logo can later be added as `public/waylume-logo.png` for full wordmark usage without changing the application architecture.

## Next milestones

- Database-driven promotions CMS
- Individual destination detail pages
- Advisor notes and follow-up timestamps
- Email notifications
- AI-assisted trip discovery
- Supplier / affiliate integrations where permitted
- Authentication and saved traveler profiles
