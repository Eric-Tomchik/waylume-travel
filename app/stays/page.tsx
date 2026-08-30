import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell, { PageHead } from "@/components/wl/MarketingShell";
import { HeartButton, Lightbox, Reveal } from "@/components/wl/Interactive";

export const metadata: Metadata = {
  title: "Stays & Ratings",
  description:
    "Hotel and resort ratings from an independent advisor — the room you'll actually get, the service floor on a bad day, the food, and whether it earns its reputation.",
};

const STAYS = [
  { slot: "maldives", place: "Maldives", title: "Raa Atoll overwater villas", copy: "Seaplane 45 minutes from Malé. The best house reef in the atoll; Bulgari's island resort arrives in 2027.", stars: "★★★★★", score: "9.4", tag: "Romance" },
  { slot: "dubai", place: "Dubai", title: "Six Senses The Palm", copy: "Opened September 2026. Sixty-one all-suite beachfront keys, a 60,000 sq ft wellness club and a longevity clinic.", stars: "★★★★★", score: "9.2", tag: "Wellness" },
  { slot: "thailand", place: "Turks & Caicos", title: "Andaz Turks & Caicos", copy: "Grace Bay debut in June 2027, 59 rooms plus 73 residences. Reservations are already open.", stars: "★★★★☆", score: "8.9", tag: "Family" },
  { slot: "morocco", place: "Saudi Red Sea", title: "Six Senses AMAALA", copy: "Opened July 2026 between desert cliffs and a mangrove lagoon. One hundred suites and villas.", stars: "★★★★☆", score: "8.8", tag: "Design" },
  { slot: "italy", place: "Italy", title: "Amalfi Coast classics", copy: "Positano versus Ravello versus Praiano — which one suits your walking legs and your dinner plans.", stars: "★★★★★", score: "9.1", tag: "Icon" },
  { slot: "safari", place: "Tanzania", title: "Mobile tented camps", copy: "Camps that move with the herds, with guides who have worked the same valleys for twenty years.", stars: "★★★★☆", score: "9.0", tag: "Adventure" },
];

export default function StaysPage() {
  return (
    <MarketingShell>
      <PageHead
        eyebrow="Stays & ratings"
        title={<>Hotels, rated by<br />someone accountable.</>}
        lead="My ratings weigh four things: the room you'll actually get, the service floor on a bad day, the food, and whether the place earns its reputation. Click any photo to see it full screen; heart the ones you want me to price."
      />

      <section className="pad" style={{ paddingTop: 24 }}>
        <div className="shell grid g3">
          {STAYS.map((stay, index) => (
            <Reveal key={stay.title} delay={index * 70}>
              <div className="card" style={{ height: "100%" }}>
                <HeartButton name={stay.title} />
                <Lightbox src={`/photos/${stay.slot}.webp`} caption={`${stay.title} — ${stay.place}`}>
                  <div className="ph" style={{ backgroundImage: `url('/photos/${stay.slot}.webp')` }}>
                    <span className="tag">{stay.place}</span>
                  </div>
                </Lightbox>
                <div className="bd">
                  <h3>{stay.title}</h3>
                  <div className="stars">
                    {stay.stars}{" "}
                    <span style={{ color: "var(--muted)", letterSpacing: 0, fontSize: 12 }}>
                      {stay.score} · {stay.tag}
                    </span>
                  </div>
                  <p>{stay.copy}</p>
                  <div className="meta">
                    <span>Preferred-partner perks</span>
                    <Link href={`/contact?destination=${encodeURIComponent(stay.title)}`}><b>Ask me to price it →</b></Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="shell">
          <p className="lead" style={{ marginTop: 30, fontSize: 13.5 }}>
            Ratings are my own editorial assessment, informed by supplier relationships and client
            feedback. I don&apos;t publish rates — availability and pricing move constantly, so I quote
            them live through Fora&apos;s booking platform once I know your dates. Photography on this
            page is illustrative of the destination rather than of the specific property.
          </p>
        </div>
      </section>

      <section className="pad sand">
        <div className="shell split">
          <Reveal>
            <div className="ph" style={{ backgroundImage: "url('/photos/suite.webp')" }} />
          </Reveal>
          <Reveal delay={90}>
            <div>
              <div className="eyebrow">What preferred-partner booking gets you</div>
              <h2 style={{ fontSize: "clamp(28px,3.4vw,42px)", margin: "14px 0 20px" }}>
                Same rate.<br /><span className="grad">More in the room.</span>
              </h2>
              <p className="lead">
                Booking through Fora&apos;s preferred programs costs you nothing extra and typically adds
                daily breakfast for two, a property credit, an upgrade at check-in when inventory allows,
                late checkout, and a VIP note on the reservation so the front desk knows who you are.
              </p>
              <div style={{ marginTop: 26 }}>
                <Link className="btn" href="/contact">Ask about a specific hotel</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}
