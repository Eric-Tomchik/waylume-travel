import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import AiConcierge from "@/components/AiConcierge";

export const metadata: Metadata = {
  title: "AI Travel Concierge",
  description: "Plan a trip conversationally with Waylume AI, then hand the finished brief to a real travel advisor for supplier research and booking support.",
};

export default function ConciergePage() {
  return (
    <main className="concierge-page">
      <section className="concierge-intro">
        <div className="shell concierge-intro-inner">
          <div>
            <Link href="/" className="back-link"><ArrowLeft size={15} /> Waylume Travel</Link>
            <span className="eyebrow"><Sparkles size={16} /> AI travel concierge</span>
            <h1>Plan naturally. Refine instantly. Hand it to a real advisor.</h1>
            <p className="lead">Describe the trip the way you would explain it to a person. Waylume AI keeps the details together, asks the next useful question, and builds a planning brief as the conversation evolves.</p>
          </div>
          <div className="concierge-trust-card">
            <ShieldCheck size={22} />
            <div><strong>Built for advisor-backed travel</strong><p>The AI helps with discovery and planning. Final supplier availability, pricing, payment, and bookings still go through Waylume and applicable travel suppliers.</p></div>
          </div>
        </div>
      </section>
      <section className="shell concierge-workspace">
        <AiConcierge mode="full" />
      </section>
    </main>
  );
}
