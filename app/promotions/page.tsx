import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell, { PageHead } from "@/components/wl/MarketingShell";

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
    copy: "Veranda upgrade, onboard credit and prepaid gratuities on select 2027 departures. Aurora season sells out first.",
  },
  {
    slot: "suite",
    pill: "Always on · Fora Preferred",
    title: "Preferred-partner hotel perks",
    copy: "Daily breakfast for two, a property credit, upgrade subject to availability and late checkout — at thousands of hotels, at the same rate you'd pay direct.",
  },
  {
    slot: "greece",
    pill: "Villas · Summer 2027",
    title: "Greek isles early-bird",
    copy: "Villa inventory for next summer opens now and prices climb as it thins. Book early, hold the rate, decide details later.",
  },
  {
    slot: "maldives",
    pill: "Honeymoon",
    title: "Stay 4 / pay 3 + transfers",
    copy: "Select Maldives resorts through 2027, plus honeymoon amenities when I book it as your advisor.",
  },
];

export default function PromotionsPage() {
  return (
    <MarketingShell>
      <PageHead
        eyebrow="Promotions"
        title={<>What&apos;s on offer<br />right now.</>}
        lead="Supplier promotions move weekly. These are the ones worth acting on — message me and I'll confirm current availability, exact terms and hold space the same day."
      />
      <section className="pad" style={{ paddingTop: 30 }}>
        <div className="shell grid g2">
          {OFFERS.map((offer) => (
            <Link
              className="promo"
              key={offer.title}
              href={`/plan?destination=${encodeURIComponent(offer.title)}`}
              style={{ minHeight: 400 }}
            >
              <div className="ph" style={{ backgroundImage: `url('/photos/${offer.slot}.webp')` }} />
              <div className="bd">
                <span className="pill">{offer.pill}</span>
                <h3>{offer.title}</h3>
                <p>{offer.copy}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="shell">
          <p className="lead" style={{ marginTop: 26, fontSize: 13.5 }}>
            Promotions are supplier offers subject to availability, blackout dates and change without
            notice. Nothing here is a quote — I&apos;ll confirm the exact terms in writing before you pay
            anything.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
