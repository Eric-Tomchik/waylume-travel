import type { Metadata } from "next";
import AiConcierge from "@/components/AiConcierge";
import "./globals.css";
import "./phase2.css";
import "./phase3.css";
import "./phase4.css";
import "./phase5.css";
import "./phase6.css";
import "./brand-fix.css";
import "./phase8.css";

export const metadata: Metadata = {
  title: {
    default: "Waylume Travel | AI-Assisted Travel Planning",
    template: "%s | Waylume Travel",
  },
  description:
    "Plan trips conversationally with Waylume AI, then work with a real travel advisor for current supplier options, pricing, and booking support. Independent Agent of Fora Travel, Inc.",
  openGraph: {
    title: "Waylume Travel | AI-Assisted Travel Planning",
    description: "Conversational travel discovery with real advisor follow-through.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AiConcierge />
      </body>
    </html>
  );
}
