# Waylume Travel

**Waylume Travel — Independent Agent of Archer** is an advisor-backed travel discovery and planning platform built with Next.js, TypeScript, Convex, and an optional OpenAI conversational layer.

The product is intentionally designed around **AI discovery + human follow-through**. Travelers can explore and shape a trip with Waylume AI, then send the resulting brief into the advisor workflow for current supplier research, pricing, availability, terms, and booking support.

## Current capabilities

### Traveler experience

- Responsive travel-discovery website
- Destination and promotion discovery
- Guided Smart Planner
- Conversational **Waylume AI** concierge
- Floating AI concierge across public pages
- Full `/concierge` planning workspace
- Session-persistent conversation and trip brief
- AI-generated recommendation cards and itinerary previews
- Direct **Have Waylume price this trip** handoff into the existing lead pipeline
- Public trip-request form
- Passwordless traveler portal
- Quote review and accept/decline preference workflow
- Published itinerary viewing

### Advisor experience

- Protected advisor workspace at `/admin`
- Signed HttpOnly advisor sessions
- Inquiry pipeline and status management
- Quote workspace
- Itinerary workspace and draft-builder/provider adapter
- Traveler portal access management
- Promotions CMS
- Supplier resource workspace
- Notification queue/provider hooks
- First-party analytics, including AI concierge engagement events

### Platform and deployment

- Next.js 15 + React 19 + TypeScript
- Convex application data/backend
- GitHub Actions typecheck/build CI
- Vercel-compatible deployment
- Cloudflare Workers deployment through OpenNext
- Server-side secrets only; no provider keys are exposed to the browser
- Archer independent-agent disclosure language throughout the booking flow

## Local setup

```bash
npm install
cp .env.example .env.local
npm run convex:dev
npm run dev
```

## Environment variables

Core application:

- `NEXT_PUBLIC_CONVEX_URL` — Convex client endpoint.
- `CONVEX_SITE_URL` — Convex HTTP Actions endpoint.
- `WAYLUME_ADMIN_TOKEN` — strong advisor/backend secret; set in both the web host and Convex where required.
- `WAYLUME_ADMIN_SESSION_SECRET` — separate strong secret used to sign advisor sessions.
- `WAYLUME_INTAKE_SECRET` — shared web-host/Convex secret protecting the public intake handoff.
- `WAYLUME_SITE_ORIGIN` — optional exact public HTTPS origin used for origin checks.

Waylume AI:

- `OPENAI_API_KEY` — optional server-side OpenAI API key. If absent, the concierge remains functional in deterministic interactive demo mode.
- `WAYLUME_AI_MODEL` — optional model override. The default is `gpt-5.6-luna` for a cost-efficient conversational experience.

Optional providers:

- `RESEND_API_KEY`
- `WAYLUME_EMAIL_FROM`
- `WAYLUME_NOTIFICATION_WEBHOOK_URL`
- `WAYLUME_NOTIFICATION_WEBHOOK_SECRET`
- `WAYLUME_ITINERARY_DRAFT_WEBHOOK_URL`
- `WAYLUME_ITINERARY_DRAFT_WEBHOOK_SECRET`

Never commit real secret values.

## Waylume AI flow

```text
Traveler
  ↓
Floating concierge or /concierge
  ↓
/api/ai/concierge
  ├─ OPENAI_API_KEY configured → OpenAI Responses API + structured output
  └─ no key/provider failure → deterministic Waylume demo engine
  ↓
Live trip profile + recommendations + itinerary preview
  ↓
Have Waylume price this trip
  ↓
/api/trip-request
  ↓
Convex travelRequests
  ↓
Advisor workspace + supplier research
```

The AI is deliberately prevented from representing planning ideas as live supplier inventory. It may organize preferences, recommend directions, and draft itinerary ideas, but final flights, hotels, cruises, packages, availability, prices, payment terms, and bookings require advisor/supplier confirmation.

## AI privacy and guardrails

- OpenAI requests are sent server-side only.
- Concierge API calls use `store: false`.
- Browser analytics record interaction events such as open/message/handoff, not the traveler’s chat text.
- Conversation state is stored in browser `sessionStorage` for continuity during the current browsing session.
- Inputs and provider outputs are length-bounded and normalized before use.
- The public AI endpoint is rate-limited at the application layer; production edge-rate-limiting can be added through the hosting/CDN layer as traffic grows.

## Production deployment

1. Deploy/update the Convex functions.
2. Set the required Convex and Waylume secrets in the web host and Convex environments.
3. Deploy the Next.js application to Vercel or Cloudflare Workers.
4. Add `OPENAI_API_KEY` only when you want the concierge to use the live AI provider; the demo engine works without it.
5. Set `WAYLUME_SITE_ORIGIN` to the final HTTPS origin when the production domain is assigned.
6. Test the complete path: concierge → advisor handoff → `/admin` → quote/itinerary → traveler portal.

### Cloudflare Workers

The repository is configured for Cloudflare Workers with OpenNext while Convex remains the application backend.

```bash
npm install
npm run cf:build
npm run cf:preview
npm run cf:check
```

For deployment:

```bash
npx wrangler login
npx wrangler secret put WAYLUME_ADMIN_TOKEN
npx wrangler secret put WAYLUME_ADMIN_SESSION_SECRET
npx wrangler secret put WAYLUME_INTAKE_SECRET
npx wrangler secret put OPENAI_API_KEY   # optional
npm run cf:deploy
```

## Product direction

Waylume is not intended to be an autonomous travel agency. Its differentiator is a modern conversational planning interface that produces an unusually complete, structured brief for a real travel advisor. Supplier integrations can progressively add richer live inventory later without changing that advisor-backed operating model.
