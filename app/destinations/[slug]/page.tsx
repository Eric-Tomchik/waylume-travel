import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Compass, ExternalLink, MapPinned, MoonStar, Music2, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import SaveShareActions from "@/components/SaveShareActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { destinations, getDestination } from "@/lib/destinations";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return { title: "Destination not found" };
  return {
    title: `${destination.name} Travel Inspiration`,
    description: `Explore ${destination.name}: culture, nightlife, must-dos, places to stay, and vacation ideas with Waylume Travel.`,
    openGraph: { title: `${destination.name} travel inspiration | Waylume Travel`, description: destination.tagline, type: "article" },
  };
}

export default async function DestinationDetail({ params }: Props) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  return (
    <main className="inspiration-site">
      <SiteHeader />
      <section className={`destination-hero tone-${destination.color}`}>
        <div className="shell">
          <Link className="crumb" href="/destinations">Destinations</Link><span className="crumb-separator">/</span><span>{destination.name}</span>
          <div className="destination-hero-grid">
            <div><span className="eyebrow"><Compass size={15} /> {destination.region}</span><h1>{destination.name}</h1><p>{destination.tagline}</p><div className="tag-row">{destination.bestFor.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            <aside><small>The Waylume take</small><p>{destination.atmosphere}</p><SaveShareActions id={`destination:${destination.slug}`} kind="destination" title={destination.name} description={destination.tagline} href={`/destinations/${destination.slug}`} destination={destination.name} /></aside>
          </div>
        </div>
      </section>

      <section className="inspire-section shell destination-story">
        <div className="destination-main-copy">
          <span className="eyebrow"><MapPinned size={15} /> Must do + see</span>
          <h2>Experiences to build around.</h2>
          <div className="must-do-grid">
            {destination.mustDos.map((item, index) => <article key={item.title}><b>{String(index + 1).padStart(2, "0")}</b><div><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}
          </div>
        </div>
        <aside className="destination-side-note">
          <span className="eyebrow">Trip lens</span>
          <h3>Do not try to collect everything.</h3>
          <p>Choose two or three anchor experiences, then protect time for the destination itself. Waylume AI can help compare possible shapes before current supplier research begins.</p>
          <Link href={`/concierge?idea=${encodeURIComponent(`Help me explore ${destination.name}`)}`}>Explore {destination.name} with AI <ArrowRight size={15} /></Link>
        </aside>
      </section>

      <section className="culture-night-band">
        <div className="shell culture-night-grid">
          <article><div><Music2 size={21} /><span>Culture</span></div><h2>Find the story beneath the scenery.</h2><p>{destination.culture}</p></article>
          <article><div><MoonStar size={21} /><span>After dark</span></div><h2>Choose the night that feels like you.</h2><p>{destination.nightlife}</p></article>
        </div>
      </section>

      <section className="inspire-section shell stay-trip-grid">
        <article>
          <span className="eyebrow"><Building2 size={15} /> Where to base the trip</span><h2>Stay directions</h2>
          <ol>{destination.stayIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ol>
        </article>
        <article>
          <span className="eyebrow"><Compass size={15} /> Ways to shape it</span><h2>Trip ideas</h2>
          <ol>{destination.tripIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ol>
        </article>
      </section>

      <section className="destination-next-step">
        <div className="shell destination-next-grid">
          <div><span className="eyebrow"><Sparkles size={15} /> From inspiration to research</span><h2>Make {destination.name} your own.</h2><p>Use the AI to refine the pace, stay style, culture, nightlife, must-dos, and possible itinerary. When the brief feels right, Waylume researches current supplier options manually.</p></div>
          <div className="destination-next-actions"><Link className="button" href={`/concierge?idea=${encodeURIComponent(`Plan a ${destination.name} trip with me`)}`}>Explore with Waylume AI <ArrowRight size={16} /></Link><Link className="ghost light-ghost" href={`/?destination=${encodeURIComponent(destination.name)}#plan`}>Send trip details</Link>{destination.officialGuide && <a href={destination.officialGuide.url} target="_blank" rel="noreferrer">Official visitor resource: {destination.officialGuide.label} <ExternalLink size={14} /></a>}</div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
