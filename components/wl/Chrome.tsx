import Image from "next/image";
import Link from "next/link";
import { HOST_AGENCY } from "@/lib/hostAgency";
import { PHOTO_CREDITS } from "@/lib/photoCredits";

const NAV = [
  { href: "/destinations", label: "Destinations" },
  { href: "/stays", label: "Stays & Ratings" },
  { href: "/promotions", label: "Promotions" },
  { href: "/journal", label: "Travel News" },
  { href: "/know-before-you-go", label: "Know Before You Go" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="nav">
      <div className="shell nav-in">
        <Link href="/" className="brand" aria-label="Waylume Travel — home">
          <Image
            src="/waylume-travel-logo.png"
            alt="Waylume Travel — Independent Agent of Fora Travel, Inc."
            width={2153}
            height={707}
            className="logo"
            priority
          />
        </Link>
        <nav className="links" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link className="btn sm" href="/contact">Plan a trip</Link>
          <details className="mobile-nav">
            <summary aria-label="Open navigation">☰</summary>
            <nav aria-label="Mobile">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>{item.label}</Link>
              ))}
              <Link href="/how-booking-works">How booking works</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function CtaBand() {
  return (
    <section className="pad sand">
      <div className="shell" style={{ textAlign: "center" }}>
        <div className="eyebrow">Ready when you are</div>
        <h2 style={{ fontSize: "clamp(32px,4.4vw,54px)", margin: "14px 0 18px" }}>
          Let&apos;s build the trip<br />you keep talking about.
        </h2>
        <p className="lead" style={{ margin: "0 auto 28px", maxWidth: "56ch" }}>
          Complimentary planning, preferred-partner perks, and a real person on the other end of the
          phone. Tell me the idea and I&apos;ll take it from there.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn" href="/contact">Plan a trip</Link>
          <a className="btn ghost" href="mailto:advisor@waylumetravel.com">advisor@waylumetravel.com</a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="shell">
        <div className="cols">
          <div>
            <Link href="/" className="brand" aria-label="Waylume Travel — home">
              <Image
                src="/waylume-travel-logo.png"
                alt="Waylume Travel"
                width={2153}
                height={707}
                className="logo"
              />
            </Link>
            <p style={{ marginTop: 16, lineHeight: 1.7 }}>
              {HOST_AGENCY.relationship} Planning is complimentary; suppliers pay the commission.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/destinations">Destinations</Link>
            <Link href="/stays">Stays &amp; ratings</Link>
            <Link href="/promotions">Promotions</Link>
          </div>
          <div>
            <h4>Learn</h4>
            <Link href="/journal">Travel news</Link>
            <Link href="/know-before-you-go">Know before you go</Link>
            <Link href="/how-booking-works">How booking works</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="mailto:eric.tomchik@fora.travel">eric.tomchik@fora.travel</a>
            <a href="mailto:advisor@waylumetravel.com">advisor@waylumetravel.com</a>
            <Link href="/contact">Contact me</Link>
          </div>
        </div>

        <div className="credits">
          <b>Photography credits</b>
          {PHOTO_CREDITS.map((credit) => (
            <span className="c" key={credit.title}>
              “{credit.title}” by {credit.creator} —{" "}
              <a href={credit.source} target="_blank" rel="noopener noreferrer">source</a>,{" "}
              <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">{credit.license}</a>
            </span>
          ))}
        </div>

        <div className="fine">
          <span>© {new Date().getFullYear()} Waylume Travel. All rights reserved.</span>
          <span>{HOST_AGENCY.disclosure} · CST &amp; seller-of-travel disclosures on request.</span>
        </div>
      </div>
    </footer>
  );
}
