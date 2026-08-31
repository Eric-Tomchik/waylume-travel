import { HOST_AGENCY } from "@/lib/hostAgency";

/**
 * Single source of truth for the canonical origin. The apex domain redirects to
 * www (see middleware.ts), so every canonical URL and every sitemap entry must
 * agree on this host or the two copies compete with each other in search.
 */
export const SITE_ORIGIN = "https://www.waylumetravel.com";

/** Canonical URL for a route, e.g. canonical("/stays"). */
export function canonical(path = "/") {
  const clean = path === "/" ? "" : `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  return `${SITE_ORIGIN}${clean}` || SITE_ORIGIN;
}

/** Metadata fragment every page spreads in so canonicals are never forgotten. */
export function canonicalMetadata(path = "/") {
  return { alternates: { canonical: canonical(path) } };
}

export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Waylume Travel — ideas first, your trip follows.",
};

const ADVISOR_NAME = "Eric Tomchik";

/**
 * The advisory itself. TravelAgency is the closest schema.org type for an
 * independent advisor working under a host agency, and `parentOrganization`
 * states the Fora relationship in machine-readable form.
 */
export const travelAgencyJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${SITE_ORIGIN}/#organization`,
  name: "Waylume Travel",
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/waylume-logo-full.png`,
  image: `${SITE_ORIGIN}${OG_IMAGE.url}`,
  description:
    "Independent travel advisory offering destination guidance, hotel and cruise planning, and booked itineraries.",
  slogan: "Ideas first. Your trip follows.",
  areaServed: "Worldwide",
  parentOrganization: { "@type": "Organization", name: HOST_AGENCY.name },
  disambiguatingDescription: HOST_AGENCY.disclosure,
  founder: {
    "@type": "Person",
    "@id": `${SITE_ORIGIN}/#advisor`,
    name: ADVISOR_NAME,
    jobTitle: "Independent Travel Advisor",
    worksFor: { "@type": "Organization", name: HOST_AGENCY.name },
    image: `${SITE_ORIGIN}/eric-tomchik.webp`,
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  url: SITE_ORIGIN,
  name: "Waylume Travel",
  publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  inLanguage: "en-US",
};

/** Breadcrumbs: pass [["Destinations", "/destinations"], ["Japan", "/destinations/japan"]]. */
export function breadcrumbJsonLd(trail: Array<[string, string]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...trail].map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry[0],
      item: canonical(entry[1]),
    })),
  };
}

export function articleJsonLd(article: { title: string; excerpt: string; slug: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: canonical(`/journal/${article.slug}`),
    image: article.image ? `${SITE_ORIGIN}${article.image}` : `${SITE_ORIGIN}${OG_IMAGE.url}`,
    author: { "@id": `${SITE_ORIGIN}/#advisor` },
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    isAccessibleForFree: true,
  };
}

export function touristDestinationJsonLd(destination: { name: string; tagline: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.tagline,
    url: canonical(`/destinations/${destination.slug}`),
    touristType: "Leisure travellers",
    includesAttraction: undefined,
  };
}
