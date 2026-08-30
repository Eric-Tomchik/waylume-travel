/**
 * One destination list for the whole site.
 *
 * The finder on /destinations and the detail page at /destinations/[slug] used to
 * run on two separate datasets, which is why finder cards jumped straight to the
 * contact form while the detail pages sat orphaned. Everything now reads from
 * here: every card in the finder has a real page behind it.
 *
 * No prices anywhere — trips are quoted individually through Fora.
 */

export type Vibe = "Beach & islands" | "Culture & cities" | "Safari & wild" | "Cruise & sea" | "Romance";
export type Season = "Jan–Mar" | "Apr–Jun" | "Jul–Sep" | "Oct–Dec";
export type Region = "Europe" | "Asia" | "Africa" | "Americas" | "Middle East" | "Indian Ocean" | "At sea";

export const VIBES: Vibe[] = ["Beach & islands", "Culture & cities", "Safari & wild", "Cruise & sea", "Romance"];
export const SEASONS: Season[] = ["Jan–Mar", "Apr–Jun", "Jul–Sep", "Oct–Dec"];
export const REGIONS = ["Europe", "Asia", "Africa", "Americas", "Middle East", "Indian Ocean", "At sea"] as const;
export const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export type DestinationHighlight = { title: string; detail: string };

export type Destination = {
  slug: string;
  /** Filename in /public/photos, without the extension. */
  photo: string;
  name: string;
  region: Region;
  /** Shown on the detail page when the filter region is too broad, e.g. "Caribbean". */
  regionLabel?: string;
  tone: "coral" | "lagoon" | "sunset" | "citrus" | "neon" | "indigo";
  vibes: Vibe[];
  seasons: Season[];
  /** Twelve entries, Jan → Dec: 2 = prime, 1 = good, 0 = I'd steer you elsewhere. */
  months: (0 | 1 | 2)[];
  /** Card copy on the finder. */
  blurb: string;
  /** The one line of advisor insight on the card. */
  note: string;
  tagline: string;
  bestFor: string[];
  atmosphere: string;
  culture: string;
  nightlife: string;
  mustDos: DestinationHighlight[];
  stayIdeas: string[];
  tripIdeas: string[];
  /** Why booking this one through an advisor is worth it. */
  advisorNote: string;
  officialGuide?: { label: string; url: string };
};

export const destinations: Destination[] = [
  {
    slug: "puerto-rico",
    photo: "puerto-rico",
    name: "Puerto Rico",
    region: "Americas",
    regionLabel: "Caribbean",
    tone: "coral",
    vibes: ["Beach & islands", "Culture & cities", "Romance"],
    seasons: ["Jan–Mar", "Apr–Jun", "Oct–Dec"],
    months: [2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 2, 2],
    blurb: "Old San Juan mornings, rainforest afternoons and nights that run on their own rhythm.",
    note: "No passport needed and no currency to change — the easiest Caribbean week I book for first-timers.",
    tagline: "Colorful streets, rainforest adventures, beach days, and nights filled with rhythm.",
    bestFor: ["Beach + culture", "Couples", "Food", "Long weekends"],
    atmosphere:
      "Few Caribbean islands let you move this easily between a historic city, a rainforest and a quiet coastline in the same week. You are never choosing only one kind of vacation.",
    culture:
      "Look beyond the resort: Old San Juan's forts and plazas, the murals of Santurce, the bomba and plena traditions of Loíza, and a food scene that runs from roadside lechón to chef-driven tasting rooms.",
    nightlife:
      "San Juan gives you options rather than one strip. La Placita turns from produce market to open-air party as the evening goes on, Condado leans polished, and Old San Juan stays low-key and walkable.",
    mustDos: [
      { title: "Give Old San Juan a full day", detail: "The forts, the blue cobblestones, the galleries and the waterfront deserve more than a cruise-stop hour. Go early, stay for dinner." },
      { title: "Get into El Yunque", detail: "The only tropical rainforest in the US forest system. Reservations are required for the main entrance, which catches a lot of travelers out." },
      { title: "Plan a bio-bay night", detail: "Vieques, Fajardo or La Parguera. The trip is built around the moon calendar — a dark, near-new moon is what makes it extraordinary." },
      { title: "Eat your way down the coast", detail: "The kiosks at Luquillo, criollo cooking inland, and the coffee grown in the central mountains are as much the destination as the beaches." },
    ],
    stayIdeas: ["Old San Juan for historic character", "Condado for beach-and-city convenience", "Isla Verde for an easy resort base", "Vieques or the west coast to slow the second half down"],
    tripIdeas: ["Four nights of San Juan culture and beach", "San Juan plus an El Yunque adventure week", "City stay with a Vieques island extension", "A pre- or post-cruise stay that earns its own days"],
    advisorNote:
      "Puerto Rico rewards knowing which side of the island suits you — and the resorts here sit on preferred programs, so I can often add breakfast, a credit to spend on property, and a room category above the one you paid for.",
    officialGuide: { label: "Discover Puerto Rico", url: "https://www.discoverpuertorico.com/" },
  },
  {
    slug: "cancun-riviera-maya",
    photo: "cancun",
    name: "Cancún & Riviera Maya",
    region: "Americas",
    regionLabel: "Mexico",
    tone: "lagoon",
    vibes: ["Beach & islands", "Romance", "Culture & cities"],
    seasons: ["Jan–Mar", "Apr–Jun", "Oct–Dec"],
    months: [2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 2, 2],
    blurb: "Turquoise water and resort ease, with cenotes and Maya sites a short drive inland.",
    note: "The resort you want in February sells out the previous spring — this is the one to book early.",
    tagline: "Turquoise water, resort ease, cenotes, and a gateway to the Yucatán.",
    bestFor: ["All-inclusive", "Adults-only", "Families", "Groups"],
    atmosphere:
      "Pick your energy: Cancún for activity and nightlife, Playa del Carmen for walkability, or a quieter Riviera Maya resort where the week slows down on purpose.",
    culture:
      "Maya history and Yucatecan cooking give a beach week real depth. Responsibly guided visits, community-run experiences and regional food turn a resort stay into something you remember specifically.",
    nightlife:
      "Cancún's Hotel Zone is the high-energy end. Playa del Carmen layers rooftop bars, live music and restaurants along and just off Quinta Avenida. Tulum's evenings run later and looser.",
    mustDos: [
      { title: "Swim a cenote", detail: "From open swimming holes to genuine cave systems. Which one you choose should match your comfort in water, not the photo you saw." },
      { title: "Add one Maya day", detail: "Chichén Itzá, Tulum, Cobá or a smaller site — chosen on drive time and crowd tolerance rather than fame alone." },
      { title: "Get on the reef", detail: "The second-largest barrier reef in the world is here. Isla Mujeres, Cozumel and the protected coastal parks all offer different versions." },
      { title: "Protect the empty days", detail: "The most common mistake is booking an excursion every morning. Two is usually the right number for a week." },
    ],
    stayIdeas: ["Cancún Hotel Zone for energy", "Playa del Carmen for a walkable base", "Riviera Maya for space and quiet", "Costa Mujeres for the newest resorts"],
    tripIdeas: ["An adults-only all-inclusive reset", "Family resort plus two excursion days", "A Playa del Carmen food-and-beach stay", "Resort week with a Cozumel extension"],
    advisorNote:
      "All-inclusives look interchangeable online and are not. I book these constantly, so I can tell you which properties have aged well, which building to ask for, and where a resort credit or upgrade comes as part of the booking.",
    officialGuide: { label: "Visit Mexico", url: "https://www.visitmexico.com/" },
  },
  {
    slug: "jamaica",
    photo: "jamaica",
    name: "Jamaica",
    region: "Americas",
    regionLabel: "Caribbean",
    tone: "sunset",
    vibes: ["Beach & islands", "Romance"],
    seasons: ["Jan–Mar", "Apr–Jun", "Oct–Dec"],
    months: [2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 2, 2],
    blurb: "Music, waterfalls, bold flavor — and three resort towns with completely different characters.",
    note: "Negril, Ocho Rios and Montego Bay are not interchangeable. Picking wrong is the main way this trip disappoints.",
    tagline: "Music, waterfalls, bold flavor, and resort towns that each have their own rhythm.",
    bestFor: ["All-inclusive", "Couples", "Adults-only", "Music"],
    atmosphere:
      "Jamaica has more personality than a beach week needs, which is exactly why people come back. The island rewards travelers who leave the property at least twice.",
    culture:
      "This is the birthplace of reggae and its whole lineage, and the music is genuinely everywhere. Add a Blue Mountain coffee morning, a jerk-centre lunch and a slow afternoon in a fishing village and you have seen the actual country.",
    nightlife:
      "Negril's Seven Mile Beach runs on sunset bars and live bands. Montego Bay is more resort-driven. Kingston, if you have the nerve for a night there, is where the music scene actually lives.",
    mustDos: [
      { title: "Climb Dunn's River Falls", detail: "Touristy and still worth it — go at opening, before the ship groups reach it." },
      { title: "Take the Blue Mountains slowly", detail: "A coffee-estate morning at altitude is the coolest, greenest part of the island and the antidote to a hot beach week." },
      { title: "Eat jerk where the smoke is", detail: "Boston Bay for the original, or the roadside pans that appear near every resort town after dark." },
      { title: "Get on the water at sunset", detail: "A catamaran or a Black River safari — Jamaica is more dramatic from the water than from a lounger." },
    ],
    stayIdeas: ["Negril for beach and sunsets", "Montego Bay for short transfers", "Ocho Rios for waterfalls and excursions", "The south coast for something genuinely quiet"],
    tripIdeas: ["An adults-only all-inclusive week", "Negril beach stay with two excursion days", "A music-and-food trip built around Kingston", "Multi-generational villa with staff"],
    advisorNote:
      "Airport transfer times vary from twenty minutes to two hours here, and that single detail changes how a week feels. I match the town to the trip you actually want — and most of these resorts carry advisor perks worth having.",
    officialGuide: { label: "Visit Jamaica", url: "https://www.visitjamaica.com/" },
  },
  {
    slug: "orlando",
    photo: "orlando",
    name: "Orlando & Florida",
    region: "Americas",
    regionLabel: "Florida",
    tone: "citrus",
    vibes: ["Culture & cities", "Beach & islands"],
    seasons: ["Jan–Mar", "Apr–Jun", "Oct–Dec"],
    months: [2, 2, 2, 2, 1, 1, 0, 0, 1, 2, 2, 2],
    blurb: "The parks, done in a way that does not flatten everyone — plus a coast an hour away.",
    note: "Park tickets are the easy part. The planning that saves your legs and your patience is the value.",
    tagline: "Theme parks that reward planning, and a Florida coastline most park trips forget.",
    bestFor: ["Families", "Multi-gen", "First trips", "Short breaks"],
    atmosphere:
      "A park trip can be relentless or genuinely relaxing, and the difference is almost entirely structure: which mornings you commit to, which afternoons you protect, and where you sleep.",
    culture:
      "Beyond the gates there is more Florida than people expect — the springs north of the city, Cuban food in Tampa's Ybor City, and the Space Coast, which is worth a day on its own if a launch lines up.",
    nightlife:
      "Mostly early nights on a park trip, by design. When you want an evening out, Winter Park and the downtown dining scene are the grown-up end of Orlando.",
    mustDos: [
      { title: "Build in a rest day", detail: "Two park days on, one off. Families that plan this way finish the week still liking each other." },
      { title: "Book the headline dining early", detail: "The restaurants and experiences that people remember open their windows months ahead and are gone in hours." },
      { title: "Add the coast", detail: "An hour east or ninety minutes west puts you on a beach. Two nights there resets a park week completely." },
      { title: "Consider a spring", detail: "Crystal-clear, seventy-two degrees year round, and the least crowded beautiful thing in central Florida." },
    ],
    stayIdeas: ["On-property for early entry and short walks", "A nearby resort with a serious pool", "A rental home for multi-generational groups", "Split the week with two coastal nights"],
    tripIdeas: ["A first family park trip done properly", "Parks plus a Gulf Coast beach finish", "Multi-gen villa week with one park day each", "A cruise from Port Canaveral with park days on the front"],
    advisorNote:
      "This is the trip where an advisor pays for itself. I hold reservations, watch for price drops after you book, and build the day-by-day so nobody is walking eleven miles on the day they had planned to relax.",
    officialGuide: { label: "Visit Orlando", url: "https://www.visitorlando.com/" },
  },
  {
    slug: "las-vegas",
    photo: "las-vegas",
    name: "Las Vegas",
    region: "Americas",
    tone: "neon",
    vibes: ["Culture & cities", "Romance"],
    seasons: ["Jan–Mar", "Apr–Jun", "Oct–Dec"],
    months: [1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1],
    blurb: "Suites, shows and restaurants — with red-rock desert twenty minutes from the Strip.",
    note: "Resort fees, show seats and dinner reservations are where a Vegas trip is won or lost.",
    tagline: "Suites, shows, restaurants — and a desert most visitors never step into.",
    bestFor: ["Couples", "Groups", "Celebrations", "Long weekends"],
    atmosphere:
      "Vegas rewards a plan and punishes drifting. Decide which two nights matter, book those properly, and let the rest of the trip stay loose.",
    culture:
      "The residencies and touring shows are the obvious draw. Less obvious: the Neon Museum, the Arts District's galleries and breweries, and a dining scene that now stands up on its own terms.",
    nightlife:
      "Everything from a quiet cocktail bar with a view to a club with a queue around the building. The useful question is not which club is best — it's which night of the week you are going.",
    mustDos: [
      { title: "Get out to Red Rock", detail: "Twenty minutes from the Strip and a completely different trip. Go in the morning, be back for lunch." },
      { title: "Book one proper dinner", detail: "One reservation you are genuinely excited about anchors the whole trip. Book it before the flights, not after." },
      { title: "See something live", detail: "A residency, a Cirque show, or the Sphere. Seat location matters more here than in almost any other city." },
      { title: "Take a Hoover Dam or canyon day", detail: "By road or by helicopter — the scale of the landscape is the thing people underestimate." },
    ],
    stayIdeas: ["Center Strip for walkability", "A quieter luxury tower for sleep", "Off-Strip for space and value", "Downtown for a different, older Vegas"],
    tripIdeas: ["A three-night celebration weekend", "Vegas paired with a Grand Canyon overnight", "A spa-and-dining stay with no gambling at all", "A group trip with one big night out"],
    advisorNote:
      "Vegas rates hide fees and the good suites are held back from public inventory. Booking through me usually means a better room category, breakfast or a resort credit, and someone to call when the hotel says it is sold out.",
    officialGuide: { label: "Visit Las Vegas", url: "https://www.visitlasvegas.com/" },
  },
  {
    slug: "amalfi-puglia",
    photo: "italy",
    name: "Amalfi & Puglia",
    region: "Europe",
    regionLabel: "Italy",
    tone: "coral",
    vibes: ["Culture & cities", "Romance", "Beach & islands"],
    seasons: ["Apr–Jun", "Jul–Sep", "Oct–Dec"],
    months: [0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0],
    blurb: "Two coasts, one drive. Lemon groves, cliff villages and masserie with room for long lunches.",
    note: "September now outsells August — same light, half the crowds, better tables.",
    tagline: "Two coastlines, one country, and the case for slowing down between them.",
    bestFor: ["Couples", "Food & wine", "Honeymoons", "Slow travel"],
    atmosphere:
      "The Amalfi Coast is vertical, theatrical and busy; Puglia is flat, agricultural and unhurried. Together they make a trip with contrast instead of two weeks of the same postcard.",
    culture:
      "Puglia is where you find the trulli of Alberobello, baroque Lecce and olive groves older than most European countries. On the Amalfi side, the ceramics of Vietri and the ruins at Pompeii and Herculaneum are within easy reach.",
    nightlife:
      "Evenings here are dinner, and dinner is long. Passeggiata before, limoncello after, and a piazza that fills up around ten. Positano has a handful of late bars; Puglia mostly does not, and does not miss them.",
    mustDos: [
      { title: "Drive — or be driven — the coast road", detail: "The Amalfi Drive is spectacular and genuinely difficult. A private driver turns the most stressful day of the trip into the best one." },
      { title: "Take a boat to Capri early", detail: "Arrive before the day-trip ferries and the island is a different place entirely." },
      { title: "Stay on a masseria", detail: "A working farm estate in Puglia — olive oil, a pool, and dinner from the garden. The reason people extend this leg." },
      { title: "Eat where the region actually eats", detail: "Orecchiette in Bari's old town, seafood in Polignano, buffalo mozzarella that was made that morning." },
    ],
    stayIdeas: ["Positano for the view you pictured", "Ravello for quiet and gardens", "A Puglian masseria for space", "Lecce for baroque streets and easy dinners"],
    tripIdeas: ["Ten days across both coasts", "Amalfi honeymoon with a Capri night", "Puglia food-and-wine week", "Rome opening, Amalfi finish"],
    advisorNote:
      "The good Amalfi hotels and masserie sell out nearly a year ahead, and the difference between a room with the view and one without is the whole trip. I book these on preferred programs — breakfast and an upgrade where they are available.",
    officialGuide: { label: "Italia.it", url: "https://www.italia.it/en" },
  },
  {
    slug: "greek-islands",
    photo: "greece",
    name: "Greek Islands",
    region: "Europe",
    regionLabel: "Greece",
    tone: "lagoon",
    vibes: ["Beach & islands", "Romance", "Cruise & sea"],
    seasons: ["Apr–Jun", "Jul–Sep"],
    months: [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0],
    blurb: "Skip the ferry scrum: a small boat, a few islands, and beaches you reach before anyone else.",
    note: "Book the good villas a season ahead — inventory thins fast after the new year.",
    tagline: "Whitewashed villages, volcanic cliffs, and the islands worth the extra connection.",
    bestFor: ["Couples", "Honeymoons", "Island-hopping", "Sailing"],
    atmosphere:
      "Santorini and Mykonos are famous for good reasons and crowded for the same ones. Pair one with a quieter island and the trip finds its balance.",
    culture:
      "Ancient Akrotiri sits under volcanic ash on Santorini, Delos is an entire abandoned sacred island off Mykonos, and Crete carries Minoan history plus the best food in the Aegean.",
    nightlife:
      "Mykonos runs late and expensive. Santorini is sunset-driven — everyone is looking the same direction at the same hour. Naxos and Paros keep it to tavernas and a bar or two, which many travelers prefer.",
    mustDos: [
      { title: "Watch a caldera sunset without the crush", detail: "Oia is the famous spot and the busiest. There are terraces in Imerovigli with the same view and a seat." },
      { title: "Charter a boat for a day", detail: "The best beaches in the Cyclades have no road to them. This is the single upgrade that changes a Greek week." },
      { title: "Add a quiet island", detail: "Naxos, Paros, Milos or Folegandros next to the headline one. The contrast is the point." },
      { title: "Eat late and by the water", detail: "Nine o'clock is normal. Grilled fish, tomatoes that taste of something, and no rush at all." },
    ],
    stayIdeas: ["A caldera cave suite for the view", "Beachfront on Naxos or Paros", "Crete for a longer, food-led stay", "A small ship or charter instead of hotels"],
    tripIdeas: ["Athens plus two islands in ten days", "Santorini honeymoon with a private sail day", "A family week on Crete", "Small-ship Cyclades cruise"],
    advisorNote:
      "Ferry timings quietly decide whether island-hopping is a pleasure or a logistics job, and the caldera-view suites go early. I sequence the islands and hold the rooms that are actually worth the money.",
    officialGuide: { label: "Visit Greece", url: "https://www.visitgreece.gr/" },
  },
  {
    slug: "japan",
    photo: "japan",
    name: "Japan, beyond Tokyo",
    region: "Asia",
    tone: "indigo",
    vibes: ["Culture & cities", "Romance"],
    seasons: ["Apr–Jun", "Oct–Dec"],
    months: [1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1],
    blurb: "Kyoto in maple season, the Setouchi art islands, and Kyushu ryokans most travelers miss.",
    note: "Cherry blossom and maple weeks need nine to twelve months' notice for the ryokans worth staying in.",
    tagline: "The country past the obvious itinerary — and the seasons worth planning around.",
    bestFor: ["Culture", "Food", "Couples", "First-time Asia"],
    atmosphere:
      "Japan is the easiest complicated country to travel. Trains run to the second, cities are safe at any hour, and a week can hold neon, temples and total silence without feeling rushed.",
    culture:
      "Kyoto's temples and tea houses are the entry point. Further out: the art islands of Naoshima and Teshima, the pilgrimage trails of the Kii Peninsula, and Kanazawa's craft workshops.",
    nightlife:
      "Tokyo's Golden Gai and the Osaka food alleys are the loud version. The quieter one — a six-seat counter bar where the owner pours what suits you — is the one people talk about afterwards.",
    mustDos: [
      { title: "Stay one night in a ryokan", detail: "Tatami, an onsen, and a kaiseki dinner served in your room. One night changes the whole trip's texture." },
      { title: "Ride the shinkansen properly", detail: "Reserved seats, a station bento, and Fuji out of the right-hand window if the weather cooperates." },
      { title: "Eat standing up at least once", detail: "The best value meals in the country come from tiny counters and department-store basements." },
      { title: "Leave the golden route", detail: "Kanazawa, Setouchi or Kyushu are two hours of train from the crowds and a completely different country." },
    ],
    stayIdeas: ["Tokyo for the arrival days", "A Kyoto machiya townhouse", "One ryokan night in Hakone or Kinosaki", "Kanazawa or Naoshima to break the route"],
    tripIdeas: ["Twelve days Tokyo to Kyoto with a ryokan", "Maple-season trip built around Kyoto", "Art islands and Setouchi week", "Japan with a Kyushu onsen finish"],
    advisorNote:
      "The ryokans and small Kyoto properties worth staying in hold very few rooms and rarely appear on the big booking sites. Getting them means booking early through the right channels — that is the part I handle.",
    officialGuide: { label: "Japan National Tourism Organization", url: "https://www.japan.travel/en/" },
  },
  {
    slug: "tanzania-kenya",
    photo: "safari",
    name: "Tanzania & Kenya",
    region: "Africa",
    tone: "sunset",
    vibes: ["Safari & wild"],
    seasons: ["Jan–Mar", "Jul–Sep"],
    months: [2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 1],
    blurb: "Calving season on the southern plains, then the river crossings — with camps that move with the herds.",
    note: "Green-season camps run a fraction of migration rates with the same guides and far fewer vehicles.",
    tagline: "The migration, the camps that follow it, and the months that decide what you see.",
    bestFor: ["Bucket list", "Wildlife", "Photography", "Honeymoons"],
    atmosphere:
      "A safari day has a rhythm you settle into fast: out before dawn, back for a long lunch and a sleep, out again until the light goes. Nobody wants to leave by day three.",
    culture:
      "Maasai and Samburu communities live alongside these conservancies, and the good camps work with them properly rather than staging a visit. Ask for that version — it is a different experience.",
    nightlife:
      "A fire, a drink and more stars than you have seen. Some camps run night drives, which is when the predators are genuinely working.",
    mustDos: [
      { title: "Time the trip to the herds", detail: "Calving in the southern Serengeti January to March; the Mara River crossings July to September. The month is the itinerary." },
      { title: "Stay in a conservancy", detail: "Private conservancies limit vehicle numbers, allow off-road tracking and night drives. Fewer trucks at every sighting." },
      { title: "Fly between camps", detail: "Light aircraft hops replace long, punishing drives and give you an extra game drive each transfer day." },
      { title: "Finish on the coast", detail: "Zanzibar or the Kenyan coast, two flat beach days after a week of early mornings. Almost everyone is glad they added it." },
    ],
    stayIdeas: ["A mobile camp that follows the migration", "A conservancy lodge for off-road access", "Ngorongoro Crater rim for one night", "Zanzibar to finish"],
    tripIdeas: ["Ten-day Serengeti and Ngorongoro circuit", "Kenya's Mara with a conservancy stay", "Safari plus Zanzibar honeymoon", "Green-season photography trip"],
    advisorNote:
      "Safari is the trip where the wrong camp in the right park ruins the week, and the good ones sell out a year ahead. I plan these around the herds and the vehicle rules — and it is the category where advisor relationships genuinely change what you get.",
  },
  {
    slug: "maldives",
    photo: "maldives",
    name: "Maldives",
    region: "Indian Ocean",
    tone: "lagoon",
    vibes: ["Beach & islands", "Romance"],
    seasons: ["Jan–Mar", "Oct–Dec", "Apr–Jun"],
    months: [2, 2, 2, 2, 1, 0, 0, 1, 1, 1, 2, 2],
    blurb: "Atoll by atoll: seaplane versus speedboat, house reefs that deliver, adults-only islands.",
    note: "The transfer decides the day you arrive and the day you leave — it matters more than the villa category.",
    tagline: "One island, one resort — and the details that separate the good ones.",
    bestFor: ["Honeymoons", "Couples", "Diving", "Total switch-off"],
    atmosphere:
      "You choose an island and stay on it. That makes the choice everything: the reef, the food, the transfer and whether children are on the island at all.",
    culture:
      "Most visitors see only the resort. A local-island visit or a Malé stop shows a working Muslim nation with a fishing economy — worth half a day for context.",
    nightlife:
      "Dinner, stars and the sound of water. Some islands run a bar and a DJ; most are deliberately quiet, which is the reason people come.",
    mustDos: [
      { title: "Choose the house reef carefully", detail: "Some islands have world-class snorkelling from the beach; others have almost nothing. This is the question to ask first." },
      { title: "Understand the transfer", detail: "Seaplanes fly in daylight only and can add a night at each end. A speedboat atoll may suit your flights far better." },
      { title: "Swim with the big animals", detail: "Manta season in Baa Atoll, whale sharks in South Ari. Both are seasonal and both are worth planning around." },
      { title: "Book one dinner off the schedule", detail: "A sandbank lunch or a reef-edge dinner. The one thing everyone photographs and nobody regrets." },
    ],
    stayIdeas: ["An overwater villa for the arrival nights", "A beach villa with a pool for the rest", "Adults-only for a honeymoon", "A strong house reef over a famous name"],
    tripIdeas: ["Seven nights split across two villa types", "Honeymoon with a sandbank dinner", "A dive-led trip in Ari Atoll", "Dubai or Colombo stopover on the way"],
    advisorNote:
      "Nearly every resort here has a preferred program — breakfast, a credit, a free night in the right window, sometimes the transfer. Booking direct usually means paying for what I can include.",
  },
  {
    slug: "norway-fjords",
    photo: "cruise",
    name: "Norway & the fjords",
    region: "At sea",
    tone: "indigo",
    vibes: ["Cruise & sea", "Safari & wild"],
    seasons: ["Jul–Sep", "Oct–Dec"],
    months: [1, 1, 1, 0, 1, 2, 2, 2, 2, 1, 1, 1],
    blurb: "Small-ship sailings through the fjords, and the aurora season that follows them.",
    note: "Cabin grade matters more than the ship here — I'll tell you which jumps are worth paying for.",
    tagline: "Deep water, high walls, and two completely different seasons.",
    bestFor: ["Cruise", "Scenery", "Couples", "Photography"],
    atmosphere:
      "Summer gives you light that never quite goes and green walls a kilometre high. Winter gives you dark afternoons, snow to the waterline and the aurora. Both are worth doing; they are not the same trip.",
    culture:
      "Coastal Norway is fishing villages, stave churches and Sami culture in the far north. Bergen's wharf is the obvious stop and still a good one.",
    nightlife:
      "Onboard, quietly. Ashore in summer, the light keeps everyone out far later than they intend.",
    mustDos: [
      { title: "Sail Geiranger or Nærøyfjord", detail: "Two of the narrowest, steepest fjords, both UNESCO-listed. Be on deck for the approach, not at lunch." },
      { title: "Pick the side of the ship", detail: "On a fjord itinerary the view genuinely differs port to starboard. Worth a conversation before you book." },
      { title: "Cross the Arctic Circle", detail: "For the aurora, go north and go in winter. Tromsø and beyond, with time to give clouds a second chance." },
      { title: "Take the Flåm railway", detail: "The steepest standard-gauge line in Europe, an hour of waterfalls, and easy to add to a Bergen leg." },
    ],
    stayIdeas: ["A small ship rather than a large one", "A balcony cabin on the scenic side", "Two nights in Bergen before sailing", "A glass-roofed lodge in the Arctic"],
    tripIdeas: ["Seven-night summer fjord sailing", "Bergen, Flåm and Oslo by rail and water", "Winter aurora voyage from Tromsø", "Fjords with a Copenhagen opening"],
    advisorNote:
      "Cruise fares move constantly and cabins are not equal — on a fjord ship the side you sleep on changes the trip. I watch the price after you book and rebook you if it drops.",
  },
  {
    slug: "iceland",
    photo: "iceland",
    name: "Iceland",
    region: "Europe",
    tone: "indigo",
    vibes: ["Safari & wild", "Romance"],
    seasons: ["Jan–Mar", "Jul–Sep", "Oct–Dec"],
    months: [2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2],
    blurb: "Waterfalls, lava fields and lagoons — northern lights in winter, midnight sun in summer.",
    note: "Two completely different trips depending on the month. Tell me which one you are picturing.",
    tagline: "A country that changes character entirely between summer and winter.",
    bestFor: ["Adventure", "Couples", "Photography", "Short breaks"],
    atmosphere:
      "Nowhere else puts this much landscape within a short drive of an international airport. Three days is a real trip here; ten is a great one.",
    culture:
      "Reykjavík is small, sharp and creative, with a music scene far bigger than the population justifies. The sagas still shape how Icelanders talk about their own landscape.",
    nightlife:
      "Reykjavík's bar run is famously late on weekends. Outside the capital, evenings mean a hot pot under the sky, which is the better version.",
    mustDos: [
      { title: "Drive further than the Golden Circle", detail: "The south coast, the Snæfellsnes peninsula or the full ring road. The crowds thin out within an hour." },
      { title: "Soak somewhere geothermal", detail: "The famous lagoon, or the local pools every town has. The pools are cheaper, warmer and more Icelandic." },
      { title: "Chase the aurora properly", detail: "September to March, away from town, with several nights of margin. One night of hoping is not a plan." },
      { title: "Get on or under the ice", detail: "A glacier walk, an ice cave or a boat among the icebergs at Jökulsárlón." },
    ],
    stayIdeas: ["Reykjavík as a base for short trips", "A south-coast hotel to cut driving", "A remote lodge with dark skies", "A ring-road route with a different bed each night"],
    tripIdeas: ["A four-night winter aurora break", "Ring road in ten summer days", "South coast and glacier long weekend", "Iceland as a stopover between the US and Europe"],
    advisorNote:
      "Weather rewrites Icelandic itineraries constantly, and the good small hotels have very few rooms. I build the route with slack in it and stay reachable if a road closes mid-trip.",
    officialGuide: { label: "Visit Iceland", url: "https://www.visiticeland.com/" },
  },
  {
    slug: "croatia-adriatic",
    photo: "croatia",
    name: "Croatia & the Adriatic",
    region: "Europe",
    tone: "lagoon",
    vibes: ["Beach & islands", "Culture & cities", "Cruise & sea"],
    seasons: ["Apr–Jun", "Jul–Sep"],
    months: [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0],
    blurb: "Walled cities, island-hopping by private boat, and a coastline built for slow evenings.",
    note: "Shoulder months are the sweet spot — warm water, no cruise-ship crush in the old town.",
    tagline: "A coastline of walled cities and a thousand islands between them.",
    bestFor: ["Couples", "Sailing", "History", "Groups"],
    atmosphere:
      "Clear water, stone cities and short hops between islands. It has the ease of Greece with more history within walking distance of the harbour.",
    culture:
      "Diocletian's palace still functions as the centre of Split. Dubrovnik's walls are the postcard. Inland, Istria is truffles, Roman ruins and wine roads that nobody queues for.",
    nightlife:
      "Hvar is the late one. Everywhere else it is a harbour-side dinner that turns into a slow drink and a walk back along the water.",
    mustDos: [
      { title: "Walk Dubrovnik's walls at opening", detail: "First entry, before the heat and the ship crowds. A completely different city at eight in the morning." },
      { title: "Take a private boat day", detail: "The Elaphiti or Pakleni islands — swimming stops you cannot reach on the public ferries." },
      { title: "Give Istria two nights", detail: "Truffles, olive oil, hill towns and Roman Pula. The least touristed good part of the country." },
      { title: "Sleep on at least one island", detail: "Vis, Korčula or Mljet. The evening after the day-trippers leave is the reason to stay." },
    ],
    stayIdeas: ["Dubrovnik old town for two nights", "Split as an island-hopping base", "A Hvar or Korčula island stay", "A skippered yacht instead of hotels"],
    tripIdeas: ["Dubrovnik to Split with two islands", "A week on a skippered charter", "Istria food-and-wine drive", "Croatia paired with Montenegro"],
    advisorNote:
      "Old-town rooms are small, historic and wildly variable, and the ferry schedules shape the whole route. I know which properties are worth their address and how to sequence the islands so you are not chasing boats.",
    officialGuide: { label: "Croatia Tourism", url: "https://croatia.hr/en-GB" },
  },
  {
    slug: "portugal",
    photo: "portugal",
    name: "Portugal",
    region: "Europe",
    tone: "citrus",
    vibes: ["Culture & cities", "Beach & islands"],
    seasons: ["Apr–Jun", "Jul–Sep", "Oct–Dec"],
    months: [1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1],
    blurb: "Lisbon and Porto, the Douro by boat, and the Algarve when everyone else has gone home.",
    note: "The easiest first trip to Europe I book — short flights, big payoff, forgiving weather.",
    tagline: "Two great cities, a wine valley between them, and a coast at the end.",
    bestFor: ["First trips", "Food & wine", "Couples", "Value"],
    atmosphere:
      "Portugal is walkable, affordable and unhurried. It is the trip I recommend to people who want Europe without a demanding itinerary.",
    culture:
      "Fado in Lisbon's Alfama, azulejo tilework everywhere, Porto's port lodges across the river, and Sintra's palaces an hour from the capital.",
    nightlife:
      "Lisbon runs late — Bairro Alto spills into the street and Cais do Sodré carries on afterwards. Porto is calmer and river-facing.",
    mustDos: [
      { title: "Give Sintra a full day", detail: "Palaces in the hills above Lisbon. Go early; the afternoon buses turn it into a queue." },
      { title: "Do the Douro by water", detail: "Terraced vineyards down to the river, tasted from a boat rather than a coach window." },
      { title: "Eat the seafood plainly", detail: "Grilled sardines, percebes, a cataplana on the coast. Portugal does not need to complicate it." },
      { title: "Time the Algarve for shoulder season", detail: "May or late September: warm water, open restaurants, and the beaches back to a reasonable size." },
    ],
    stayIdeas: ["Lisbon for three nights", "A Douro valley wine estate", "Porto by the river", "An Algarve or Comporta finish"],
    tripIdeas: ["Lisbon, Douro and Porto in ten days", "Portugal with an Algarve beach week", "A wine-focused Douro trip", "Lisbon long weekend with Sintra"],
    advisorNote:
      "The wine estates and small city hotels here are family-run and book up quietly. I place people in the neighbourhoods that suit how they actually travel — and add the breakfast and upgrades where the property offers them.",
    officialGuide: { label: "Visit Portugal", url: "https://www.visitportugal.com/en" },
  },
  {
    slug: "thailand",
    photo: "thailand",
    name: "Thailand",
    region: "Asia",
    tone: "citrus",
    vibes: ["Beach & islands", "Culture & cities", "Romance"],
    seasons: ["Jan–Mar", "Oct–Dec"],
    months: [2, 2, 1, 1, 0, 0, 1, 1, 0, 1, 2, 2],
    blurb: "Bangkok's food streets, northern temples, then a long stretch of island time to finish.",
    note: "The two coasts have opposite monsoons — picking the wrong one ruins a beach week.",
    tagline: "A city, a mountain north, and islands on two different weather systems.",
    bestFor: ["Food", "Couples", "Honeymoons", "Value luxury"],
    atmosphere:
      "Thailand does the full range convincingly: street food at midnight, temples at dawn, and a beach week at the end that costs less than you expect.",
    culture:
      "Bangkok's temples and river, Chiang Mai's old city and craft workshops, and an ethical elephant sanctuary — the observation-only kind, not the riding kind.",
    nightlife:
      "Bangkok's rooftops are the civilised version and genuinely spectacular. The islands run from beach bars to full moon chaos depending entirely on which one you pick.",
    mustDos: [
      { title: "Eat from the street, carefully and often", detail: "The best food in the country is on a cart. Busy stalls, high turnover, no hesitation." },
      { title: "Take the river through Bangkok", detail: "The express boat is the fastest and best way to see the city. Traffic makes taxis a mistake." },
      { title: "Go north for a few days", detail: "Chiang Mai and Chiang Rai are cooler, slower and completely different from the south." },
      { title: "Pick your coast by month", detail: "Andaman side November to April; Gulf side — Samui, Phangan — is better mid-year. This one detail decides the trip." },
    ],
    stayIdeas: ["Bangkok riverside for the arrival", "A Chiang Mai old-city hotel", "Krabi or Phuket in high season", "Koh Samui when the west coast is wet"],
    tripIdeas: ["Bangkok, Chiang Mai and an island in two weeks", "An island honeymoon with a Bangkok opening", "A food-led trip north to south", "Thailand with a Singapore stopover"],
    advisorNote:
      "The monsoon question is the one people get wrong on their own, and it is unfixable once booked. I pick the coast for your dates, and the resorts here carry some of the strongest advisor perks anywhere.",
    officialGuide: { label: "Tourism Authority of Thailand", url: "https://www.tourismthailand.org/" },
  },
  {
    slug: "dubai-emirates",
    photo: "dubai",
    name: "Dubai & the Emirates",
    region: "Middle East",
    tone: "sunset",
    vibes: ["Beach & islands", "Culture & cities"],
    seasons: ["Jan–Mar", "Oct–Dec"],
    months: [2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 2],
    blurb: "Beach resorts, desert nights, and a stopover that turns a long-haul into two trips.",
    note: "Best used as a stop on the way somewhere — three or four nights is the sweet spot.",
    tagline: "A beach-and-city break that doubles as the best stopover in long-haul travel.",
    bestFor: ["Stopovers", "Families", "Luxury", "Winter sun"],
    atmosphere:
      "Winter here is faultless: warm sea, blue sky, and hotels operating at a standard that makes the rest of the trip feel ordinary. Summer is genuinely too hot.",
    culture:
      "Old Dubai — the creek, the gold and spice souks, the abra crossing — is the antidote to the towers. Abu Dhabi's Sheikh Zayed Mosque and Louvre are worth the drive; Sharjah is the quiet cultural one.",
    nightlife:
      "Rooftop bars, beach clubs and a brunch culture that is a genuine institution. All hotel-based, all easy to arrange.",
    mustDos: [
      { title: "Spend a night in the desert", detail: "A dune camp an hour out, with the city glow just visible. The part of the trip people describe afterwards." },
      { title: "Cross the creek by abra", detail: "A wooden boat, a coin fare, and the oldest part of the city on the far bank." },
      { title: "See the Sheikh Zayed Mosque", detail: "In Abu Dhabi, an easy day trip, and best in the last hour before sunset." },
      { title: "Use the stopover properly", detail: "Three or four nights turns a punishing long-haul into two holidays with a rest built in." },
    ],
    stayIdeas: ["A Jumeirah or Palm beach resort", "Downtown for the city side", "A desert resort for two nights", "Abu Dhabi for a quieter version"],
    tripIdeas: ["Four-night winter sun break", "Dubai stopover en route to the Maldives or Asia", "A family beach week with a desert night", "Dubai and Abu Dhabi combined"],
    advisorNote:
      "The big beach resorts here compete hard for advisor bookings, which means upgrades, credits and free-night offers are common — often the same rate you would have paid anyway.",
    officialGuide: { label: "Visit Dubai", url: "https://www.visitdubai.com/" },
  },
  {
    slug: "morocco",
    photo: "morocco",
    name: "Morocco",
    region: "Africa",
    tone: "coral",
    vibes: ["Culture & cities", "Safari & wild"],
    seasons: ["Jan–Mar", "Apr–Jun", "Oct–Dec"],
    months: [1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1],
    blurb: "Marrakech riads, the Atlas mountains, and a night in the dunes people talk about for years.",
    note: "Spring and late autumn are the comfortable windows; midsummer inland is brutal.",
    tagline: "Medinas, mountains and desert — a lot of country in a short flight.",
    bestFor: ["Culture", "Couples", "Photography", "Adventure"],
    atmosphere:
      "Morocco is intense in the medina and completely silent in the desert, often on the same day. That contrast is the trip.",
    culture:
      "Fes has the oldest continuously running university in the world and a medina you will get lost in. Berber villages in the Atlas, tanneries, souks and craft workshops still working the old way.",
    nightlife:
      "Rooftop dinners and mint tea rather than bars. Marrakech's Jemaa el-Fnaa transforms after dark into food stalls and performers.",
    mustDos: [
      { title: "Sleep in a riad", detail: "A courtyard house behind an unremarkable door. Cool, quiet, and the reason people fall for Marrakech." },
      { title: "Cross the Atlas to the dunes", detail: "A long drive that becomes the trip: Aït Benhaddou, the gorges, then camels and silence at Erg Chebbi." },
      { title: "Take a guide in Fes", detail: "Nine thousand alleys with no logic to them. A good guide turns bewildering into fascinating." },
      { title: "Finish on the coast", detail: "Essaouira for wind, seafood and a slower few days after the medinas." },
    ],
    stayIdeas: ["A Marrakech riad in the medina", "A Palmeraie resort for a pool", "A luxury desert camp at Erg Chebbi", "Essaouira to wind down"],
    tripIdeas: ["Marrakech, Atlas and desert in ten days", "Imperial cities: Fes, Meknes, Marrakech", "A riad-and-spa long weekend", "Morocco with an Essaouira coastal finish"],
    advisorNote:
      "Morocco runs on ground logistics — the right driver-guide, the right riad, the right order. Assembled well it is seamless; assembled badly it is exhausting. That assembly is the work I do.",
    officialGuide: { label: "Visit Morocco", url: "https://www.visitmorocco.com/en" },
  },
  {
    slug: "alaska",
    photo: "alaska",
    name: "Alaska",
    region: "Americas",
    tone: "indigo",
    vibes: ["Cruise & sea", "Safari & wild"],
    seasons: ["Jul–Sep"],
    months: [0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
    blurb: "Glaciers from the water, bears from a boat, and lodges you reach by float plane.",
    note: "A short season that books early — cruise plus a land lodge is the version worth doing.",
    tagline: "A short summer, enormous scenery, and the case for adding land to a cruise.",
    bestFor: ["Cruise", "Families", "Wildlife", "Multi-gen"],
    atmosphere:
      "Cruising here is scenery-first: glaciers calving off the bow, whales beside the ship, and towns you walk off into. Adding a few land days is what turns it into a real trip.",
    culture:
      "Alaska Native cultures — Tlingit, Haida, Athabascan — have deep roots in the southeast, and the gold-rush history in Skagway is genuinely strange and worth the time.",
    nightlife:
      "Long light and early starts. A brewery in Juneau, a lodge fire, and bed, because the boat leaves at six.",
    mustDos: [
      { title: "Add a land segment", detail: "Denali or a wilderness lodge before or after the sailing. Most people who skip it wish they hadn't." },
      { title: "Get on a small boat", detail: "A day catamaran into a fjord gets closer to glaciers and wildlife than any ship can." },
      { title: "Fly at least once", detail: "A float plane or a glacier landing. The scale of the interior does not read from sea level." },
      { title: "Time it to what you want", detail: "June for light and wildflowers, July and August for bears and salmon, September for fewer people and early aurora." },
    ],
    stayIdeas: ["A balcony cabin for glacier days", "A Denali-area lodge", "A remote fly-in wilderness lodge", "Two nights in Anchorage or Seward"],
    tripIdeas: ["Seven-night Inside Passage sailing", "Cruise with a Denali land extension", "A rail-and-lodge trip without a ship", "Multi-gen family cruise in July"],
    advisorNote:
      "The season is short and the good lodges and cabin categories sell out early. I book cruise and land as one trip, watch the fare afterwards, and rebook you if it drops.",
    officialGuide: { label: "Travel Alaska", url: "https://www.travelalaska.com/" },
  },
];

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

/** Best months as a short label, e.g. "Jan–Apr, Nov–Dec". */
export function bestMonths(months: (0 | 1 | 2)[]) {
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ranges: string[] = [];
  let start: number | null = null;
  months.forEach((value, index) => {
    if (value === 2 && start === null) start = index;
    if (value !== 2 && start !== null) {
      ranges.push(start === index - 1 ? names[start] : `${names[start]}–${names[index - 1]}`);
      start = null;
    }
  });
  if (start !== null) {
    ranges.push(start === 11 ? names[11] : `${names[start]}–${names[11]}`);
  }
  return ranges.length ? ranges.join(", ") : "Ask me — it depends on the year";
}
