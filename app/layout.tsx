import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waylume Travel | Personalized Travel Planning",
  description:
    "Discover flights, resorts, cruises, and vacation ideas with personalized support from Waylume Travel, an Independent Agent of Archer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
