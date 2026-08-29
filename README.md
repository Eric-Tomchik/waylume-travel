# Waylume Travel

**Waylume Travel — Independent Agent of Fora Travel, Inc.** is an advisor-backed travel discovery and planning platform built with Next.js, TypeScript, Convex, and an optional OpenAI conversational layer.

The product is intentionally designed around **AI discovery + human supplier research**. Travelers use Waylume AI to explore what a trip could include, refine their preferences, and create a structured brief. The Waylume advisor then manually researches current supplier availability, final pricing, terms, and booking choices through the applicable Fora Travel, Inc. workflow.

## Current capabilities

### Traveler experience

- Responsive travel-discovery website
- Destination and promotion discovery
- Guided Smart Planner
- Conversational **Waylume AI** concierge
- Floating AI concierge across public pages
- Full `/concierge` discovery workspace
- Session-persistent conversation and trip brief
- AI-assisted possibility cards for destinations, stays, flights, cruises, and experiences
- Possible-itinerary previews that help visualize trip structure
- Direct **Research my options with Waylume** handoff into the existing lead pipeline
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
- Fora Travel independent-agent disclosure language throughout the booking flow

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
- `WAYLUME_INTAKE_SECRET` — shared web-host/Convex secret protecting the public intake handoff and analytics ingestion.
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
  └─ no key/provider failure → deterministic Waylume discovery engine
  ↓
Trip parameters + planning possibilities + possible itinerary shape
  ↓
Research my options with Waylume
  ↓
/api/trip-request
  ↓
Convex travelRequests
  ↓
Advisor workspace
  ↓
Manual Fora Travel supplier research
  ↓
Current supplier options + final pricing + terms presented to client
```

## Public AI boundaries

Waylume AI is **not a pricing, inventory, or booking engine**.

It may help the client explore:

- destinations and neighborhoods;
- hotel and resort styles;
- example properties or brands to research;
- flight and routing approaches;
- example airlines to research;
- cruise regions, cruise styles, and example cruise lines;
- activities, excursions, dining, and itinerary ideas.

It must not:

- generate or estimate airfare, hotel rates, cruise fares, package prices, discounts, or savings;
- claim live or confirmed availability;
- imply that any named property, flight, sailing, supplier, or travel product is currently bookable through Waylume;
- claim that a reservation, hold, payment, or booking has occurred.

A client budget can be collected as planning guidance so the AI can distinguish value-focused, mid-range, premium, and luxury directions. It is not used to generate a quote.

Final supplier availability, final pricing, payment requirements, booking terms, and confirmations are handled manually by the advisor through the applicable supplier workflow.

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
6. Test the complete path: concierge → advisor handoff → `/admin` → manual supplier research → quote/itinerary → traveler portal.
7. Specifically test price and availability questions to verify that the AI routes those requests to advisor research instead of inventing supplier facts.

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

Waylume is not intended to be an autonomous travel agency or a public fare engine. Its differentiator is a modern conversational discovery interface that creates an unusually complete, structured brief for a real travel advisor. The public site helps the client visualize what is possible; the advisor performs the actual supplier research needed to determine what is currently available and at what final price.
