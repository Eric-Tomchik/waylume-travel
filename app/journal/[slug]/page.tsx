import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import SaveShareActions from "@/components/SaveShareActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getJournalArticle, journalArticles } from "@/lib/journal";
import { JsonLd } from "@/components/JsonLd";
import { articleJsonLd, breadcrumbJsonLd, canonicalMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return journalArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) return { title: "Article not found" };
  return { ...canonicalMetadata(`/journal/${article.slug}`), title: article.title, description: article.excerpt, openGraph: { title: article.title, description: article.excerpt, type: "article" } };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) notFound();

  return (
    <main className="inspiration-site">
      <JsonLd
        data={[
          articleJsonLd(article),
          breadcrumbJsonLd([["Travel News", "/journal"], [article.title, `/journal/${article.slug}`]]),
        ]}
      />
      <SiteHeader />
      <article>
        <header className={`article-hero tone-${article.color}`}>
          <div className="shell article-hero-inner">
            <div><Link className="crumb" href="/journal">Waylume Journal</Link><span className="eyebrow"><BookOpen size={15} /> {article.category} · {article.readTime}</span><h1>{article.title}</h1><p>{article.excerpt}</p></div>
            <SaveShareActions id={`article:${article.slug}`} kind="article" title={article.title} description={article.excerpt} href={`/journal/${article.slug}`} destination={article.destination} />
          </div>
        </header>
        <div className="shell article-layout">
          <div className="article-body">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              </section>
            ))}
            <div className="article-disclosure"><strong>Inspiration, then verification.</strong><p>Travel details, schedules, supplier offerings, availability, terms, and pricing can change. Waylume uses your preferences to research current options before presenting anything as bookable.</p></div>
          </div>
          <aside className="article-aside"><Sparkles size={22} /><span className="eyebrow">Make it personal</span><h3>What would this trip look like for you?</h3><p>Use the article as a starting point. Tell Waylume AI your dates, origin, travelers, pace, and priorities.</p><Link className="button" href={`/concierge?idea=${encodeURIComponent(`Help me plan using this idea: ${article.title}`)}`}>Explore with AI <ArrowRight size={15} /></Link></aside>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
