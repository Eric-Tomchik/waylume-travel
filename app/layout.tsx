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
    default: "Waylume Travel | Personalized Travel Planning",
    template: "%s | Waylume Travel",
  },
  description:
    "Discover flights, resorts, cruises, and vacation ideas with personalized support from Waylume Travel, an Independent Agent of Archer.",
  openGraph: {
    title: "Waylume Travel",
    description: "Travel discovery with personal advisor support.",
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
