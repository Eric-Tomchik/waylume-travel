import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { destinations } from "@/lib/destinations";

export default function DestinationsPage() {
  return (
    <main>
      <section className="subhero">
        <div className="shell">
          <Link className="back-link" href="/">← Waylume Travel</Link>
          <span className="eyebrow"><Compass size={16}/> Destination discovery</span>
          <h1>Start with a place. Build around the experience.</h1>
          <p className="lead">Browse a few high-interest starting points, then send Waylume the details that matter to you. These are inspiration categories—not live supplier pricing.</p>
        </div>
      </section>
      <section className="section shell">
        <div className="destination-grid">
          {destinations.map((destination) => (
            <article className="destination-card" key={destination.slug}>
              <span>{destination.region}</span>
              <h2>{destination.name}</h2>
              <strong>{destination.tagline}</strong>
              <p>{destination.description}</p>
              <div className="tag-row">{destination.bestFor.map((tag) => <small key={tag}>{tag}</small>)}</div>
              <div className="card-actions">
                <Link href={`/destinations/${destination.slug}`}>Explore destination <ArrowRight size={15}/></Link>
                <Link href={`/?destination=${encodeURIComponent(destination.name)}#plan`}>Plan this trip</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
