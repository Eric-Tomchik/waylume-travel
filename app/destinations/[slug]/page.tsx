import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/wl/MarketingShell";
import { HeartButton, Reveal } from "@/components/wl/Interactive";
import { bestMonths, destinations, getDestination, MONTH_LABELS } from "@/lib/destinations";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return { title: "Destination not found" };
  return {
    title: `${destination.name} — when to go and what to build the trip around`,
    description: `${destination.tagline} When to go, the experiences worth planning around, where to base yourself, and how to book it with an independent travel advisor.`,
    openGraph: {
      title: `${destination.name} | Waylume Travel`,
      description: destination.tagline,
      type: "article",
      images: [{ url: `/photos/${destination.photo}.webp` }],
    },
  };
}

export default async function DestinationDetail({ params }: Props) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const contactHref = `/contact?destination=${encodeURIComponent(destination.name)}`;
  const related = destinations
    .filter((item) => item.slug !== destination.slug)
    .map((item) => ({ item, shared: item.vibes.filter((vibe) => destination.vibes.includes(vibe)).length }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
    .map(({ item }) => item);

  return (
    <MarketingShell cta={false}>
      <section className="dest-hero">
        <div className="dest-hero-bg" style={{ backgroundImage: `url('/photos/${destination.photo}.webp')` }} />
        <div className="shell dest-hero-in">
          <div className="dest-crumb">
            <Link href="/destinations">← All destinations</Link>
            <span>{destination.regionLabel ?? destination.region}</span>
          </div>
          <h1>{destination.name}</h1>
          <p className="lead">{destination.tagline}</p>
          <div className="dest-tags">
            {destination.bestFor.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className="dest-hero-cta">
            <Link className="btn" href={contactHref}>Plan this trip with me →</Link>
            <Link className="btn ghost" href="#when">When to go</Link>
          </div>
        </div>
      </section>

      <section className="pad" style={{ paddingBottom: 0 }}>
        <div className="shell split">
          <div>
            <div className="eyebrow">The Waylume take</div>
            <h2 className="dest-h2">{destination.atmosphere}</h2>
          </div>
          <div className="dest-timing" id="when">
            <div className="eyebrow">When to go</div>
            <div className="season" aria-hidden>
              {destination.months.map((score, index) => (
                <span key={index} className={score === 2 ? "good" : score === 1 ? "ok" : ""} />
              ))}
            </div>
            <div className="season-key" aria-hidden>
              {MONTH_LABELS.map((label, index) => <span key={index}>{label}</span>)}
            </div>
            <p className="dest-prime">Prime months: <b>{bestMonths(destination.months)}</b></p>
            <p className="dest-note">{destination.note}</p>
            <span className="sr-only">
              Best months to visit {destination.name}: {destination.months.map((score, index) => (score === 2 ? MONTH_LABELS[index] : null)).filter(Boolean).join(", ")}
            </span>
          </div>
        </div>
      </section>

      <section className="pad">
        <div className="shell">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Must do + see</div>
              <h2>Experiences to build around.</h2>
            </div>
            <p className="lead" style={{ maxWidth: "38ch", marginBottom: 0 }}>
              Pick two or three anchors and protect the time between them. That is the difference
              between a trip you enjoyed and one you talk about.
            </p>
          </div>
          <div className="dest-musts">
            {destination.mustDos.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <article>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pad sand">
        <div className="shell grid g2">
          <div className="dest-panel">
            <div className="eyebrow">Culture</div>
            <h3>Find the story beneath the scenery.</h3>
            <p>{destination.culture}</p>
          </div>
          <div className="dest-panel">
            <div className="eyebrow">After dark</div>
            <h3>Choose the night that feels like you.</h3>
            <p>{destination.nightlife}</p>
          </div>
        </div>
      </section>

      <section className="pad">
        <div className="shell grid g2">
          <div>
            <div className="eyebrow">Where to base the trip</div>
            <h2 className="dest-h3">Stay directions</h2>
            <ol className="dest-list">
              {destination.stayIdeas.map((idea) => <li key={idea}>{idea}</li>)}
            </ol>
          </div>
          <div>
            <div className="eyebrow">Ways to shape it</div>
            <h2 className="dest-h3">Trip ideas</h2>
            <ol className="dest-list">
              {destination.tripIdeas.map((idea) => <li key={idea}>{idea}</li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="pad" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="dest-advisor">
            <div className="eyebrow">Why book it with me</div>
            <p>{destination.advisorNote}</p>
            <div className="dest-advisor-actions">
              <Link className="btn" href={contactHref}>Start planning {destination.name} →</Link>
              {destination.officialGuide && (
                <a href={destination.officialGuide.url} target="_blank" rel="noreferrer">
                  Official visitor resource: {destination.officialGuide.label} ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pad dark">
        <div className="shell">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Keep exploring</div>
              <h2>If {destination.name} appeals, so might these.</h2>
            </div>
          </div>
          <div className="grid g3">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 70}>
                <div className="card" style={{ height: "100%" }}>
                  <HeartButton name={item.name} />
                  <Link href={`/destinations/${item.slug}`} style={{ display: "contents" }}>
                    <div className="ph" style={{ backgroundImage: `url('/photos/${item.photo}.webp')` }}>
                      <span className="tag">{item.regionLabel ?? item.region}</span>
                    </div>
                    <div className="bd">
                      <h3>{item.name}</h3>
                      <p>{item.blurb}</p>
                      <div className="meta">
                        <span>{bestMonths(item.months)}</span>
                        <b>Explore →</b>
                      </div>
                    </div>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pad" style={{ paddingTop: 0 }}>
        <div className="shell dest-cta">
          <div>
            <div className="eyebrow">From inspiration to a real trip</div>
            <h2>Make {destination.name} your own.</h2>
            <p className="lead">
              Send me your dates, who is travelling and the shape you have in mind. I research live
              availability through Fora and come back with options built around you — no cost to
              start the conversation, and no obligation to book.
            </p>
          </div>
          <div className="dest-cta-actions">
            <Link className="btn" href={contactHref}>Plan my {destination.name} trip →</Link>
            <Link className="btn ghost" href="/destinations">Browse other destinations</Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
