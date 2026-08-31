import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell, { PageHead } from "@/components/wl/MarketingShell";
import { Reveal } from "@/components/wl/Interactive";

export const metadata: Metadata = {
  title: "Promotions",
  description:
    "Current supplier promotions and preferred-partner perks bookable through Waylume Travel — cruise credits, hotel amenities, villa early-bird pricing.",
};

const OFFERS = [
  {
    slot: "cruise",
    pill: "Book by Oct 31, 2026",
    title: "Norway small-ship sailings",
    copy: "A veranda upgrade, onboard credit and prepaid gratuities on select 2027 departures. Aurora season sells out first.",
  },
  {
    slot: "suite",
    pill: "Always on · Fora Preferred",
    title: "Preferred-partner hotel perks",
    copy: "Daily breakfast for two, a property credit, an upgrade subject to availability and late checkout — at thousands of hotels, at the same rate you'd pay direct.",
  },
  {
    slot: "greece",
    pill: "Villas · Summer 2027",
    title: "Greek isles early-bird",
    copy: "Villa inventory for next summer opens now and the best houses go first. Book early, decide the details later.",
  },
  {
    slot: "maldives",
    pill: "Honeymoon",
    title: "Stay 4 / pay 3 + transfers",
    copy: "Select Maldives resorts through 2027, plus honeymoon amenities when I book it as your advisor.",
  },
];

type PublishedDeal = {
  id: string;
  title: string;
  summary: string;
  supplier: string;
  location?: string;
  imageUrl?: string;
  bookBy?: string;
  exclusiveToFora: boolean;
};

/** Advisor-approved Fora deals. Only what Eric publishes in /admin/fora-deals appears here. */
async function getPublishedDeals(): Promise<PublishedDeal[]> {
  const siteUrl = process.env.CONVEX_SITE_URL;
  if (!siteUrl) return [];
  try {
    const response = await fetch(`${siteUrl}/fora-deals?limit=24`, { next: { revalidate: 300 } });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.deals) ? data.deals : [];
  } catch {
    return [];
  }
}

export default async function PromotionsPage() {
  const deals = await getPublishedDeals();

  return (
    <MarketingShell>
      <PageHead
        eyebrow="Promotions"
        title={<>What&apos;s on offer<br />right now.</>}
        lead="Supplier promotions move weekly. These are the ones worth acting on — message me and I'll confirm current availability, exact terms and hold space the same day."
      />
      <section className="pad" style={{ paddingTop: 30 }}>
        <div className="shell grid g2">
          {OFFERS.map((offer, index) => (
            <Reveal key={offer.title} delay={index * 80}>
            <Link
              className="promo"
              href={`/contact?destination=${encodeURIComponent(offer.title)}`}
              style={{ minHeight: 400, height: "100%" }}
            >
              <div className="ph" style={{ backgroundImage: `url('/photos/${offer.slot}.webp')` }} />
              <div className="bd">
                <span className="pill">{offer.pill}</span>
                <h3>{offer.title}</h3>
                <p>{offer.copy}</p>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>
      {Boolean(deals.length) && (
        <section className="pad" style={{ paddingTop: 0 }}>
          <div className="shell">
            <h2>Live supplier offers</h2>
            <p className="lead" style={{ fontSize: 14 }}>
              Current partner promotions I can book for you. Terms and availability are confirmed in writing
              before you pay anything.
            </p>
          </div>
          <div className="shell grid g2">
            {deals.map((deal, index) => (
              <Reveal key={deal.id} delay={index * 60}>
                <Link
                  className="promo"
                  href={`/contact?destination=${encodeURIComponent(deal.supplier)}`}
                  style={{ minHeight: 400, height: "100%" }}
                >
                  <div className="ph" style={deal.imageUrl ? { backgroundImage: `url('${deal.imageUrl}')` } : undefined} />
                  <div className="bd">
                    <span className="pill">
                      {deal.bookBy ? `Book by ${deal.bookBy}` : "Current offer"}
                      {deal.exclusiveToFora ? " · Fora exclusive" : ""}
                    </span>
                    <h3>{deal.title}</h3>
                    <p>{deal.summary}</p>
                    <p style={{ fontSize: 12.5, opacity: 0.75 }}>
                      {deal.supplier}{deal.location ? ` · ${deal.location}` : ""}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
      <section className="pad" style={{ paddingTop: 0 }}>
        <div className="shell">
          <p className="lead" style={{ marginTop: 26, fontSize: 13.5 }}>
            Promotions are supplier offers subject to availability, blackout dates and change without
            notice. I don&apos;t publish prices — I quote them live through Fora&apos;s booking platform
            for your dates, and confirm the exact terms in writing before you pay anything.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
