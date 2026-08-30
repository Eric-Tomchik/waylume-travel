import type { ReactNode } from "react";
import { CtaBand, SiteFooter, SiteHeader } from "@/components/wl/Chrome";
import { ScrollProgress, ShortlistTray } from "@/components/wl/Interactive";

type Props = {
  children: ReactNode;
  /** Set false on pages that end with their own call to action (e.g. the enquiry form). */
  cta?: boolean;
};

/** Header + footer wrapper for every public marketing page. */
export default function MarketingShell({ children, cta = true }: Props) {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main>{children}</main>
      {cta ? <CtaBand /> : null}
      <SiteFooter />
      <ShortlistTray />
    </>
  );
}

type HeadProps = { eyebrow: string; title: ReactNode; lead: string };

export function PageHead({ eyebrow, title, lead }: HeadProps) {
  return (
    <div className="shell pagehead">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p className="lead" style={{ maxWidth: "62ch" }}>{lead}</p>
    </div>
  );
}
