import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell, { PageHead } from "@/components/wl/MarketingShell";

export const metadata: Metadata = {
  title: "Stays & Ratings",
  description:
    "Hotel and resort ratings from an independent advisor — the room you'll actually get, the service floor on a bad day, the food, and whether the price makes sense.",
};

const STAYS = [
  { place: "Maldives", title: "Raa Atoll overwater villas", copy: "Seaplane 45 minutes from Malé. Best house reef in the atoll; Bulgari's island arrives 2027.", stars: "★★★★★", score: "9.4 · from $1,900/nt" },
  { place: "Dubai", title: "Six Senses The Palm", copy: "Opened 1 September 2026. 61 all-suite beachfront keys, 60,000 sq ft wellness club, longevity clinic.", stars: "★★★★★", score: "9.2 · from $1,500/nt" },
  { place: "Turks & Caicos", title: "Andaz Turks & Caicos", copy: "Grace Bay debut 1 June 2027, 59 rooms plus 73 residences. Reservations already open.", stars: "★★★★☆", score: "8.9 · from $1,297/nt" },
  { place: "Saudi Red Sea", title: "Six Senses AMAALA", copy: "Opened July 2026 between desert cliffs and a mangrove lagoon. 100 suites and villas.", stars: "★★★★☆", score: "8.8 · on request" },
  { place: "Italy", title: "Amalfi Coast classics", copy: "Positano vs Ravello vs Praiano — which one suits your walking legs and your dinner plans.", stars: "★★★★★", score: "9.1 · from $1,150/nt" },
];

export default function StaysPage() {
  return (
    <MarketingShell>
      <PageHead
        eyebrow="Stays & ratings"
        title={<>Hotels, rated by<br />someone accountable.</>}
        lead="My ratings weigh four things: the room you'll actually get, the service floor on a bad day, the food, and whether the price makes sense against its neighbours. Every property below is bookable with Fora preferred-partner perks."
      />
      <section className="pad" style={{ paddingTop: 30 }}>
        <div className="shell">
          <div className="rows">
            {STAYS.map((stay) => (
              <Link
                className="row"
                key={stay.title}
                href={`/plan?destination=${encodeURIComponent(stay.title)}`}
                style={{ gridTemplateColumns: "140px 1fr 210px" }}
              >
                <span className="dt">{stay.place}</span>
                <div>
                  <h3>{stay.title}</h3>
                  <p>{stay.copy}</p>
                </div>
                <span className="go">
                  <span className="stars">{stay.stars}</span>
                  <br />
                  {stay.score}
                </span>
              </Link>
            ))}
          </div>
          <p className="lead" style={{ marginTop: 26, fontSize: 13.5 }}>
            Ratings are my own editorial assessment, informed by supplier relationships and client
            feedback. Rates are indicative and change constantly — ask me for a live quote.
          </p>
        </div>
      </section>

      <section className="pad sand">
        <div className="shell split">
          <div className="ph" style={{ backgroundImage: "url('/photos/suite.webp')" }} />
          <div>
            <div className="eyebrow">What preferred-partner booking gets you</div>
            <h2 style={{ fontSize: "clamp(28px,3.4vw,42px)", margin: "14px 0 20px" }}>
              Same rate.<br />More in the room.
            </h2>
            <p className="lead">
              Booking through Fora&apos;s preferred programs costs you nothing extra and typically adds
              daily breakfast for two, a property credit, an upgrade at check-in when inventory allows,
              late checkout, and a VIP note on the reservation so the front desk knows who you are.
            </p>
            <div style={{ marginTop: 26 }}>
              <Link className="btn" href="/plan">Ask about a specific hotel</Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
