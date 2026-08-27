# Waylume Travel — Phase 6

Phase 6 makes the traveler portal interactive and adds provider-ready operational infrastructure without presenting Waylume as the supplier booking system.

## Traveler quote responses

Travelers can accept or decline advisor-published, non-expired quotes inside the secure portal and optionally include a message.

Important: accepting a quote records the traveler's preference. It does **not** issue a ticket, charge a payment method, create a supplier reservation, or mark the trip as booked. Final booking remains an advisor/supplier workflow.

Quote responses are validated against the active portal token and associated trip before mutation.

## Portal access lifecycle

Advisors can now:

- list access links for a trip
- see active, expired, and revoked states
- revoke an active link
- replace an active link with a newly generated credential
- see creation/expiration metadata

Raw access tokens remain one-time outputs. Only hashes are stored.

## Notification center

`/admin/notifications` adds an advisor-managed queue for email and SMS communications.

When `WAYLUME_NOTIFICATION_WEBHOOK_URL` is not configured, messages remain queued and no delivery is claimed. When configured, the server can hand a queued message to an approved delivery adapter and record success/failure/provider metadata.

Optional variables:

- `WAYLUME_NOTIFICATION_WEBHOOK_URL`
- `WAYLUME_NOTIFICATION_WEBHOOK_SECRET`

## Analytics

Waylume now has first-party application event records for product-flow measurement without adding an advertising tracker.

`/admin/analytics` shows event counts and recent activity for a selected date window. Initial supported events include portal opens, page/planner activity, quote responses, and related Waylume workflow events.

## Itinerary Draft Builder

The advisor itinerary workspace can generate a deterministic supplier-neutral itinerary draft from a trip request. This keeps the workflow functional with no AI service configured.

An optional provider adapter can later replace the deterministic draft with an AI-produced draft while keeping the same advisor review/publish workflow:

- `WAYLUME_ITINERARY_DRAFT_WEBHOOK_URL`
- `WAYLUME_ITINERARY_DRAFT_WEBHOOK_SECRET`

AI/provider output is never published directly. It first loads into the advisor editor as a draft.

## Advisor navigation

The operations dashboard now links directly to:

- inquiries
- promotions
- supplier resources
- portal access
- notifications
- analytics

Inquiry cards also link directly into their quote, itinerary, and portal-access workspaces.

## Deployment validation

After merge:

1. Deploy the updated Convex functions.
2. Verify the existing `WAYLUME_ADMIN_TOKEN` in the web and Convex environments.
3. Generate a traveler portal link.
4. Publish a quote as `sent` and verify accept/decline controls appear.
5. Verify accepting the quote records `accepted` but does not finalize supplier booking.
6. Revoke the portal link and confirm it can no longer open the trip.
7. Generate an itinerary draft, review it, save it, then publish it.
8. Queue a notification. It should remain queued unless an approved delivery webhook is configured.
9. Review the resulting activity in `/admin/analytics`.
