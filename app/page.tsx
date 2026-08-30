import Link from "next/link";
import MarketingShell from "@/components/wl/MarketingShell";
import { NewsWire } from "@/components/wl/Live";
import { Counter, HeartButton, ParallaxBackdrop, Reveal } from "@/components/wl/Interactive";
import DestinationFinder from "@/components/wl/DestinationFinder";

export const revalidate = 3600;

const PROMOS = [
  { slot: "cruise", pill: "Cruise · Book by Oct 31", title: "Fjords & Northern Lights", copy: "Small-ship Norway sailings with a veranda upgrade and onboard credit when I book it." },
  { slot: "suite", pill: "Hotel perks · Always on", title: "Fora Preferred Partner rates", copy: "Daily breakfast for two, a property credit, upgrade at check-in, late checkout." },
  { slot: "greece", pill: "Villas · Summer 2027", title: "Greek isles, early-bird", copy: "Lock the good villas before next summer's inventory thins out." },
];

const STAYS = [
  { slot: "maldives", tag: "Maldives", title: "Overwater, done right", stars: "★★★★★", score: "9.4 · Romance", copy: "Raa & Baa Atoll picks where the house reef actually delivers." },
  { slot: "suite", tag: "Dubai", title: "Six Senses The Palm", stars: "★★★★★", score: "9.2 · Wellness", copy: "All-suite beachfront debut with a 60,000 sq ft wellness club." },
  { slot: "safari", tag: "Tanzania", title: "Tented camps, Serengeti", stars: "★★★★☆", score: "9.0 · Adventure", copy: "Mobile camps that follow the herds instead of watching them leave." },
];

function Waves() {
  return (
    <div className="waves" aria-hidden>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path
          fill="#030E18"
          d="M0,48 C120,80 240,80 360,58 C480,36 600,-8 720,10 C840,28 960,80 1080,80 C1200,80 1320,44 1440,28 L1440,90 L0,90 Z
             M1440,48 C1560,80 1680,80 1800,58 C1920,36 2040,-8 2160,10 C2280,28 2400,80 2520,80 C2640,80 2760,44 2880,28 L2880,90 L1440,90 Z"
        />
      </svg>
    </div>
  );
}

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="hero">
        <ParallaxBackdrop image="/photos/hero.webp" />
        <div className="hero-in">
          <div className="eyebrow">Waylume Travel · Independent advisor</div>
          <h1>The trip you keep <em>almost</em> booking.</h1>
          <p>
            I&apos;m Eric Tomchik — a travel advisor with Fora Travel. I turn the idea you&apos;ve been
            circling for two years into a booked, well-planned journey, with perks you can&apos;t get on a
            booking site.
          </p>
          <div className="hero-cta">
            <Link className="btn" href="/plan">Start with a conversation</Link>
            <Link className="play" href="#finder"><i>▾</i> Find where to go</Link>
          </div>
        </div>
        <Waves />
      </section>

      <div className="hero-strip">
        <div className="shell">
          <div><b>Free</b><span>My planning costs you nothing</span></div>
          <div><b><Counter to={59} prefix="+" suffix="%" /></b><span>autumn bookings vs. last year</span></div>
          <div><b><Counter to={21} prefix="+" suffix="%" /></b><span>luxury travel growth this year</span></div>
          <div><b>24/7</b><span>a real person while you&apos;re away</span></div>
        </div>
      </div>

      <section className="pad" id="finder">
        <div className="shell">
          <Reveal>
            <div className="sec-head">
              <div>
                <div className="eyebrow">Where to go now</div>
                <h2>Tell me when you&apos;re free.<br /><span className="grad">I&apos;ll tell you where to go.</span></h2>
              </div>
              <p className="lead">
                Pick a season, a mood and a corner of the world — the list rewrites itself. Heart the ones
                you like and send them straight to me; the coloured bars show the months I&apos;d actually
                send you.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}><DestinationFinder /></Reveal>
        </div>
      </section>

      <section className="pad sand">
        <div className="shell">
          <Reveal>
            <div className="sec-head">
              <div>
                <div className="eyebrow">This month&apos;s promotions</div>
                <h2>Live offers I can book for you</h2>
              </div>
              <Link className="btn ghost" href="/promotions">See all promotions</Link>
            </div>
          </Reveal>
          <div className="grid g3">
            {PROMOS.map((promo, index) => (
              <Reveal key={promo.title} delay={index * 90}>
                <Link className="promo" href="/promotions" style={{ height: "100%" }}>
                  <div className="ph" style={{ backgroundImage: `url('/photos/${promo.slot}.webp')` }} />
                  <div className="bd">
                    <span className="pill">{promo.pill}</span>
                    <h3>{promo.title}</h3>
                    <p>{promo.copy}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pad">
        <div className="shell split">
          <Reveal>
            <div className="ph" style={{ backgroundImage: "url('/photos/advisor.webp')" }} />
          </Reveal>
          <Reveal delay={100}>
            <div>
              <div className="eyebrow">Why work with an advisor</div>
              <h2 style={{ fontSize: "clamp(30px,3.6vw,46px)", margin: "14px 0 20px" }}>
                An algorithm can<br />show you a room.<br /><span className="grad">It can&apos;t call the GM.</span>
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
          </Reveal>
        </div>
      </section>

      <section className="pad dark">
        <div className="shell">
          <Reveal>
            <div className="sec-head">
              <div>
                <div className="eyebrow">Signature stays</div>
                <h2>Properties I know<br />well enough to rate</h2>
              </div>
              <Link className="btn ghost" href="/stays">Browse all stays</Link>
            </div>
          </Reveal>
          <div className="grid g3">
            {STAYS.map((stay, index) => (
              <Reveal key={stay.title} delay={index * 90}>
                <div className="card tall" style={{ height: "100%" }}>
                  <HeartButton name={stay.title} />
                  <Link href="/stays" style={{ display: "contents" }}>
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
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pad">
        <div className="shell">
          <Reveal>
            <div className="sec-head">
              <div>
                <div className="eyebrow">Live from the travel wire</div>
                <h2>Today&apos;s travel news,<br />updated automatically</h2>
              </div>
              <p className="lead">
                Headlines pulled live from Condé Nast Traveler, The New York Times, Skift and more —
                refreshed every hour. I add the advisor&apos;s read on the stories that change your plans.
              </p>
            </div>
          </Reveal>
          <NewsWire limit={6} />
          <div style={{ textAlign: "center", marginTop: 34 }}>
            <Link className="btn ghost" href="/journal">Open the full news wire</Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
