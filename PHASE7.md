# Waylume Travel — Phase 7

Phase 7 is the production-hardening pass for Waylume's current advisor and traveler platform. It strengthens public intake, moves the advisor workspace onto signed sessions, adds direct email-provider support, and formalizes supplier integration boundaries without pretending unapproved live booking connectivity exists.

## Public intake hardening

The trip-request API now includes:

- server-side field normalization and maximum lengths
- server-side email validation
- honeypot-compatible bot rejection
- a 32 KB request-body limit
- optional exact-origin enforcement through `WAYLUME_SITE_ORIGIN`
- best-effort per-IP application rate limiting using Cloudflare/forwarded client IP headers when available
- bounded cleanup for the in-process rate-limit store
- a required server-to-server `WAYLUME_INTAKE_SECRET`

The shared intake secret must be configured in both the web host and Convex deployment. The Convex `/trip-request` HTTP action rejects unauthenticated direct writes and repeats important field constraints as defense in depth.

The in-process limiter remains a baseline safeguard, not a substitute for a distributed WAF/rate-limit product. Cloudflare rate limiting or another shared control should be layered on for high-volume public deployment.

## Advisor authentication

`/api/admin/session` exchanges the existing advisor passcode for an 8-hour signed HttpOnly cookie.

Security properties:

- HMAC-SHA256 session signatures
- timing-safe passcode comparison
- HttpOnly cookie
- SameSite=Strict
- Secure cookies in production
- explicit logout support
- optional dedicated `WAYLUME_ADMIN_SESSION_SECRET`
- five sign-in attempts per 15-minute in-process rate-limit window

`/admin/login` provides the session-login entry point. The main advisor screens now automatically recognize the signed session instead of requiring the passcode on every page. Existing `x-admin-token` support remains only as a migration/emergency fallback.

Session-aware areas include the dashboard, inquiry pipeline, quotes, itineraries, traveler portal access, promotions, supplier resources, analytics, notifications, and admin health checks.

## Notification delivery

The notification queue remains the source of record. Phase 7 adds an actual provider adapter:

- email can be sent directly through Resend when `RESEND_API_KEY` and `WAYLUME_EMAIL_FROM` are configured
- email or SMS can use the existing generic notification webhook when configured
- direct email is preferred for email when both are configured
- delivery provider, provider message ID, failure reason, and sent state remain recorded in Convex
- if no compatible provider is configured, Waylume returns a configuration error rather than claiming delivery

## Itinerary provider safety

The itinerary draft adapter remains provider-neutral and optional. Phase 7 strengthens it by:

- accepting signed advisor sessions
- applying a 15-second provider timeout
- validating and bounding provider output
- limiting generated itineraries to 31 days
- falling back to the deterministic supplier-neutral draft builder when the provider fails
- keeping provider output unpublished until an advisor reviews and saves it

## Supplier adapter boundary

`lib/supplierAdapters.ts` defines a provider-neutral supplier search contract. No supplier is enabled by default and no unapproved Archer/Evolution/vendor API is called. Approved integrations can implement the interface later without coupling the product UI to one supplier or bypassing supplier booking rules.

## Required deployment settings

Configure these in production:

- `WAYLUME_ADMIN_TOKEN` in the web host and Convex deployment
- `WAYLUME_ADMIN_SESSION_SECRET` as a separate strong secret
- `WAYLUME_INTAKE_SECRET` in the web host and Convex deployment
- `WAYLUME_SITE_ORIGIN` once the canonical production domain is finalized

Optional provider settings:

- `RESEND_API_KEY`
- `WAYLUME_EMAIL_FROM`
- `WAYLUME_NOTIFICATION_WEBHOOK_URL`
- `WAYLUME_NOTIFICATION_WEBHOOK_SECRET`
- `WAYLUME_ITINERARY_DRAFT_WEBHOOK_URL`
- `WAYLUME_ITINERARY_DRAFT_WEBHOOK_SECRET`

## Post-merge verification

1. Deploy the updated Convex functions.
2. Set matching `WAYLUME_ADMIN_TOKEN` and `WAYLUME_INTAKE_SECRET` values in the required environments.
3. Set a distinct `WAYLUME_ADMIN_SESSION_SECRET` on the web host.
4. Sign in through `/admin/login` and navigate across advisor screens without re-entering the passcode.
5. Submit a valid public trip request and confirm it reaches Convex.
6. Confirm a direct Convex trip-request POST without the intake secret is rejected.
7. Test login rate limiting with invalid credentials in a non-production environment.
8. Queue a notification and confirm it remains queued when no provider is configured.
9. If Resend is configured, send a test email and verify the provider result is recorded.
10. Generate an itinerary draft, review it, save it as unpublished, then publish only after advisor review.
