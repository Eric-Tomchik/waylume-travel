import Link from "next/link";
import WaylumeLogo from "@/components/WaylumeLogo";
import { BOOKING_BOUNDARY, HOST_AGENCY } from "@/lib/hostAgency";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link href="/" className="site-brand footer-brand">
            <WaylumeLogo className="site-brand-mark" alt="" />
            <span><strong>WAYLUME</strong> <em>TRAVEL</em><small>{HOST_AGENCY.disclosure}</small></span>
          </Link>
          <p>Travel inspiration, AI-assisted research, and human advisor follow-through.</p>
        </div>
        <div className="footer-links">
          <strong>Explore</strong>
          <Link href="/destinations">Destinations</Link>
          <Link href="/#trip-styles">Vacation styles</Link>
          <Link href="/journal">Travel journal</Link>
          <Link href="/saved">Saved inspiration</Link>
        </div>
        <div className="footer-links">
          <strong>Plan</strong>
          <Link href="/concierge">Waylume AI</Link>
          <Link href="/how-booking-works">How booking works</Link>
          <Link href="/smart-planner">Smart planner</Link>
          <Link href="/#plan">Request advisor research</Link>
          <Link href="/portal">Traveler portal</Link>
        </div>
        <div className="footer-disclosure">
          <strong>Advisor-backed planning</strong>
          <p>{HOST_AGENCY.disclosure}. Inspiration content does not represent live availability or pricing. {BOOKING_BOUNDARY}</p>
        </div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} Waylume Travel. All rights reserved.</span><span>Travel, illuminated.</span></div>
    </footer>
  );
}
