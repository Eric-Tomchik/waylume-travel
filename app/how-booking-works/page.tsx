import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Compass,
  FileCheck2,
  Hotel,
  MessageSquareText,
  Plane,
  SearchCheck,
  ShieldCheck,
  Ship,
  Sparkles,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { BOOKING_BOUNDARY, HOST_AGENCY } from "@/lib/hostAgency";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...canonicalMetadata("/how-booking-works"),
  title: "How Booking Works",
  description:
    "See how Waylume inspiration and AI-assisted research become advisor-researched options and secure travel bookings through Fora-approved and supplier workflows.",
};

const bookingSteps = [
  {
    icon: Compass,
    number: "01",
    title: "Discover what fits",
    description:
      "Browse destination guides, stories, cruises, resorts, vacation styles, nightlife, culture, and must-do experiences. Save or share anything that sparks an idea.",
  },
  {
    icon: MessageSquareText,
    number: "02",
    title: "Build your trip brief",
    description:
      "Use Waylume AI to compare directions or send your details directly. Your preferences become a clear brief for a human advisor—not an automatic booking.",
  },
  {
    icon: SearchCheck,
    number: "03",
    title: "Review personalized options",
    description:
      "Your Waylume advisor researches current availability, final pricing, terms, and eligible benefits, then presents a proposal or supported bookable quote.",
  },
  {
    icon: FileCheck2,
    number: "04",
    title: "Book and travel with support",
    description:
      "Approve the right option, complete payment through the authorized booking path, and use Waylume for trip status, itinerary details, and advisor follow-through.",
  },
];

const supportedDirections = [
  { icon: Hotel, title: "Hotels, resorts & all-inclusives", copy: "From boutique city stays to beach resorts and coordinated vacation packages." },
  { icon: Ship, title: "Ocean, river & expedition cruises", copy: "Ship style, cabin priorities, itinerary pace, excursions, and pre- or post-cruise stays." },
  { icon: Compass, title: "Tours, activities & custom trips", copy: "Guided journeys, local experiences, transfers, and multi-stop itineraries." },
  { icon: Plane, title: "Flights as part of the trip", copy: "Routing and schedule preferences coordinated as a supported itinerary component." },
];

export default function HowBookingWorksPage() {
  return (
    <main className="inspiration-site">
      <SiteHeader />

      <section className="booking-hero">
        <div className="shell booking-hero-grid">
          <div>
            <span className="eyebrow"><Sparkles size={15} /> From inspiration to confirmation</span>
            <h1>Inspired by the world. Booked with an advisor.</h1>
            <p>Waylume gives you a beautiful place to explore, save, and shape ideas. When the trip becomes real, your Waylume advisor brings those ideas into an approved research, proposal, and booking workflow.</p>
            <div className="booking-hero-actions">
              <Link className="button" href="/#plan">Request personalized options <ArrowRight size={17} /></Link>
              <Link href="/concierge">Start with Waylume AI <Sparkles size={15} /></Link>
            </div>
          </div>
          <aside>
            <ShieldCheck size={27} />
            <span>Transparent relationship</span>
            <h2>Waylume is your travel advisory. Fora is the host agency.</h2>
            <p>{HOST_AGENCY.relationship} Your advisor remains your point of contact while approved agency and supplier systems support research, booking, and servicing.</p>
            <strong>{HOST_AGENCY.disclosure}</strong>
          </aside>
        </div>
      </section>

      <section className="inspire-section shell">
        <div className="editorial-heading booking-heading">
          <div><span className="eyebrow">The client journey</span><h2>Four clear steps. One advisor beside you.</h2></div>
          <p>No need to arrive knowing exactly what to book. Start with a place, a feeling, a celebration, or even a saved article.</p>
        </div>
        <div className="booking-step-grid">
          {bookingSteps.map(({ icon: Icon, number, title, description }) => (
            <article key={number}>
              <div><Icon size={23} /><b>{number}</b></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="booking-boundary-band">
        <div className="shell booking-boundary-grid">
          <div>
            <span className="eyebrow">What happens where</span>
            <h2>A useful separation between discovery and booking.</h2>
          </div>
          <div className="booking-boundary-cards">
            <article>
              <small>On waylumetravel.com</small>
              <h3>Explore, save, share, ask, and request.</h3>
              <ul>
                <li><Check size={15} /> Editorial destination and trip inspiration</li>
                <li><Check size={15} /> AI-assisted planning and preference gathering</li>
                <li><Check size={15} /> Secure trip-request intake without card details</li>
                <li><Check size={15} /> Advisor communication, trip status, and itineraries</li>
              </ul>
            </article>
            <article>
              <small>Through approved booking workflows</small>
              <h3>Research, propose, pay, confirm, and service.</h3>
              <ul>
                <li><Check size={15} /> Current supplier availability and final pricing</li>
                <li><Check size={15} /> Proposals or bookable quotes when supported</li>
                <li><Check size={15} /> Secure payment through Fora or the supplier</li>
                <li><Check size={15} /> Supplier confirmation and booking terms</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="inspire-section shell">
        <div className="editorial-heading booking-heading">
          <div><span className="eyebrow">Trips we can shape</span><h2>More than flights and hotel rooms.</h2></div>
          <p>Waylume starts with the experience you want, then your advisor researches the right mix of travel components.</p>
        </div>
        <div className="booking-products-grid">
          {supportedDirections.map(({ icon: Icon, title, copy }) => (
            <article key={title}><Icon size={22} /><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="booking-perks-note">
          <ShieldCheck size={20} />
          <p><strong>About preferred benefits:</strong> eligible bookings may include property- or program-specific amenities. Benefits are never universal and will be confirmed in your personalized proposal.</p>
        </div>
      </section>

      <section className="booking-final-cta">
        <div className="shell">
          <span className="eyebrow">Ready when you are</span>
          <h2>Bring us the idea. We’ll help turn it into a bookable trip.</h2>
          <p>{BOOKING_BOUNDARY}</p>
          <div><Link className="button" href="/#plan">Request personalized options <ArrowRight size={17} /></Link><Link href="/destinations">Keep exploring destinations</Link></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
