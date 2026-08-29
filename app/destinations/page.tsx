import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, MapPinned, MoonStar, Sparkles } from "lucide-react";
import SaveShareActions from "@/components/SaveShareActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { destinations } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Destination Inspiration",
  description: "Explore Waylume destination guides with culture, nightlife, must-dos, stay ideas, and vacation styles before requesting current advisor-researched options.",
};

export default function DestinationsPage() {
  return (
    <main className="inspiration-site">
      <SiteHeader />
      <section className="editorial-subhero">
        <div className="shell">
          <span className="eyebrow"><Compass size={15} /> Destination inspiration</span>
          <h1>Start with a place.<br />Discover how it could feel.</h1>
          <p>Browse more than flights and hotels. Explore the culture, food, nightlife, must-dos, stay styles, and trip shapes that can make a destination right for you.</p>
          <div className="subhero-points"><span><MapPinned size={16} /> Must-dos and stay ideas</span><span><MoonStar size={16} /> Culture and nightlife</span><span><Sparkles size={16} /> AI-assisted exploration</span></div>
        </div>
      </section>

      <section className="inspire-section shell">
        <div className="destination-discovery-grid">
          {destinations.map((destination, index) => (
            <article className={`destination-discovery-card tone-${destination.color}`} key={destination.slug}>
              <div className="destination-card-top"><span>{destination.region}</span><b>{String(index + 1).padStart(2, "0")}</b></div>
              <div><h2><Link href={`/destinations/${destination.slug}`}>{destination.name}</Link></h2><strong>{destination.tagline}</strong><p>{destination.description}</p></div>
              <div className="tag-row">{destination.bestFor.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="destination-card-bottom">
                <Link href={`/destinations/${destination.slug}`}>Open destination guide <ArrowRight size={15} /></Link>
                <SaveShareActions compact id={`destination:${destination.slug}`} kind="destination" title={destination.name} description={destination.tagline} href={`/destinations/${destination.slug}`} destination={destination.name} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="destination-ai-cta">
        <div className="shell"><div><span className="eyebrow"><Sparkles size={15} /> Somewhere else in mind?</span><h2>Ask about any destination.</h2><p>Waylume AI can help you explore places not yet featured in the journal and organize the possibilities for advisor research.</p></div><Link className="button" href="/concierge">Describe my trip idea <ArrowRight size={16} /></Link></div>
      </section>
      <SiteFooter />
    </main>
  );
}
