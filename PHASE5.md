# Waylume Travel — Phase 5

Phase 5 introduces the first traveler-facing private workspace while keeping the current deployment independent of a third-party identity provider.

## Secure traveler portal

- `/portal?token=...` loads a private trip workspace.
- Access tokens are generated with 256 bits of cryptographic randomness.
- Only SHA-256 token hashes are stored in Convex.
- Portal access links expire after seven days by default.
- The browser presents the token only to the Next.js server route; Convex receives only the hash.
- Draft quotes and unpublished itineraries are never returned to the traveler portal.

This is an immediately usable passwordless access model. A later phase can replace/augment it with Clerk, Auth.js, or another identity provider once the provider account and credentials are available.

## Traveler portal content

The portal displays:

- trip destination, dates, type, traveler count, and planning status
- advisor-published quotes and quote expiration dates
- advisor-published itineraries with day-by-day details
- clear supplier-pricing and booking disclaimers

## Advisor tools

- `/admin/portal-access` creates expiring traveler access links for a specific inquiry.
- `/admin/itineraries?requestId=<id>` creates and publishes day-by-day itineraries.
- Existing quote status controls determine whether a quote is traveler-visible; draft quotes remain private.

## Notification-ready foundation

The schema includes `notificationQueue` for future email/SMS delivery. Phase 5 intentionally does not claim delivery until an approved email/SMS provider is configured.

## Deployment

After merge:

1. Deploy Convex functions to `secret-heron-979`.
2. Confirm `NEXT_PUBLIC_CONVEX_URL` and `WAYLUME_ADMIN_TOKEN` are configured.
3. Create a test trip inquiry and quote.
4. Mark the quote `sent`.
5. Create and publish an itinerary.
6. Generate a traveler portal link from `/admin/portal-access`.
7. Open the generated link in a private/incognito browser and verify only traveler-safe data is visible.

## Security note

Portal links are bearer credentials. They should be delivered only to the intended traveler over an appropriate private communication channel. Anyone possessing an unexpired link can access the associated traveler view until the link expires or is revoked.
