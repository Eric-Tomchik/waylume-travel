import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Compass } from "lucide-react";
import { destinations } from "@/lib/destinations";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export default async function DestinationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = destinations.find((item) => item.slug === slug);
  if (!destination) notFound();

  return (
    <main>
      <section className="subhero">
        <div className="shell">
          <Link className="back-link" href="/destinations">← All destinations</Link>
          <span className="eyebrow"><Compass size={16}/> {destination.region}</span>
          <h1>{destination.name}</h1>
          <p className="lead">{destination.tagline}</p>
        </div>
      </section>
      <section className="section shell destination-detail">
        <div>
          <h2>Why travelers consider {destination.name}</h2>
          <p className="lead compact">{destination.description}</p>
          <div className="tag-row">{destination.bestFor.map((tag) => <small key={tag}>{tag}</small>)}</div>
        </div>
        <aside className="detail-cta">
          <span className="eyebrow">Build around you</span>
          <h3>Turn this idea into a real trip request.</h3>
          <p>Tell Waylume your dates, budget, travelers, and priorities. Final supplier availability and pricing are confirmed separately.</p>
          <Link className="button" href={`/?destination=${encodeURIComponent(destination.name)}#plan`}>Plan {destination.name} <ArrowRight size={17}/></Link>
        </aside>
      </section>
    </main>
  );
}
