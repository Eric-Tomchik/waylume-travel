export type DestinationHighlight = {
  title: string;
  detail: string;
};

export type Destination = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  bestFor: string[];
  color: string;
  atmosphere: string;
  culture: string;
  nightlife: string;
  mustDos: DestinationHighlight[];
  stayIdeas: string[];
  tripIdeas: string[];
  officialGuide?: { label: string; url: string };
};

export const destinations: Destination[] = [
  {
    slug: "puerto-rico",
    name: "Puerto Rico",
    region: "Caribbean",
    tagline: "Colorful streets, rainforest adventures, beach days, and nights filled with rhythm.",
    description: "Puerto Rico can move easily between historic city energy, relaxed coastlines, rainforest scenery, food, music, and memorable after-dark experiences.",
    bestFor: ["Beach + culture", "Couples", "Food", "Long weekends"],
    color: "coral",
    atmosphere: "Old San Juan mornings, coastal afternoons, and energetic evenings make it easy to build a trip with variety instead of choosing only one vacation style.",
    culture: "Look beyond the resort through Old San Juan, Santurce, Loíza, local food traditions, artisan work, and the island's deep musical identity—from bomba and plena to salsa and reggaetón.",
    nightlife: "San Juan offers a mix of polished lounges, live music, dance floors, and casual neighborhood energy. La Placita is one well-known starting point, while Condado and Old San Juan create different evening moods.",
    mustDos: [
      { title: "Walk Old San Juan", detail: "Set aside time for the forts, plazas, colorful streets, galleries, cafés, and waterfront views instead of treating the district as a quick photo stop." },
      { title: "Experience El Yunque", detail: "Pair a rainforest day with the island's eastern beaches or a slower food-focused afternoon." },
      { title: "Plan a bio-bay evening", detail: "A guided bioluminescent-bay experience can become the centerpiece of an east-coast, Vieques, or southwest itinerary." },
      { title: "Taste beyond the hotel", detail: "Build in local bakeries, coffee, criollo cooking, kiosks, and chef-driven dining so food becomes part of the destination story." },
    ],
    stayIdeas: ["Old San Juan for historic character", "Condado for beach-city convenience", "Isla Verde for an easy resort-style base", "Vieques or the west coast for a slower extension"],
    tripIdeas: ["4-night San Juan culture + beach escape", "San Juan and El Yunque adventure week", "City stay plus Vieques island extension", "Pre- or post-cruise Puerto Rico stay"],
    officialGuide: { label: "Discover Puerto Rico", url: "https://www.discoverpuertorico.com/" },
  },
  {
    slug: "cancun-riviera-maya",
    name: "Cancún & Riviera Maya",
    region: "Mexico",
    tagline: "Turquoise water, resort ease, cenotes, and a gateway to the Yucatán.",
    description: "This region can be a pure all-inclusive retreat or a more layered vacation combining beach time with nature, archaeology, local flavor, and lively evenings.",
    bestFor: ["All-inclusive", "Adults-only", "Families", "Groups"],
    color: "lagoon",
    atmosphere: "Choose the energy that fits: Cancún for activity and nightlife, Playa del Carmen for walkability, or a quieter Riviera Maya resort for a slower reset.",
    culture: "Maya history and Yucatecan traditions add real depth to a resort stay. Responsible guided visits, local communities, regional cooking, and archaeological sites can turn a beach trip into something richer.",
    nightlife: "Cancún's Hotel Zone is the high-energy choice, while Playa del Carmen layers restaurants, music, rooftop venues, and pedestrian-friendly evening options along and beyond Quinta Avenida.",
    mustDos: [
      { title: "Swim or explore a cenote", detail: "Choose a guided experience that matches your comfort level, from relaxed open-water cenotes to more adventurous cave settings." },
      { title: "Add a Maya heritage day", detail: "Consider Chichén Itzá, Tulum, Cobá, or a smaller site based on distance, crowd tolerance, and the rest of your itinerary." },
      { title: "Make time for the reef", detail: "Snorkeling and marine excursions can be paired with Isla Mujeres, Cozumel, or protected coastal areas." },
      { title: "Leave room for resort time", detail: "Avoid scheduling every day. The region works best when excursions and genuine downtime are balanced." },
    ],
    stayIdeas: ["Cancún Hotel Zone for energy", "Playa del Carmen for a walkable base", "Riviera Maya for spacious resorts", "Costa Mujeres for a quieter resort direction"],
    tripIdeas: ["Adults-only all-inclusive reset", "Family resort + two excursion days", "Playa del Carmen food and beach stay", "Resort stay with a Cozumel extension"],
    officialGuide: { label: "Visit Mexico", url: "https://visitmexico.com/" },
  },
  {
    slug: "jamaica",
    name: "Jamaica",
    region: "Caribbean",
    tagline: "Music, waterfalls, bold flavor, and distinct resort towns with their own rhythm.",
    description: "Jamaica rewards travelers who pair a comfortable resort base with the island's music, cuisine, communities, rivers, mountains, and unmistakable sense of place.",
    bestFor: ["Couples", "All-inclusive", "Music", "Adventure"],
    color: "sunset",
    atmosphere: "Montego Bay, Negril, Ocho Rios, the South Coast, Port Antonio, and Kingston each create a different trip; choosing the right base matters as much as choosing the resort.",
    culture: "Reggae, dancehall, Maroon heritage, food, craft, and community experiences belong in the plan—not just in the background. Kingston is especially rewarding for travelers who want a deeper cultural layer.",
    nightlife: "Evenings range from resort entertainment to live music, street parties, lounges, and energetic venues in Kingston and Montego Bay. The right choice depends on whether you want local immersion or everything close to the resort.",
    mustDos: [
      { title: "Choose the right coast", detail: "Negril sunsets, Ocho Rios adventure, Port Antonio scenery, Kingston culture, and the South Coast's slower feel produce very different vacations." },
      { title: "Find a river or waterfall", detail: "Build a guided freshwater experience into the trip and match the level of activity to your group." },
      { title: "Follow the music", detail: "A museum, live performance, sound-system experience, or festival can connect the vacation to Jamaica's global musical influence." },
      { title: "Eat with curiosity", detail: "Jerk, patties, seafood, fruit, and regional specialties are best explored beyond a single resort buffet." },
    ],
    stayIdeas: ["Montego Bay for convenience and variety", "Negril for beaches and sunsets", "Ocho Rios for active excursions", "Kingston for music, food, and culture"],
    tripIdeas: ["Romantic all-inclusive week", "Negril beach stay + Kingston culture", "Family resort + waterfall adventures", "South Coast slow-travel escape"],
    officialGuide: { label: "Visit Jamaica", url: "https://www.visitjamaica.com/" },
  },
  {
    slug: "orlando",
    name: "Orlando",
    region: "Florida",
    tagline: "Big-ticket attractions with room for resorts, food, nature, and pre-cruise stays.",
    description: "Orlando is more flexible than a theme-park checklist. The strongest trips balance priority attractions with recovery time, resort amenities, and a few experiences beyond the gates.",
    bestFor: ["Families", "Theme parks", "Groups", "Pre-cruise stays"],
    color: "citrus",
    atmosphere: "The destination works best when the hotel location, transportation plan, park priorities, and rest days are designed together rather than booked as separate pieces.",
    culture: "Neighborhoods such as Mills 50, Winter Park, and downtown add food, art, gardens, and local character to a trip often defined only by major attractions.",
    nightlife: "Choose between family-friendly evening entertainment, restaurant districts, live shows, resort lounges, and adult-oriented venues. Disney Springs, Universal CityWalk, and downtown each feel different.",
    mustDos: [
      { title: "Set attraction priorities", detail: "Decide which parks and signature experiences matter most before choosing tickets, trip length, and lodging." },
      { title: "Protect a slower day", detail: "A pool, spa, shopping, or neighborhood day can make an attraction-heavy itinerary feel like a vacation again." },
      { title: "Plan transportation early", detail: "On-site benefits, rideshare costs, parking, and transfer time can materially change the best hotel choice." },
      { title: "Consider the coast", detail: "Orlando can pair naturally with Port Canaveral cruises, the Space Coast, or a beach extension." },
    ],
    stayIdeas: ["On-site resort for attraction convenience", "Villa for larger families", "Lake Buena Vista for a broad hotel mix", "Pre-cruise hotel with transfer planning"],
    tripIdeas: ["Theme-park first visit", "Multi-generational villa vacation", "Orlando + Port Canaveral cruise", "Resort weekend with one major attraction day"],
    officialGuide: { label: "Visit Orlando", url: "https://www.visitorlando.com/" },
  },
  {
    slug: "las-vegas",
    name: "Las Vegas",
    region: "Nevada",
    tagline: "Entertainment, design-forward resorts, standout dining, and more culture than the Strip suggests.",
    description: "Las Vegas is highly customizable: celebration weekend, food trip, pool retreat, show-focused escape, desert adventure, or a mix that moves beyond the casino floor.",
    bestFor: ["Entertainment", "Food", "Nightlife", "Short trips"],
    color: "neon",
    atmosphere: "The Strip delivers scale and spectacle; Downtown adds history and a more compact energy; the Arts District brings galleries, murals, independent businesses, and an increasingly creative food scene.",
    culture: "Add museums, architecture, public art, the Downtown Arts District, performance venues, and nearby desert landscapes to see a wider version of Las Vegas.",
    nightlife: "Options run from world-scale clubs and dayclubs to cocktail lounges, live music, Fremont East, rooftop views, and quieter late-night dining. Build around your preferred pace and dress expectations.",
    mustDos: [
      { title: "Choose one signature show", detail: "Let a major performance anchor the itinerary, then plan dinner and transportation around its location and start time." },
      { title: "Explore Downtown", detail: "Pair Fremont Street with the surrounding historic core, restaurants, museums, or a more curated Fremont East evening." },
      { title: "Visit the Arts District", detail: "Make room for murals, galleries, vintage shopping, breweries, and independent dining beyond the resort corridor." },
      { title: "Add a desert contrast", detail: "A guided or self-directed day beyond the city can reset the pace and create a dramatically different memory." },
    ],
    stayIdeas: ["Central Strip for first-time convenience", "Luxury resort for a stay-centered escape", "Downtown for compact energy", "Off-Strip for a quieter value direction"],
    tripIdeas: ["3-night show and dining weekend", "Luxury pool + spa escape", "Vegas and desert adventure", "Sports or concert celebration trip"],
    officialGuide: { label: "Visit Las Vegas", url: "https://www.visitlasvegas.com/" },
  },
  {
    slug: "europe",
    name: "Europe",
    region: "Multi-country journeys",
    tagline: "City breaks, rail connections, cultural depth, cruises, and custom multi-stop stories.",
    description: "A Europe trip becomes easier when it is built around a clear rhythm: fewer bases, logical transportation, meaningful neighborhood choices, and enough time to experience each place.",
    bestFor: ["Culture", "Custom trips", "Rail", "Cruises"],
    color: "indigo",
    atmosphere: "Start with the feeling you want—grand capitals, Mediterranean coast, small towns, food regions, art, history, or scenic rail—then choose destinations that form a coherent route.",
    culture: "Museums and monuments matter, but markets, cafés, neighborhoods, local guides, performances, and regional food often create the moments travelers remember most.",
    nightlife: "European evenings vary widely by city and season, from late dinners and wine bars to live music, theater, waterfront promenades, and major club scenes. Neighborhood choice shapes the experience.",
    mustDos: [
      { title: "Choose a trip theme", detail: "Architecture, food, ancestry, coastlines, rail, art, or a celebration can help narrow an overwhelming list of places." },
      { title: "Limit unnecessary moves", detail: "Fewer hotel changes usually create more time for neighborhoods, day trips, and spontaneous discoveries." },
      { title: "Mix icons with local time", detail: "Reserve major sights when needed, then leave unscheduled space for markets, cafés, parks, and streets." },
      { title: "Match transport to the route", detail: "Rail, short flights, ferries, private transfers, and cruises each work well in different geographic patterns." },
    ],
    stayIdeas: ["One-city deep dive", "Two-city rail pairing", "Mediterranean cruise + land stay", "Countryside or island extension"],
    tripIdeas: ["London + Paris first visit", "Italy by rail", "Mediterranean cruise with two land nights", "Central Europe culture route"],
    officialGuide: { label: "Visit Europe", url: "https://visiteurope.com/" },
  },
];

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}
