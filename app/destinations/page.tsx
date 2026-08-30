import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell, { PageHead } from "@/components/wl/MarketingShell";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Destination guides written from a booking perspective: when to go, what a good week costs, and where to stay at three price points.",
};

const GUIDES = [
  { slot: "italy", tag: "Europe", title: "Italy: Amalfi to Puglia", copy: "Two coasts, one drive. Sep–Oct light, lemon groves, and masserie that still have space.", meta: "7–12 nights · from $6,400 pp" },
  { slot: "greece", tag: "Europe", title: "Greek Islands by sea", copy: "Skip the ferry scrum: a small yacht, five islands, and beaches you reach at dawn.", meta: "8 nights · from $9,200 pp" },
  { slot: "japan", tag: "Asia", title: "Japan in autumn", copy: "Tokyo, Kyoto, and the Seto Inland Sea — booked nine months out for the ryokans worth it.", meta: "10–14 nights · from $8,800 pp" },
  { slot: "safari", tag: "Africa", title: "Tanzania safari", copy: "Migration timing, green-season value, and how to combine with Zanzibar without a wasted day.", meta: "9 nights · from $11,500 pp" },
  { slot: "maldives", tag: "Indian Ocean", title: "Maldives & honeymoons", copy: "Atoll by atoll: seaplane vs speedboat, house reefs, and adults-only islands.", meta: "7 nights · from $7,900 pp" },
  { slot: "cruise", tag: "At sea", title: "Norway & the fjords", copy: "Small-ship sailings, aurora season, and which cabin grades are actually worth the jump.", meta: "10 nights · from $6,100 pp" },
];

export default function DestinationsPage() {
  return (
    <MarketingShell>
      <PageHead
        eyebrow="Destinations"
        title={<>Places, and the right<br />month to see them.</>}
        lead="Every guide is written from a booking perspective: when to go, what a good week costs, where to stay at three price points, and what I'd add that most itineraries miss."
      />
      <section className="pad" style={{ paddingTop: 30 }}>
        <div className="shell grid g3">
          {GUIDES.map((guide) => (
            <Link
              className="card"
              key={guide.title}
              href={`/plan?destination=${encodeURIComponent(guide.title)}`}
            >
              <div className="ph" style={{ backgroundImage: `url('/photos/${guide.slot}.webp')` }}>
                <span className="tag">{guide.tag}</span>
              </div>
              <div className="bd">
                <h3>{guide.title}</h3>
                <p>{guide.copy}</p>
                <div className="meta"><span>{guide.meta}</span><b>Ask about this →</b></div>
              </div>
            </Link>
          ))}
        </div>
        <div className="shell">
          <p className="lead" style={{ marginTop: 26, fontSize: 13.5 }}>
            Prices are indicative planning ranges for two travelers, land only, based on what similar trips
            have cost recently. They move with season and availability — ask me for a live quote.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
