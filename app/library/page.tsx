import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell, { PageHead } from "@/components/wl/MarketingShell";
import BookLibrary from "@/components/wl/BookLibrary";
import { BOOKS } from "@/lib/books";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...canonicalMetadata("/library"),
  title: "Travel Library",
  description:
    "Fifty travel books worth your time — inspiration, travel writing, food and culture, photography and practical guides, chosen by an independent travel advisor.",
};

export default function LibraryPage() {
  return (
    <MarketingShell>
      <PageHead
        eyebrow="Travel library"
        title={
          <>
            Fifty books that start
            <br />
            the next big trip.
          </>
        }
        lead="Half of planning a trip is deciding you want to go. These are the books I keep coming back to — the ones that turn a vague itch into a real destination. Filter by mood, or search for a country you've been circling."
      />

      <section className="pad" style={{ paddingTop: 18 }}>
        <div className="shell">
          <BookLibrary />
        </div>
      </section>

      <section className="pad" style={{ paddingTop: 0 }}>
        <div className="shell lib-outro">
          <h2>Read something here and want to go?</h2>
          <p>
            That is rather the point. Tell me which book set you off and I will build the real
            version of it — the flights, the hotels, the guides, the bits the book leaves out.{" "}
            <Link href="/contact">Start with a message</Link>, or browse{" "}
            <Link href="/destinations">the destinations</Link> first.
          </p>
          <p className="lib-disclosure">
            <b>Disclosure:</b> Waylume Travel is a participant in the Amazon Services LLC Associates
            Program, an affiliate advertising program designed to provide a means for sites to earn
            advertising fees by advertising and linking to Amazon.com. As an Amazon Associate I earn
            from qualifying purchases. Book links on this page ({BOOKS.length} titles) are affiliate
            links — they cost you nothing extra, and they never influence which trips or hotels I
            recommend. Cover images are supplied by the Open Library covers service.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
