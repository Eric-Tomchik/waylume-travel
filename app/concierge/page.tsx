import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import AiConcierge from "@/components/AiConcierge";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...canonicalMetadata("/concierge"),
  title: "AI Travel Concierge",
  description: "Explore trip possibilities conversationally with Waylume AI, then send the completed brief to a real travel advisor for current supplier research and final pricing.",
};

export default function ConciergePage() {
  return (
    <main className="concierge-page">
      <SiteHeader />
      <section className="concierge-intro">
        <div className="shell concierge-intro-inner">
          <div>
            <Link href="/" className="back-link"><ArrowLeft size={15} /> Waylume Travel</Link>
            <span className="eyebrow"><Sparkles size={16} /> AI trip discovery</span>
            <h1>Explore the possibilities. Build the brief. Let your advisor research the rest.</h1>
            <p className="lead">Talk through the trip the way you would with a person. Waylume AI helps you explore destinations, hotel and resort styles, flight approaches, cruises, and experiences while keeping the trip parameters organized for your Waylume advisor.</p>
          </div>
          <div className="concierge-trust-card">
            <ShieldCheck size={22} />
            <div><strong>Ideas first. Advisor-confirmed details second.</strong><p>Waylume AI does not generate fares or claim live inventory. Your advisor researches current supplier availability, final pricing, terms, and booking choices through Fora-approved and supplier systems after receiving your trip brief.</p></div>
          </div>
        </div>
      </section>
      <section className="shell concierge-workspace">
        <AiConcierge mode="full" />
      </section>
      <SiteFooter />
    </main>
  );
}
