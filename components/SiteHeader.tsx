import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import WaylumeLogo from "@/components/WaylumeLogo";
import SavedIdeasLink from "@/components/SavedIdeasLink";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/#trip-styles", label: "Trip styles" },
  { href: "/journal", label: "Journal" },
  { href: "/deals", label: "Promotions" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-nav shell">
        <Link href="/" className="site-brand" aria-label="Waylume Travel home">
          <WaylumeLogo className="site-brand-mark" alt="" />
          <span><strong>WAYLUME</strong> <em>TRAVEL</em><small>Independent Agent of Fora Travel, Inc.</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
        <div className="nav-actions">
          <SavedIdeasLink />
          <Link className="button small" href="/concierge"><Sparkles size={15} /> Ask Waylume AI</Link>
          <details className="mobile-menu">
            <summary aria-label="Open navigation"><Menu size={21} /></summary>
            <nav aria-label="Mobile navigation">
              {links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
              <Link href="/saved">Saved inspiration</Link>
              <Link href="/concierge">Ask Waylume AI</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
