export type JournalSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type JournalArticle = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  destination?: string;
  color: string;
  sections: JournalSection[];
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "choose-your-vacation-style",
    category: "Planning guide",
    title: "Vacation package, resort, cruise, or custom trip? Start with the experience.",
    excerpt: "A practical way to choose the trip structure that fits your pace, priorities, and planning comfort.",
    readTime: "6 min read",
    color: "lagoon",
    sections: [
      {
        heading: "Begin with how you want the trip to feel",
        paragraphs: ["The right format is not always the one with the longest list of inclusions. Start by deciding whether you want ease, variety, independence, entertainment, cultural depth, or a reliable home base. That answer usually makes the structure much clearer."],
        bullets: ["Choose a resort when the property and downtime are central to the vacation.", "Choose a cruise when you want built-in entertainment and multiple places without repeated packing.", "Choose a package when coordinated flights, transfers, and lodging would simplify the trip.", "Choose a custom itinerary when the route, neighborhoods, and experiences matter more than a bundled format."],
      },
      {
        heading: "Think about decision load",
        paragraphs: ["Some travelers enjoy comparing every neighborhood and transfer. Others want a smaller set of advisor-researched choices. Be honest about how many decisions you want before and during the trip; the best plan should reduce friction, not create a second job."],
      },
      {
        heading: "Let Waylume compare the directions",
        paragraphs: ["Use Waylume AI to describe your travelers, dates, origin, pace, interests, and budget guidance. The AI can organize the possibilities without inventing pricing. When the direction feels right, a Waylume advisor researches current supplier options and terms."],
      },
    ],
  },
  {
    slug: "puerto-rico-beyond-the-beach",
    category: "Destination story",
    title: "Puerto Rico beyond the beach: culture by day, rhythm after dark.",
    excerpt: "How to combine Old San Juan, food, rainforest scenery, music, and a beach-city stay in one coherent trip.",
    readTime: "7 min read",
    destination: "Puerto Rico",
    color: "coral",
    sections: [
      {
        heading: "Build the trip in layers",
        paragraphs: ["A strong Puerto Rico itinerary does not have to choose between city and island. Use San Juan as a base for historic streets, restaurants, museums, and nightlife, then add the eastern rainforest, a bio-bay experience, or a slower coastal extension."],
      },
      {
        heading: "Give culture its own time",
        paragraphs: ["Old San Juan is more rewarding when it is not squeezed between airport transfers. Santurce, Loíza, local artisan traditions, music, and regional food help reveal an island with many identities."],
        bullets: ["Start early in Old San Juan and stay into the evening.", "Choose at least one locally guided cultural or food experience.", "Plan a music or dance night based on the atmosphere you actually enjoy.", "Balance a structured excursion with an unscheduled beach or neighborhood afternoon."],
      },
      {
        heading: "Choose the right base",
        paragraphs: ["Condado, Old San Juan, Isla Verde, the east coast, Vieques, and the west coast each change the trip. The best choice depends on whether you value walkability, resort amenities, beach access, nightlife, or a quieter pace."],
      },
    ],
  },
  {
    slug: "first-cruise-planning-guide",
    category: "Cruise guide",
    title: "Your first cruise should fit you—not just the itinerary map.",
    excerpt: "Ship atmosphere, cabin location, port rhythm, and pre-cruise planning matter as much as the destination list.",
    readTime: "8 min read",
    color: "indigo",
    sections: [
      {
        heading: "Start with the ship experience",
        paragraphs: ["Two cruises visiting similar ports can feel completely different. Consider the ship's size, dining style, entertainment, family mix, nightlife, dress expectations, and how much quiet space you want."],
      },
      {
        heading: "Read the itinerary as a rhythm",
        paragraphs: ["Count sea days, early arrivals, late departures, tender ports, and consecutive port days. A busy itinerary can be exciting, but it can also create an early-morning pace that surprises first-time cruisers."],
        bullets: ["Arrive near the embarkation port at least one night early when practical.", "Choose a cabin based on motion sensitivity, noise, mobility, and how you will use the room.", "Separate must-do excursions from ports you are comfortable exploring more casually.", "Budget for the full trip, including transfers, gratuities, beverages, dining, Wi-Fi, excursions, and a pre-cruise stay."],
      },
      {
        heading: "Use an advisor for the details that vary",
        paragraphs: ["Sailings, promotions, inclusions, cabin inventory, deposit terms, and cancellation conditions change. Waylume can help you define the right cruise direction, then research current supplier choices before anything is presented as bookable."],
      },
    ],
  },
  {
    slug: "plan-a-better-city-break",
    category: "Experience guide",
    title: "Plan a city break around neighborhoods, culture, and the night—not a checklist.",
    excerpt: "A more human way to combine must-sees with local food, evening energy, and room to wander.",
    readTime: "5 min read",
    color: "neon",
    sections: [
      {
        heading: "Let the neighborhood lead",
        paragraphs: ["Hotel location affects morning coffee, late-night transportation, noise, and how often you return to the room. Choose the base around the hours you care about most—not only a landmark on a map."],
      },
      {
        heading: "Use anchors, not a minute-by-minute schedule",
        paragraphs: ["Reserve one major experience per half-day, then cluster food, shops, parks, and smaller sights nearby. This creates a plan with direction while leaving space for the city to surprise you."],
        bullets: ["One cultural anchor: museum, performance, architecture, or guided history.", "One food anchor: market, neighborhood tour, or destination restaurant.", "One evening anchor: live music, theater, sunset view, or nightlife district.", "One open block with no reservation at all."],
      },
      {
        heading: "Plan the return trip before the late night",
        paragraphs: ["Confirm venue policies, transportation options, neighborhood fit, and the trip back to the hotel before you go out. The best nightlife plan feels effortless because the logistics were considered earlier."],
      },
    ],
  },
];

export function getJournalArticle(slug: string) {
  return journalArticles.find((article) => article.slug === slug);
}
