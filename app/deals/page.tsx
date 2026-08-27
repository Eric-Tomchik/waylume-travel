import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const promos = [
  { badge: "Beach escape", title: "All-inclusive resort ideas", description: "Explore Caribbean and Mexico resort options built around your dates, departure airport, traveler count, and preferred experience.", destination: "Caribbean or Mexico" },
  { badge: "Cruise planning", title: "Find the right sailing", description: "Start with cruise length, region, preferred port, and travel style. Waylume can help narrow the supplier options that fit.", destination: "Cruise" },
  { badge: "City + stay", title: "Flight and hotel getaways", description: "Build a short escape or longer vacation around flexible flight and hotel combinations instead of one-size-fits-all packages.", destination: "Flight + Hotel" },
];

export default function DealsPage() {
  return (
    <main>
      <section className="subhero">
        <div className="shell">
          <Link className="back-link" href="/">← Waylume Travel</Link>
          <span className="eyebrow"><Sparkles size={16}/> Promotions & inspiration</span>
          <h1>Start with an idea. Confirm the real offer with an advisor.</h1>
          <p className="lead">Waylume can spotlight travel opportunities without presenting unverified live pricing. Final availability, supplier terms, and pricing are confirmed during the booking process.</p>
        </div>
      </section>
      <section className="section shell">
        <div className="promo-grid">
          {promos.map((promo) => (
            <article className="promo-card" key={promo.title}>
              <small>{promo.badge}</small>
              <h2>{promo.title}</h2>
              <p>{promo.description}</p>
              <Link href={`/?destination=${encodeURIComponent(promo.destination)}#plan`}>Request current options <ArrowRight size={15}/></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
