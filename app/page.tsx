import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Compass, FileCheck2, Globe2, Hotel, Map, MessageSquareText, Music2, SearchCheck, ShieldCheck, Ship, Sparkles, Utensils, Waves } from "lucide-react";
import SaveShareActions from "@/components/SaveShareActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TripRequestForm from "@/components/TripRequestForm";
import { destinations } from "@/lib/destinations";
import { HOST_AGENCY } from "@/lib/hostAgency";
import { journalArticles } from "@/lib/journal";

const tripStyles = [
  { id: "all-inclusive", icon: Hotel, eyebrow: "Stay centered", title: "All-inclusive escapes", description: "Find the resort atmosphere that fits—romantic, family-friendly, wellness-led, lively, or intentionally quiet.", prompt: "Help me explore an all-inclusive vacation" },
  { id: "cruise", icon: Ship, eyebrow: "Unpack once", title: "Ocean, river & expedition cruises", description: "Compare cruise styles, ship personalities, regions, cabin priorities, and the rhythm of days at sea and in port.", prompt: "Help me choose the right cruise style" },
  { id: "packages", icon: Waves, eyebrow: "Coordinated ease", title: "Vacation packages", description: "Explore flight, stay, transfer, and experience combinations that can later be researched as one coordinated direction.", prompt: "Show me vacation package ideas" },
  { id: "custom", icon: Map, eyebrow: "Built around you", title: "Custom journeys", description: "Shape a city, rail, road, island, or multi-stop itinerary around your pace, interests, and ideal level of structure.", prompt: "Help me build a custom itinerary" },
];

export default function Home() {
  const featuredDestinations = destinations.slice(0, 3);

  return (
    <main className="inspiration-site">
      <SiteHeader />

      <section className="inspire-hero">
        <Image src="/waylume-inspiration-hero.webp" alt="Aspirational coastal, cultural, cruise, and nightlife travel scenery" fill priority sizes="100vw" />
        <div className="inspire-hero-shade" />
        <div className="shell inspire-hero-content">
          <span className="hero-kicker"><Sparkles size={15} /> Ideas first. Your trip follows.</span>
          <h1>Where will your curiosity take you?</h1>
          <p>Browse coastlines, cities, cultures, cruises, resorts, and after-dark energy. Save what moves you, share it, then let Waylume AI shape the ideas into a trip brief.</p>
          <div className="hero-search-card">
            <div><Compass size={20} /><span><strong>Start with a feeling or a place</strong><small>“Caribbean culture and nightlife” · “first Alaska cruise” · “food-focused Europe”</small></span></div>
            <Link className="button" href="/concierge">Explore with Waylume AI <ArrowRight size={17} /></Link>
          </div>
          <div className="hero-shortcuts">
            <Link href="/destinations/puerto-rico">Puerto Rico</Link><Link href="/destinations/jamaica">Jamaica</Link><Link href="/destinations/las-vegas">Las Vegas</Link><Link href="/destinations/europe">Europe</Link>
          </div>
        </div>
        <div className="hero-caption">Beaches · Culture · Nightlife · Cruises · Custom journeys</div>
      </section>

      <section className="inspire-section shell">
        <div className="editorial-heading">
          <div><span className="eyebrow">Find your spark</span><h2>A destination is more than a pin on the map.</h2></div>
          <div><p>See the neighborhoods, culture, must-dos, evening atmosphere, and trip styles that make each place feel different.</p><Link href="/destinations">Explore all destinations <ArrowRight size={16} /></Link></div>
        </div>
        <div className="featured-destinations">
          {featuredDestinations.map((destination, index) => (
            <article className={`editorial-card tone-${destination.color}`} key={destination.slug}>
              <div className="card-number">0{index + 1}</div>
              <div><small>{destination.region}</small><h3>{destination.name}</h3><p>{destination.tagline}</p></div>
              <div className="tag-row">{destination.bestFor.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="editorial-card-actions">
                <Link href={`/destinations/${destination.slug}`}>Discover {destination.name} <ArrowRight size={15} /></Link>
                <SaveShareActions compact id={`destination:${destination.slug}`} kind="destination" title={destination.name} description={destination.tagline} href={`/destinations/${destination.slug}`} destination={destination.name} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="trip-styles" className="inspire-section trip-style-band">
        <div className="shell">
          <div className="editorial-heading light">
            <div><span className="eyebrow">Choose your rhythm</span><h2>One vacation idea. Four completely different ways to live it.</h2></div>
            <p>Start with the structure that sounds most like you. Waylume can compare the possibilities before a real advisor researches current supplier options.</p>
          </div>
          <div className="trip-style-grid">
            {tripStyles.map((style) => {
              const Icon = style.icon;
              return (
                <article key={style.id}>
                  <Icon size={25} />
                  <small>{style.eyebrow}</small>
                  <h3>{style.title}</h3>
                  <p>{style.description}</p>
                  <div><Link href={`/concierge?idea=${encodeURIComponent(style.prompt)}`}>Explore this style <ArrowRight size={15} /></Link><SaveShareActions compact id={`collection:${style.id}`} kind="collection" title={style.title} description={style.description} href={`/#trip-styles`} /></div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="inspire-section shell experience-split">
        <div className="experience-statement">
          <span className="eyebrow"><Ship size={15} /> Cruise inspiration</span>
          <h2>The right cruise starts with how you want the days to feel.</h2>
          <p>Big-ship energy, intimate river journeys, family fun, refined dining, expedition adventure, or relaxed island hopping—the ship and pace matter as much as the ports.</p>
          <div className="mini-checks"><span><Check size={15} /> Ocean cruises</span><span><Check size={15} /> River cruises</span><span><Check size={15} /> Expedition styles</span><span><Check size={15} /> Cruise + land stays</span></div>
          <Link className="button" href="/journal/first-cruise-planning-guide">Read the first-cruise guide <ArrowRight size={16} /></Link>
        </div>
        <div className="experience-mosaic">
          <article><Globe2 /><span>See more places</span><strong>Mediterranean, Caribbean, Alaska, rivers, and beyond.</strong></article>
          <article><Hotel /><span>Find your ship style</span><strong>Match dining, entertainment, space, and atmosphere to you.</strong></article>
          <article><Waves /><span>Shape the full trip</span><strong>Add pre-cruise nights, transfers, excursions, and a land extension.</strong></article>
        </div>
      </section>

      <section className="inspire-section culture-section">
        <div className="shell culture-grid">
          <div>
            <span className="eyebrow">Go beyond the postcard</span>
            <h2>Come for the view. Remember the flavor, the stories, and the night.</h2>
            <p>Waylume destination guides are designed around the full experience—not only where to sleep. Explore the cultural layer, local food, must-see places, and the kind of evening you want after the sun goes down.</p>
            <Link href="/destinations">Browse destination guides <ArrowRight size={16} /></Link>
          </div>
          <div className="culture-notes">
            <article><Utensils size={20} /><span><small>Local flavor</small><strong>Markets, neighborhood dining, regional traditions, and food-led experiences.</strong></span></article>
            <article><Music2 size={20} /><span><small>After dark</small><strong>Live music, lounges, shows, dance, and nightlife that matches your comfort level.</strong></span></article>
            <article><Compass size={20} /><span><small>Must do + see</small><strong>Iconic sights balanced with the experiences that reveal a place more slowly.</strong></span></article>
          </div>
        </div>
      </section>

      <section className="inspire-section shell">
        <div className="editorial-heading">
          <div><span className="eyebrow">The Waylume Journal</span><h2>Ideas worth building a trip around.</h2></div>
          <div><p>Destination stories, cruise guidance, and practical planning perspectives to help you discover what you actually want.</p><Link href="/journal">Read every story <ArrowRight size={16} /></Link></div>
        </div>
        <div className="journal-preview-grid">
          {journalArticles.slice(0, 3).map((article) => (
            <article className={`journal-preview tone-${article.color}`} key={article.slug}>
              <div><small>{article.category} · {article.readTime}</small><h3><Link href={`/journal/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p></div>
              <div className="editorial-card-actions"><Link href={`/journal/${article.slug}`}>Read story <ArrowRight size={15} /></Link><SaveShareActions compact id={`article:${article.slug}`} kind="article" title={article.title} description={article.excerpt} href={`/journal/${article.slug}`} destination={article.destination} /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-editorial-band">
        <div className="shell ai-editorial-grid">
          <div><span className="eyebrow"><Sparkles size={15} /> Waylume AI research</span><h2>Bring the scattered ideas. Leave with one clear direction.</h2><p>Tell Waylume AI what you saved, what you love, and what you want to avoid. It can compare destinations, cruise styles, lodging directions, and itinerary shapes—then organize the result for human advisor research.</p></div>
          <div className="ai-steps"><span><b>01</b>Browse and save inspiration</span><span><b>02</b>Explore possibilities with AI</span><span><b>03</b>Send one structured brief</span><span><b>04</b>Advisor researches current options</span></div>
          <Link className="button" href="/concierge">Start a travel conversation <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="inspire-section shell advisor-booking-section">
        <div className="advisor-booking-intro">
          <div>
            <span className="eyebrow">Waylume + Fora</span>
            <h2>Inspiration here. Personalized booking with your advisor.</h2>
          </div>
          <div>
            <p>Waylume helps you discover and define the trip. When you are ready, your Waylume advisor researches current options and guides the proposal, secure booking, and follow-through using Fora-approved and supplier systems.</p>
            <Link href="/how-booking-works">See exactly how booking works <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="advisor-booking-steps">
          <article><Compass size={22} /><b>01</b><h3>Explore</h3><p>Browse destinations, guides, cruises, packages, culture, nightlife, and must-do experiences.</p></article>
          <article><MessageSquareText size={22} /><b>02</b><h3>Shape the brief</h3><p>Save and share ideas, use Waylume AI, or send your trip details directly.</p></article>
          <article><SearchCheck size={22} /><b>03</b><h3>Compare options</h3><p>Your advisor researches current supplier choices, final pricing, terms, and eligible benefits.</p></article>
          <article><FileCheck2 size={22} /><b>04</b><h3>Book securely</h3><p>Review the proposal and complete payment through an approved Fora or supplier workflow.</p></article>
        </div>
        <div className="advisor-booking-trust">
          <ShieldCheck size={19} />
          <p><strong>{HOST_AGENCY.disclosure}.</strong> Preferred benefits may be available on eligible bookings; inclusions vary and are confirmed in your proposal.</p>
        </div>
      </section>

      <section id="plan" className="inspire-section shell plan-grid inspiration-plan">
        <div>
          <span className="eyebrow">Ready for advisor research</span>
          <h2>Already know the direction? Send the details.</h2>
          <p className="lead compact">Your request enters the Waylume advisor workflow for manual research of current supplier availability, final pricing, booking terms, and relevant choices.</p>
          <div className="notice"><strong>Discovery content, clearly separated from booking</strong><p>Waylume Travel is an independently branded travel advisory. {HOST_AGENCY.disclosure}. Website ideas and AI suggestions are inspirational and are not claims of live inventory, confirmed pricing, or completed reservations.</p></div>
        </div>
        <TripRequestForm />
      </section>

      <SiteFooter />
    </main>
  );
}
