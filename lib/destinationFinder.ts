/** Destination data behind the interactive finder. No prices — trips are quoted individually. */

export type Destination = {
  slot: string;
  name: string;
  region: "Europe" | "Asia" | "Africa" | "Americas" | "Middle East" | "Indian Ocean" | "At sea";
  vibes: Vibe[];
  seasons: Season[];
  /** Twelve entries, Jan → Dec: 2 = prime, 1 = good, 0 = I'd steer you elsewhere. */
  months: (0 | 1 | 2)[];
  blurb: string;
  note: string;
};

export type Vibe = "Beach & islands" | "Culture & cities" | "Safari & wild" | "Cruise & sea" | "Romance";
export type Season = "Jan–Mar" | "Apr–Jun" | "Jul–Sep" | "Oct–Dec";

export const VIBES: Vibe[] = ["Beach & islands", "Culture & cities", "Safari & wild", "Cruise & sea", "Romance"];
export const SEASONS: Season[] = ["Jan–Mar", "Apr–Jun", "Jul–Sep", "Oct–Dec"];
export const REGIONS = ["Europe", "Asia", "Africa", "Americas", "Middle East", "Indian Ocean", "At sea"] as const;

export const DESTINATIONS: Destination[] = [
  {
    slot: "italy", name: "Amalfi & Puglia", region: "Europe",
    vibes: ["Culture & cities", "Romance", "Beach & islands"], seasons: ["Apr–Jun", "Jul–Sep", "Oct–Dec"],
    months: [0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0],
    blurb: "Two coasts, one drive. Lemon groves, cliff villages and masserie with space for long lunches.",
    note: "September now outsells August — same light, half the crowds, better tables.",
  },
  {
    slot: "greece", name: "Greek Islands", region: "Europe",
    vibes: ["Beach & islands", "Romance", "Cruise & sea"], seasons: ["Apr–Jun", "Jul–Sep"],
    months: [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0],
    blurb: "Skip the ferry scrum: a small yacht, five islands, and beaches you reach before anyone else.",
    note: "Book the good villas a season ahead — inventory thins fast after the new year.",
  },
  {
    slot: "japan", name: "Japan, beyond Tokyo", region: "Asia",
    vibes: ["Culture & cities", "Romance"], seasons: ["Apr–Jun", "Oct–Dec"],
    months: [1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1],
    blurb: "Kyoto in maple season, the Setouchi art islands and Kyushu ryokans most travelers miss.",
    note: "Cherry blossom and maple weeks need nine to twelve months' notice for the ryokans worth it.",
  },
  {
    slot: "safari", name: "Tanzania & Kenya", region: "Africa",
    vibes: ["Safari & wild"], seasons: ["Jan–Mar", "Jul–Sep"],
    months: [2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 1],
    blurb: "Calving season on the southern plains, then the river crossings — with camps that move with the herds.",
    note: "Green-season camps run a fraction of migration pricing with the same guides.",
  },
  {
    slot: "maldives", name: "Maldives", region: "Indian Ocean",
    vibes: ["Beach & islands", "Romance"], seasons: ["Jan–Mar", "Oct–Dec", "Apr–Jun"],
    months: [2, 2, 2, 2, 1, 0, 0, 1, 1, 1, 2, 2],
    blurb: "Atoll by atoll: seaplane versus speedboat, house reefs that actually deliver, adults-only islands.",
    note: "Bulgari's first island resort lands in Raa Atoll in 2027 — waitlists are open now.",
  },
  {
    slot: "cruise", name: "Norway & the fjords", region: "At sea",
    vibes: ["Cruise & sea", "Safari & wild"], seasons: ["Jul–Sep", "Oct–Dec"],
    months: [1, 1, 1, 0, 1, 2, 2, 2, 2, 1, 1, 1],
    blurb: "Small-ship sailings through the fjords, and the aurora season that follows them.",
    note: "Cabin grade matters more than the ship here — I'll tell you which jumps are worth it.",
  },
  {
    slot: "iceland", name: "Iceland", region: "Europe",
    vibes: ["Safari & wild", "Romance"], seasons: ["Jan–Mar", "Jul–Sep", "Oct–Dec"],
    months: [2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2],
    blurb: "Waterfalls, lava fields and lagoons — northern lights in winter, midnight sun in summer.",
    note: "Two very different trips depending on the month. Tell me which one you're picturing.",
  },
  {
    slot: "croatia", name: "Croatia & the Adriatic", region: "Europe",
    vibes: ["Beach & islands", "Culture & cities", "Cruise & sea"], seasons: ["Apr–Jun", "Jul–Sep"],
    months: [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0],
    blurb: "Walled cities, island-hopping by private boat, and a coastline built for slow evenings.",
    note: "Shoulder months are the sweet spot — warm water, no cruise-ship crush in the old town.",
  },
  {
    slot: "portugal", name: "Portugal", region: "Europe",
    vibes: ["Culture & cities", "Beach & islands"], seasons: ["Apr–Jun", "Jul–Sep", "Oct–Dec"],
    months: [1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1],
    blurb: "Lisbon and Porto, the Douro by boat, and the Algarve when everyone else has gone home.",
    note: "The easiest first trip to Europe I book — short flights, big payoff, forgiving weather.",
  },
  {
    slot: "thailand", name: "Thailand", region: "Asia",
    vibes: ["Beach & islands", "Culture & cities", "Romance"], seasons: ["Jan–Mar", "Oct–Dec"],
    months: [2, 2, 1, 1, 0, 0, 1, 1, 0, 1, 2, 2],
    blurb: "Bangkok's food streets, northern temples, then a long stretch of island time to finish.",
    note: "The two coasts have opposite monsoons — picking the wrong one ruins a beach week.",
  },
  {
    slot: "dubai", name: "Dubai & the Emirates", region: "Middle East",
    vibes: ["Beach & islands", "Culture & cities"], seasons: ["Jan–Mar", "Oct–Dec"],
    months: [2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 2],
    blurb: "Beach resorts, desert nights and a stopover that turns a long-haul into two trips.",
    note: "Six Senses opened on The Palm in September 2026 — an all-suite beachfront debut.",
  },
  {
    slot: "morocco", name: "Morocco", region: "Africa",
    vibes: ["Culture & cities", "Safari & wild"], seasons: ["Jan–Mar", "Apr–Jun", "Oct–Dec"],
    months: [1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1],
    blurb: "Marrakech riads, the Atlas mountains and a night in the dunes that people talk about for years.",
    note: "Spring and late autumn are the comfortable windows; midsummer inland is brutal.",
  },
  {
    slot: "alaska", name: "Alaska", region: "Americas",
    vibes: ["Cruise & sea", "Safari & wild"], seasons: ["Jul–Sep"],
    months: [0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
    blurb: "Glaciers from the water, bears from a boat, and lodges you reach by float plane.",
    note: "A short season that books early — cruise plus a land lodge is the version worth doing.",
  },
];

export const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
