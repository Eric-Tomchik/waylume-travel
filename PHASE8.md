# Phase 8 — Waylume AI Concierge

Phase 8 makes conversational trip discovery a first-class Waylume experience while preserving the advisor-led supplier research and booking model.

## Operating model

Waylume AI is the **discovery and qualification layer**. It helps the traveler understand what a trip could include and collects useful trip parameters.

The Waylume advisor is the **supplier research and booking layer**. After the client sends the trip brief, the advisor researches current options, availability, final pricing, terms, and booking choices through Fora-approved and supplier workflows.

```text
AI discovery → structured trip brief → advisor supplier research → client options → booking
```

## What changed

- Added a public `/concierge` workspace with a persistent conversation and live trip brief.
- Added a floating `Ask Waylume AI` launcher across public pages.
- Added `/api/ai/concierge` with two execution modes:
  - OpenAI Responses API when `OPENAI_API_KEY` is configured.
  - A deterministic Waylume discovery engine when no AI provider is configured or the provider is temporarily unavailable.
- Added structured extraction for destination, origin, dates/duration, travelers, planning budget, trip type, pace, lodging preferences, and interests.
- Added contextual cards that show destination, hotel/resort, flight, cruise, and experience **possibilities**, not confirmed inventory.
- Added a short possible-itinerary preview to help the client visualize the trip shape.
- Added `Research my options with Waylume`, which converts the current AI planning context into the existing `/api/trip-request` advisor pipeline.
- Added first-party analytics events for concierge opens, messages, and successful advisor handoffs without sending chat text into analytics.
- Updated the homepage so AI Concierge is the primary discovery path while retaining Smart Planner and the traditional trip-request form.

## Pricing and availability rule

Waylume AI must not function as a fare or booking engine. It must not:

- output, estimate, calculate, compare, or imply airfare, hotel rates, cruise fares, package prices, discounts, or savings;
- claim that a hotel room, flight, cruise sailing, package, fare, or activity is currently available or bookable;
- imply that a named hotel, airline, cruise line, supplier, property, or experience is currently available through Waylume;
- claim that a reservation, hold, payment, or booking has been completed.

A traveler may provide a budget, but the budget is used only as **planning guidance** to distinguish value, mid-range, premium, or luxury directions.

The AI may show examples and possibilities such as:

- destinations and neighborhoods;
- hotel and resort styles;
- example properties or brands to research;
- flight and routing approaches;
- example airlines to research;
- cruise regions, cruise styles, and example cruise lines;
- activities, excursions, dining, and itinerary ideas.

Any named travel product remains a **possibility to research**, not verified inventory.

Current supplier availability and final pricing are researched manually by the Waylume advisor after the trip parameters are received.

## OpenAI configuration

Add these only to the server/host environment:

```text
OPENAI_API_KEY=<secret>
WAYLUME_AI_MODEL=gpt-5.6-luna
```

`WAYLUME_AI_MODEL` is optional. The route uses the Responses API with structured JSON output and `store: false`. No API key is exposed to the browser.

Without `OPENAI_API_KEY`, the public demo remains conversational and usable, but its suggestions come from the deterministic built-in discovery engine rather than a model.

## Production checklist

1. Merge Phase 8 only after CI typecheck/build passes.
2. Let Cloudflare deploy the merged `main` branch.
3. Deploy the updated Convex analytics function and ensure `WAYLUME_INTAKE_SECRET` matches between the web host and Convex.
4. Verify `/concierge` works with no API key first.
5. Add `OPENAI_API_KEY` to the production host when live AI is desired.
6. Verify the header changes from `interactive demo` to `AI connected` after a successful model response.
7. Test prompts asking for prices and confirm the AI routes the client to advisor research instead of generating a price.
8. Test prompts asking whether a hotel/flight/cruise is available and confirm the AI does not claim live inventory.
9. Complete a test conversation and confirm the live trip brief updates.
10. Submit `Research my options with Waylume` and confirm the request appears in `/admin`.
11. Add edge-level rate limiting/WAF rules before high-volume promotion of the public AI endpoint.

## Future expansion

Supplier adapters can later enrich the advisor workspace with approved supplier data without changing the public operating model. If direct supplier APIs become available, supplier-derived facts should remain clearly distinguished from general AI planning suggestions, and client-facing pricing should only be displayed when the applicable supplier/agency workflow permits it.
