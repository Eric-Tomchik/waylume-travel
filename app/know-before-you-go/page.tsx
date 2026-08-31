import type { Metadata } from "next";
import MarketingShell, { PageHead } from "@/components/wl/MarketingShell";
import { AdvisoryBoard } from "@/components/wl/Live";
import { canonicalMetadata } from "@/lib/seo";

export const revalidate = 21600;

export const metadata: Metadata = {
  ...canonicalMetadata("/know-before-you-go"),
  title: "Know Before You Go",
  description:
    "Entry requirements, passport rules, insurance and booking timelines for US travelers — plus a live feed of current U.S. State Department travel advisories.",
};

const FAQS = [
  {
    q: "Do I need REAL ID to fly?",
    a: "Yes — since 7 May 2025 every US domestic flier 18 and over needs a REAL ID-compliant license (look for the star) or an accepted alternative such as a US passport, passport card, or Global Entry card. Since 1 February 2026 travellers without one face a $45 TSA ConfirmID fee, up to 30 extra minutes of screening, and no guarantee of clearance. Simplest fix: carry your passport.",
    open: true,
  },
  {
    q: "Europe: ETIAS and the Entry/Exit System",
    a: "The EU's biometric Entry/Exit System reached full operation on 10 April 2026 — expect fingerprints and a facial scan instead of a passport stamp at your first Schengen entry. ETIAS, the €20 pre-travel authorization for 30 European countries, is expected in Q4 2026 with a six-month transition period. Apply as soon as it opens; it is tied to your passport number.",
  },
  {
    q: "United Kingdom: the ETA is mandatory",
    a: "Americans have needed an Electronic Travel Authorisation since January 2025, and since 25 February 2026 it is enforced without discretion — airlines are fined for boarding you without one. It costs £20, lasts two years or until your passport expires, and covers multiple visits of up to six months. It is required for transit too. Dual US/UK citizens must travel on their British passport.",
  },
  {
    q: "Brazil now requires an e-visa",
    a: "$80.90, valid two years, multiple entry, 90 days per stay. Processing runs five to eight business days — allow two weeks. It is linked to your passport number: renew your passport and you must reapply. Apply only at the official government portal.",
  },
  {
    q: "The six-month passport rule",
    a: "More than 70 countries require six months of passport validity beyond your entry date, and airlines will deny boarding without it. Check your expiry before you book anything, not before you pack. Renewals are slower in peak season.",
  },
  {
    q: "When should I book?",
    a: "For 2027 travel: peak-season Europe, Japan in cherry-blossom or maple season, and safari camps should be held nine to twelve months out. Luxury bookings for stays one to two years ahead were up sharply this year — the good rooms genuinely go early. Shoulder season now books like peak season did three years ago.",
  },
  {
    q: "Travel insurance — what actually matters",
    a: "Buy within 14 to 21 days of your first deposit to keep pre-existing-condition waivers. Prioritize medical evacuation limits over trip-cost coverage on remote itineraries such as safari or expedition cruising. “Cancel for any reason” is an add-on, not a default, and typically refunds 50–75%.",
  },
  {
    q: "Paying for a trip: deposits and timelines",
    a: "Most luxury hotels hold on a card with free cancellation 7–30 days out; villas and cruises take non-refundable deposits with final payment 90–120 days before departure. I'll always tell you the exact cancellation terms in writing before you pay anything.",
  },
];

export default function KnowBeforeYouGoPage() {
  return (
    <MarketingShell>
      <PageHead
        eyebrow="Know before you go"
        title={<>Guidelines, paperwork<br />and hard-won tips.</>}
        lead="The boring things that ruin trips. Always confirm with the official source before you travel — and I'll flag anything that applies to your itinerary when we plan."
      />

      <section className="pad" style={{ paddingTop: 26 }}>
        <div className="shell" style={{ maxWidth: 900 }}>
          <div className="acc">
            {FAQS.map((faq) => (
              <details key={faq.q} open={faq.open}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pad sand">
        <div className="shell">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Live safety feed</div>
              <h2>Current U.S. State Department advisories</h2>
            </div>
            <p className="lead">
              Pulled directly from travel.state.gov. A Level 3 or 4 listing doesn&apos;t always mean
              “don&apos;t go” — it means we plan around it. Ask me before you cancel anything.
            </p>
          </div>
          <AdvisoryBoard />
        </div>
      </section>
    </MarketingShell>
  );
}
