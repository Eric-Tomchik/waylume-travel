import type { Metadata } from "next";
import { Suspense } from "react";
import MarketingShell from "@/components/wl/MarketingShell";
import PlanForm from "@/components/wl/PlanForm";

export const metadata: Metadata = {
  title: "Plan a trip",
  description:
    "Tell Eric Tomchik, Independent Advisor of Fora Travel, Inc., what you have in mind. Complimentary planning, a reply within one business day.",
};

export default function PlanPage() {
  return (
    <MarketingShell cta={false}>
      <section className="pad dark">
        <div className="shell plan-grid">
          <div>
            <div className="eyebrow">Plan a trip</div>
            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", margin: "14px 0 18px", color: "#fff" }}>
              Tell me the idea.<br />I&apos;ll handle the rest.
            </h2>
            <p className="lead">
              No cost, no obligation. I&apos;ll come back within one business day with a first direction,
              honest pricing ranges, and two or three options worth your time.
            </p>
            <div className="contact-cards">
              <div>
                <b>Bookings &amp; existing trips</b>
                <a href="mailto:eric.tomchik@fora.travel">eric.tomchik@fora.travel</a>
              </div>
              <div>
                <b>General inquiries</b>
                <a href="mailto:advisor@waylumetravel.com">advisor@waylumetravel.com</a>
              </div>
              <div>
                <b>Advisor</b>
                <span style={{ color: "#e6dccd", fontSize: 16 }}>
                  Eric Tomchik · Independent Advisor of Fora Travel, Inc.
                </span>
              </div>
            </div>
          </div>
          <Suspense fallback={null}>
            <PlanForm />
          </Suspense>
        </div>
      </section>
    </MarketingShell>
  );
}
