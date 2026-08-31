import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell, { PageHead } from "@/components/wl/MarketingShell";
import { NewsWire } from "@/components/wl/Live";
import { Reveal } from "@/components/wl/Interactive";
import { canonicalMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  ...canonicalMetadata("/journal"),
  title: "Travel News",
  description:
    "Travel industry news, entry-requirement changes and destination reporting — filtered down to what actually changes your plans, plus a live wire from the travel press.",
};

const STORIES = [
  { kind: "Entry rules", href: "/know-before-you-go", title: "ETIAS launches Q4 2026 — €20, six-month grace period", copy: "Europe's Entry/Exit System went fully live in April 2026; ETIAS follows this quarter for 30 countries." },
  { kind: "Entry rules", href: "/know-before-you-go", title: "UK ETA now strictly enforced — and it went to £20", copy: "Since 25 February 2026 carriers are fined for boarding travellers without one. Dual UK nationals must use a British passport." },
  { kind: "Entry rules", href: "/know-before-you-go", title: "Brazil e-visa: $80.90, apply two weeks out", copy: "Required for US passports since April 2025; the e-visa platform went fully electronic in February 2026." },
  { kind: "Openings", href: "/stays", title: "Bulgari's first island resort slips to 2027", copy: "54 villas in Raa Atoll, Niko Romito dining, and a villa on its own islet. Waitlists are open." },
  { kind: "Trends", href: "/destinations", title: "“City-maxxing”: one trip, three cities, usually two countries", copy: "France–Italy is the most-booked pairing. How to structure a multi-city trip without living on trains." },
  { kind: "2027", href: "/contact", title: "The eclipse, the World Cup and the Expo", copy: "2 August 2027 totality over Luxor; Rugby World Cup Australia; Expo Belgrade. Book Egypt now, not next spring." },
];

export default function JournalPage() {
  return (
    <MarketingShell>
      <PageHead
        eyebrow="Travel news"
        title={<>Travel news you can<br />actually act on.</>}
        lead="Industry news, entry-requirement changes and destination reporting — filtered down to what changes your plans."
      />

      <section className="pad" style={{ paddingTop: 30 }}>
        <div className="shell">
          <Link className="card wide" href="/destinations" style={{ marginBottom: 34 }}>
            <div className="ph" style={{ backgroundImage: "url('/photos/hero.webp')" }}>
              <span className="tag">Featured · 2026</span>
            </div>
            <div className="bd" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 32 }}>Fall is the new summer</h3>
              <p style={{ fontSize: 15 }}>
                Virtuoso&apos;s 2026 network data: autumn bookings up 59%, sales up 69%, September sales up
                77%. Europe leads the shift — bookings up 49% even as rates rose 7%. What it means:
                shoulder season is no longer the discount season, and the booking window has moved three to
                four months earlier.
              </p>
              <div className="meta"><span>6 min read · Industry data</span><b>Where to go →</b></div>
            </div>
          </Link>

          <div className="rows">
            {STORIES.map((story) => (
              <Link className="row" key={story.title} href={story.href}>
                <span className="dt">{story.kind}</span>
                <div>
                  <h3>{story.title}</h3>
                  <p>{story.copy}</p>
                </div>
                <span className="go">Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pad sand">
        <div className="shell">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Live feed</div>
              <h2>The wire</h2>
            </div>
            <p className="lead">
              Automatically aggregated from the travel press and updated hourly — headlines link to the
              original publisher. If a story matters for a trip you&apos;re planning, ask me and I&apos;ll
              tell you what it actually means.
            </p>
          </div>
          <NewsWire limit={18} filters />
        </div>
      </section>
    </MarketingShell>
  );
}
