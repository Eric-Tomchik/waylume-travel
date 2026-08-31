import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { canonical, OG_IMAGE, travelAgencyJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";
import "./phase2.css";
import "./phase3.css";
import "./phase4.css";
import "./phase5.css";
import "./phase6.css";
import "./brand-fix.css";
import "./phase8.css";
import "./inspiration.css";
import "./waylume.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.waylumetravel.com"),
  title: {
    default: "Waylume Travel | Travel Inspiration & Advisor Planning",
    template: "%s | Waylume Travel",
  },
  description:
    "Destination guides, hotel ratings, current promotions and live travel news from Eric Tomchik, Independent Advisor of Fora Travel, Inc. Inspiration first \u2014 then a booked trip.",
  openGraph: {
    title: "Waylume Travel | Ideas first. Your trip follows.",
    description: "Travel inspiration, hotel ratings, promotions and live travel news \u2014 planned and booked by a real advisor.",
    url: "https://www.waylumetravel.com",
    siteName: "Waylume Travel",
    type: "website",
    images: [OG_IMAGE],
  },
  alternates: { canonical: canonical("/") },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: "Waylume Travel | Ideas first. Your trip follows.",
    description: "Travel inspiration, hotel ratings, promotions and live travel news \u2014 planned and booked by a real advisor.",
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <JsonLd data={[travelAgencyJsonLd, websiteJsonLd]} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
