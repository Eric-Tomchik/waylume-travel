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
import "./inspiration.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.waylumetravel.com"),
  title: {
    default: "Waylume Travel | Inspiration, AI Research & Advisor Planning",
    template: "%s | Waylume Travel",
  },
  description:
    "Explore destinations, cruises, vacation packages, culture, nightlife, and travel stories. Save ideas, research with Waylume AI, then book with an independent advisor of Fora Travel, Inc.",
  openGraph: {
    title: "Waylume Travel | Ideas first. Your trip follows.",
    description: "Inspirational travel discovery, AI-assisted research, and real advisor follow-through.",
    url: "https://www.waylumetravel.com",
    siteName: "Waylume Travel",
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
