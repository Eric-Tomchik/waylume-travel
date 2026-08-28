# Phase 8 — Waylume AI Concierge

Phase 8 makes conversational trip planning a first-class Waylume experience while preserving the advisor-led booking model.

## What changed

- Added a public `/concierge` workspace with a persistent conversation and live trip brief.
- Added a floating `Ask Waylume AI` launcher across public pages.
- Added `/api/ai/concierge` with two execution modes:
  - OpenAI Responses API when `OPENAI_API_KEY` is configured.
  - A deterministic Waylume conversation engine when no AI provider is configured or the provider is temporarily unavailable.
- Added structured extraction for destination, origin, dates/duration, travelers, budget, trip type, pace, lodging preferences, and interests.
- Added contextual recommendation cards and a short itinerary preview.
- Added `Have Waylume price this trip`, which converts the current AI planning context into the existing `/api/trip-request` advisor pipeline.
- Added first-party analytics events for concierge opens, messages, and successful advisor handoffs without sending chat text into analytics.
- Updated the homepage so AI Concierge is the primary planning path while retaining Smart Planner and the traditional trip-request form.

## Guardrails

Waylume AI is a planning and discovery layer, not a source of unverified live inventory. It must not claim:

- live or guaranteed pricing unless supplied by a connected live supplier source;
- confirmed availability unless supplied by a connected live supplier source;
- a reservation or booking has been completed;
- guaranteed savings or private rates without evidence from the applicable supplier.

Final supplier availability, pricing, payment requirements, terms, and booking confirmations remain advisor/supplier actions.

## OpenAI configuration

Add these only to the server/host environment:

```text
OPENAI_API_KEY=<secret>
WAYLUME_AI_MODEL=gpt-5.6-luna
```

`WAYLUME_AI_MODEL` is optional. The route uses the Responses API with structured JSON output and `store: false`. No API key is exposed to the browser.

Without `OPENAI_API_KEY`, the public demo remains conversational and usable, but its recommendations come from the deterministic built-in planning engine rather than a model.

## Production checklist

1. Merge Phase 8 only after CI typecheck/build passes.
2. Let Vercel/Cloudflare deploy the merged `main` branch.
3. Verify `/concierge` works with no API key first.
4. Add `OPENAI_API_KEY` to the production host when live AI is desired.
5. Verify the header changes from `interactive demo` to `AI connected` after a successful model response.
6. Complete a test conversation and confirm the live trip brief updates.
7. Submit `Have Waylume price this trip` and confirm the request appears in `/admin`.
8. Verify final-pricing and booking disclosures remain visible.
9. Add edge-level rate limiting/WAF rules before high-volume promotion of the public AI endpoint.

## Future expansion

The current architecture leaves room for supplier-aware tools later. A future AI orchestration layer can call approved flight, hotel, cruise, destination, promotion, and CRM adapters, while keeping supplier-derived facts clearly separated from general AI planning suggestions.
