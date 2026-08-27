# Waylume Travel — Phase 7

Phase 7 focuses on production hardening and integration boundaries.

## Public intake hardening

The trip-request API now adds:

- server-side field normalization and maximum lengths
- server-side email validation
- a hidden-field/honeypot-compatible rejection path
- request-body size limits
- optional exact-origin enforcement through `WAYLUME_SITE_ORIGIN`
- a best-effort per-IP rate limiter using Cloudflare/forwarded client IP headers when available

The in-process limiter is intentionally documented as a baseline safeguard rather than a globally distributed WAF. Cloudflare rate limiting or another shared store should be layered on for high-volume production traffic.

## Admin sessions

`/api/admin/session` exchanges the existing advisor passcode for an 8-hour signed HttpOnly cookie.

Security properties:

- HMAC-SHA256 session signatures
- timing-safe passcode comparison
- HttpOnly cookie
- SameSite=Strict
- Secure cookies in production
- explicit logout support
- optional dedicated `WAYLUME_ADMIN_SESSION_SECRET`

`/admin/login` provides the new session-login entry point. Existing `x-admin-token` authorization remains supported during migration so current advisor screens do not break.

## Supplier adapter boundary

`lib/supplierAdapters.ts` defines a provider-neutral supplier search contract. No supplier is enabled by default and no unapproved vendor API is called. Approved Archer/Evolution/vendor integrations can implement the interface later without coupling the product UI to one supplier.

## Required deployment settings

- `WAYLUME_ADMIN_TOKEN`
- `WAYLUME_ADMIN_SESSION_SECRET` (recommended and separate from the admin token)
- `WAYLUME_SITE_ORIGIN` once the canonical production domain is finalized

Existing optional notification and itinerary-provider hooks remain supported.
