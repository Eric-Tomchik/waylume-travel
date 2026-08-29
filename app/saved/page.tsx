import type { Metadata } from "next";
import { Bookmark } from "lucide-react";
import SavedIdeasView from "@/components/SavedIdeasView";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Saved Travel Inspiration",
  description: "Review the destinations, guides, and vacation ideas saved to your Waylume inspiration board.",
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return (
    <main className="inspiration-site">
      <SiteHeader />
      <section className="editorial-subhero saved-subhero"><div className="shell"><span className="eyebrow"><Bookmark size={15} /> Your inspiration board</span><h1>Keep the ideas<br />that feel like you.</h1><p>Collect destination guides, travel stories, and vacation styles while you browse. Share the board or use it to start an AI-assisted planning conversation.</p></div></section>
      <section className="inspire-section shell"><SavedIdeasView /></section>
      <SiteFooter />
    </main>
  );
}
