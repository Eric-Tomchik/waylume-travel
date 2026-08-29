import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import SaveShareActions from "@/components/SaveShareActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { journalArticles } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Travel Journal",
  description: "Read Waylume destination stories, cruise guidance, vacation inspiration, and practical planning perspectives.",
};

export default function JournalPage() {
  return (
    <main className="inspiration-site">
      <SiteHeader />
      <section className="editorial-subhero journal-subhero">
        <div className="shell"><span className="eyebrow"><BookOpen size={15} /> The Waylume Journal</span><h1>Travel ideas with<br />somewhere to go.</h1><p>Stories and practical guides designed to help you discover the trip you want—not pressure you into booking the first option you see.</p></div>
      </section>
      <section className="inspire-section shell">
        <div className="journal-index-grid">
          {journalArticles.map((article, index) => (
            <article className={`journal-index-card tone-${article.color}`} key={article.slug}>
              <div className="journal-index-number">{String(index + 1).padStart(2, "0")}</div>
              <div><small>{article.category} · {article.readTime}</small><h2><Link href={`/journal/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p></div>
              <div className="editorial-card-actions"><Link href={`/journal/${article.slug}`}>Read the story <ArrowRight size={15} /></Link><SaveShareActions compact id={`article:${article.slug}`} kind="article" title={article.title} description={article.excerpt} href={`/journal/${article.slug}`} destination={article.destination} /></div>
            </article>
          ))}
        </div>
      </section>
      <section className="journal-ai-prompt"><div className="shell"><Sparkles size={23} /><div><strong>Have a destination or travel question the journal has not covered?</strong><p>Ask Waylume AI to explore the possibilities and turn your priorities into a structured trip direction.</p></div><Link className="button" href="/concierge">Ask Waylume AI <ArrowRight size={16} /></Link></div></section>
      <SiteFooter />
    </main>
  );
}
