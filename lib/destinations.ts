export type Destination = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  bestFor: string[];
};

export const destinations: Destination[] = [
  {
    slug: "puerto-rico",
    name: "Puerto Rico",
    region: "Caribbean",
    tagline: "Beaches, culture, nightlife, and easy island escapes.",
    description: "A flexible Caribbean option for couples, families, food lovers, beach travelers, and quick getaways.",
    bestFor: ["Beach", "Culture", "Couples", "Weekend escapes"],
  },
  {
    slug: "cancun-riviera-maya",
    name: "Cancún & Riviera Maya",
    region: "Mexico",
    tagline: "All-inclusive resorts with effortless vacation energy.",
    description: "Ideal for travelers who want resort convenience, turquoise water, excursions, and a wide range of budget levels.",
    bestFor: ["All-inclusive", "Families", "Adults-only", "Groups"],
  },
  {
    slug: "jamaica",
    name: "Jamaica",
    region: "Caribbean",
    tagline: "Relaxed island style with iconic resort destinations.",
    description: "Pair beaches and resorts with waterfalls, local culture, music, and memorable excursions.",
    bestFor: ["Couples", "All-inclusive", "Honeymoons", "Adventure"],
  },
  {
    slug: "orlando",
    name: "Orlando",
    region: "Florida",
    tagline: "Big family vacations built around unforgettable attractions.",
    description: "A practical starting point for theme-park vacations, family resorts, cruises from nearby ports, and multi-generational trips.",
    bestFor: ["Families", "Theme parks", "Groups", "Pre-cruise stays"],
  },
  {
    slug: "las-vegas",
    name: "Las Vegas",
    region: "Nevada",
    tagline: "Entertainment, dining, resorts, and celebration trips.",
    description: "A highly customizable destination for short escapes, events, nightlife, dining, shows, and premium resort stays.",
    bestFor: ["Couples", "Groups", "Entertainment", "Short trips"],
  },
  {
    slug: "europe",
    name: "Europe",
    region: "International",
    tagline: "Build a custom city, rail, cruise, or multi-country journey.",
    description: "From a single-city stay to a multi-stop itinerary, Europe is ideal for travelers who want a more tailored planning process.",
    bestFor: ["Custom trips", "Culture", "Cruises", "Multi-city"],
  },
];
