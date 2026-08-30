import Link from "next/link";
import MarketingShell from "@/components/wl/MarketingShell";
import { NewsWire } from "@/components/wl/Live";

export const revalidate = 3600;

const DESTINATIONS = [
  { slot: "italy", tag: "Fallcation", title: "Amalfi & Puglia", copy: "September now outsells August on the coast — same light, half the crowds, better tables.", when: "Sep–Oct" },
  { slot: "japan", tag: "Trending", title: "Japan, beyond Tokyo", copy: "Kyoto in maple season, plus the Setouchi islands and Kyushu ryokans most travelers miss.", when: "Nov · Apr" },
  { slot: "safari", tag: "Bucket list", title: "Tanzania & Kenya", copy: "Green-season camps at a third of migration pricing, with the same guides.", when: "Jan–Mar" },
  { slot: "maldives", tag: "Honeymoon", title: "Maldives", copy: "Bulgari's first island resort lands in Raa Atoll in 2027. Waitlists open now.", when: "Year-round" },
];

const PROMOS = [
  { slot: "cruise", pill: "Cruise · Book by Oct 31", title: "Fjords & Northern Lights", copy: "Small-ship Norway sailings with veranda upgrade and onboard credit when I book it." },
  { slot: "suite", pill: "Hotel perks · Always on", title: "Fora Preferred Partner rates", copy: "Daily breakfast for two, property credit, upgrade at check-in, late checkout." },
  { slot: "greece", pill: "Villas · Summer 2027", title: "Greek isles, early-bird", copy: "Lock pricing early — Greek island rates have been climbing hard for two seasons." },
];

const STAYS = [
  { slot: "maldives", tag: "Maldives", title: "Overwater, done right", stars: "★★★★★", score: "9.4 · Romance", copy: "Raa & Baa Atoll picks where the house reef actually delivers." },
  { slot: "suite", tag: "Dubai", title: "Six Senses The Palm", stars: "★★★★★", score: "9.2 · Wellness", copy: "All-suite beachfront debut, 60,000 sq ft wellness club, from $1,500/night." },
  { slot: "safari", tag: "Tanzania", title: "Tented camps, Serengeti", stars: "★★★★☆", score: "9.0 · Adventure", copy: "Mobile camps that follow the herds instead of watching them leave." },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="hero">
        <div className="bg" style={{ backgroundImage: "url('/photos/hero.webp')" }} />
        <div className="hero-in">
          <div className="eyebrow" style={{ color: "var(--brass-lt)" }}>Waylume Travel · Independent advisor</div>
          <h1>The trip you keep <em>almost</em> booking.</h1>
          <p>
            I&apos;m Eric Tomchik — a travel advisor with Fora Travel. I turn the idea you&apos;ve been
            circling for two years into a booked, well-priced, properly-planned journey, with perks you
            can&apos;t get on a booking site.
          </p>
          <div className="hero-cta">
            <Link className="btn light" href="/plan">Start with a conversation</Link>
            <Link className="play" href="/destinations"><i>▶</i> See where I&apos;m sending people</Link>
          </div>
        </div>
      </section>

      <div className="hero-strip">
        <div className="shell">
          <div><b>Free</b><span>My planning costs you nothing</span></div>
          <div><b>$1,653</b><span>avg. luxury hotel night in 2026 — spend it well</span></div>
          <div><b>+21%</b><span>luxury travel growth this year</span></div>
          <div><b>24/7</b><span>a real person while you&apos;re away</span></div>
        </div>
      </div>

      <section className="pad">
        <div className="shell">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Where to go now</div>
              <h2>Destinations worth<br />the flight in 2026–27</h2>
            </div>
            <p className="lead">
              Fall has become the headline season — autumn bookings are up 59% year over year. These are
              the places I&apos;m sending clients right now, and why the timing matters.
            </p>
          </div>
          <div className="grid g4">
            {DESTINATIONS.map((item) => (
              <Link className="card" href="/destinations" key={item.title}>
                <div className="ph" style={{ backgroundImage: `url('/photos/${item.slot}.webp')` }}>
                  <span className="tag">{item.tag}</span>
                </div>
                <div className="bd">
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <div className="meta"><span>{item.when}</span><b>View guide →</b></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pad sand">
        <div className="shell">
          <div className="sec-head">
            <div>
              <div className="eyebrow">This month&apos;s promotions</div>
              <h2>Live offers I can book for you</h2>
            </div>
            <Link className="btn ghost" href="/promotions">See all promotions</Link>
          </div>
          <div className="grid g3">
            {PROMOS.map((promo) => (
              <Link className="promo" href="/promotions" key={promo.title}>
                <div className="ph" style={{ backgroundImage: `url('/photos/${promo.slot}.webp')` }} />
                <div className="bd">
                  <span className="pill">{promo.pill}</span>
                  <h3>{promo.title}</h3>
                  <p>{promo.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pad">
        <div className="shell split">
          <div className="ph" style={{ backgroundImage: "url('/photos/advisor.webp')" }} />
          <div>
            <div className="eyebrow">Why work with an advisor</div>
            <h2 style={{ fontSize: "clamp(30px,3.6vw,46px)", margin: "14px 0 20px" }}>
              An algorithm can<br />show you a room.<br />It can&apos;t call the GM.
            </h2>
            <p className="lead">
              Booking sites sell inventory. I sell judgment — which of the four “ocean view” categories
              actually sees the ocean, which resort is mid-renovation, which suite is worth the upgrade
              and which isn&apos;t.
            </p>
            <div className="acc" style={{ marginTop: 28 }}>
              <details open>
                <summary>It costs you nothing</summary>
                <p>Hotels and cruise lines pay commission whether you book direct or through me. Same rate, more included. My time is free to you.</p>
              </details>
              <details>
                <summary>Perks you can&apos;t book yourself</summary>
                <p>Through Fora&apos;s preferred partner programs: daily breakfast for two, property credits, room upgrades at check-in, late checkout, and VIP notes on your reservation.</p>
              </details>
              <details>
                <summary>Someone to call when it goes wrong</summary>
                <p>Cancelled flight, closed pool, a room that isn&apos;t what was promised — you text me instead of waiting in a call queue.</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section className="pad dark">
        <div className="shell">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Signature stays</div>
              <h2 style={{ color: "#fff" }}>Properties I know<br />well enough to rate</h2>
            </div>
            <Link className="btn light" href="/stays">Browse all stays</Link>
          </div>
          <div className="grid g3">
            {STAYS.map((stay) => (
              <Link className="card tall" href="/stays" key={stay.title}>
                <div className="ph" style={{ backgroundImage: `url('/photos/${stay.slot}.webp')` }}>
                  <span className="tag">{stay.tag}</span>
                </div>
                <div className="bd">
                  <h3>{stay.title}</h3>
                  <div className="stars">
                    {stay.stars}{" "}
                    <span style={{ color: "var(--muted)", letterSpacing: 0, fontSize: 12 }}>{stay.score}</span>
                  </div>
                  <p>{stay.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pad">
        <div className="shell">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Live from the travel wire</div>
              <h2>Today&apos;s travel news,<br />updated automatically</h2>
            </div>
            <p className="lead">
              Headlines pulled live from Condé Nast Traveler, The New York Times, Skift and more —
              refreshed every hour, so there&apos;s always a reason to come back. I add the advisor&apos;s
              read on the stories that change your plans.
            </p>
          </div>
          <NewsWire limit={6} />
          <div style={{ textAlign: "center", marginTop: 34 }}>
            <Link className="btn ghost" href="/journal">Open the full news wire</Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
