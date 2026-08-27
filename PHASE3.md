# Phase 3

Phase 3 adds a lightweight CRM and content-management layer to Waylume Travel.

## Added

- Dynamic promotions loaded from Convex with public fallback content
- Protected advisor promotions manager at `/admin/promotions`
- Advisor notes and follow-up dates on trip inquiries
- Individual destination detail routes under `/destinations/[slug]`
- Smart Planner preference-matching flow at `/smart-planner`
- Public promotion and protected admin API proxies

## Deployment

After merge, deploy the updated Convex functions to `secret-heron-979`. Keep `WAYLUME_ADMIN_TOKEN` configured with the same strong value in both the web host and Convex environments.

The Smart Planner is intentionally preference matching, not live pricing or autonomous travel advice. Final supplier availability, terms, and pricing remain subject to advisor and supplier confirmation.
