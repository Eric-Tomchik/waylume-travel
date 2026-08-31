import type { Metadata } from "next";
import MarketingShell, { PageHead } from "@/components/wl/MarketingShell";
import DestinationFinder from "@/components/wl/DestinationFinder";
import { Reveal } from "@/components/wl/Interactive";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...canonicalMetadata("/destinations"),
  title: "Destinations",
  description:
    "Where to go and when: an interactive destination finder covering season, trip style and region, from an independent travel advisor.",
};

export default function DestinationsPage() {
  return (
    <MarketingShell>
      <PageHead
        eyebrow="Destinations"
        title={<>Places, and the right<br />month to see them.</>}
        lead="Filter by when you're free, the kind of trip you want and where in the world you fancy. The bars under each place show the months I'd actually send you — heart the ones you like and send them to me in one click."
      />
      <section className="pad" style={{ paddingTop: 20 }}>
        <div className="shell">
          <Reveal><DestinationFinder /></Reveal>
          <p className="lead" style={{ marginTop: 30, fontSize: 13.5 }}>
            Every trip is priced individually — I quote live availability through Fora&apos;s booking
            platform once we know your dates, so you get a real number rather than a headline one.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
