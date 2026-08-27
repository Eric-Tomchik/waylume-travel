# Waylume Travel — Phase 4

Phase 4 moves Waylume toward a lightweight operating platform for a travel advisor while keeping supplier booking and live pricing outside the custom application until approved integrations are available.

## Advisor dashboard

`/admin/overview` provides a protected operational summary with:

- total and open inquiries
- booked inquiries
- total and accepted quotes
- active promotion count
- lead pipeline status totals
- upcoming follow-up dates

## Quote workflow

Each trip request can open a quote workspace at `/admin/quotes?requestId=<id>`.

Quote records support:

- title and summary
- optional supplier name and reference
- optional monetary amount and currency
- optional expiration date
- draft, sent, accepted, expired, and declined states

Creating a quote automatically moves the associated inquiry into the `quoted` pipeline state.

Quotes are advisor records. They do not represent an independently verified live fare or booking engine result.

## Supplier resources

`/admin/suppliers` is a protected internal directory for supplier/advisor links. It stores a name, category, URL, active state, and private notes. This provides an integration boundary for Archer/Evolution supplier resources without scraping, impersonating, or bypassing vendor systems.

## Traveler workspace foundation

The Convex schema now contains a `savedTrips` model with private access-code primitives. This is intentionally only the data foundation in Phase 4. A later phase should replace temporary access-code workflows with a proper authentication provider before storing richer traveler profile data.

## Security

All dashboard, quote, supplier, lead, and promotions administration remains behind `WAYLUME_ADMIN_TOKEN` at both the Next.js server and Convex HTTP-action layers. Do not commit the real token.

## Deployment

After merge:

1. Deploy the updated Convex functions to `secret-heron-979`.
2. Confirm `CONVEX_SITE_URL` is configured on the web host.
3. Confirm the same strong `WAYLUME_ADMIN_TOKEN` is configured in the web host and Convex deployment.
4. Submit a test inquiry.
5. Verify dashboard metrics, create a draft quote, and confirm the inquiry moves to `quoted`.
6. Add only approved supplier/advisor URLs to the supplier-resource directory.
