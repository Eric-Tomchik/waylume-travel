import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import MarketingShell from "@/components/wl/MarketingShell";
import ContactForm from "@/components/wl/ContactForm";
import { Reveal } from "@/components/wl/Interactive";
import { HOST_AGENCY } from "@/lib/hostAgency";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Eric Tomchik, Independent Advisor of Fora Travel, Inc. Complimentary planning, a reply within one business day, and a real person on the other end of the phone.",
};

const PROMISES = [
  { title: "A reply within one business day", copy: "Usually much sooner. If I'm travelling with clients I'll tell you when I can talk properly." },
  { title: "No cost, no obligation", copy: "Planning is complimentary — suppliers pay the commission. You never pay me a fee." },
  { title: "Nothing gets booked without you", copy: "I bring options and honest pricing; you decide. Payment only ever happens through a Fora-approved or supplier-secure workflow." },
];

export default function ContactPage() {
  return (
    <MarketingShell cta={false}>
      <section className="pad" style={{ paddingBottom: 48 }}>
        <div className="shell contact-hero">
          <Reveal>
            <div className="advisor-card">
              <Image
                src="/eric-tomchik.webp"
                alt="Eric Tomchik, Independent Advisor of Fora Travel, Inc."
                width={512}
                height={512}
                sizes="(max-width: 700px) 60vw, 260px"
                className="advisor-photo"
                priority
              />
              <div className="eyebrow" style={{ marginTop: 22 }}>Your advisor</div>
              <h2 style={{ fontSize: 32, margin: "10px 0 6px" }}>Eric Tomchik</h2>
              <p style={{ margin: 0, color: "var(--foam)", fontSize: 14 }}>{HOST_AGENCY.disclosure}</p>

              <div className="contact-cards" style={{ textAlign: "left" }}>
                <div>
                  <b>Bookings &amp; existing trips</b>
                  <a href="mailto:eric.tomchik@fora.travel">eric.tomchik@fora.travel</a>
                </div>
                <div>
                  <b>General inquiries</b>
                  <a href="mailto:advisor@waylumetravel.com">advisor@waylumetravel.com</a>
                </div>
                <div>
                  <b>Call or text</b>
                  <a href="tel:+12283445724">(228) 344-5724</a>
                  <span style={{ color: "#e6dccd", fontSize: 14, display: "block", marginTop: 4 }}>
                    Or ask for a call in the form and I&apos;ll ring you at the time you choose.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div>
              <div className="eyebrow">Contact</div>
              <h1 style={{ fontSize: "clamp(36px,5vw,60px)", margin: "12px 0 16px" }}>
                Tell me the idea.<br /><span className="grad">I&apos;ll handle the rest.</span>
              </h1>
              <p className="lead" style={{ maxWidth: "56ch" }}>
                The more you tell me here, the more useful my first reply is. Everything goes straight to
                me — no call centre, no chatbot, no shared inbox.
              </p>
              <div className="promises">
                {PROMISES.map((promise) => (
                  <div key={promise.title}>
                    <b>{promise.title}</b>
                    <span>{promise.copy}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pad" style={{ paddingTop: 0 }}>
        <div className="shell" style={{ maxWidth: 920 }}>
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </MarketingShell>
  );
}
