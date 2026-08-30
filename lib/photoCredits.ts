/** Attribution for every photograph on the site, as the CC licenses require. */
export type PhotoCredit = {
  slot: string;
  title: string;
  creator: string;
  source: string;
  license: string;
  licenseUrl: string;
};

export const PHOTO_CREDITS: PhotoCredit[] = [
  { slot: "hero", title: "Infinity Pool", creator: "Studio Sarah Lou", source: "https://www.flickr.com/photos/86665756@N00/5047591825", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
  { slot: "maldives", title: "meeru overwater villas", creator: "Simon_sees", source: "https://www.flickr.com/photos/39551170@N02/18671196972", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
  { slot: "italy", title: "Lightning over Positano, Amalfi Coast, Italy", creator: "Eric Hossinger", source: "https://www.flickr.com/photos/44717021@N06/6188207412", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
  { slot: "japan", title: "DP1M0700", creator: "bethom33", source: "https://www.flickr.com/photos/92475647@N05/31371422395", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
  { slot: "safari", title: "Elephants - Serengeti National Park safari - Tanzania, Africa", creator: "David Berkowitz", source: "https://www.flickr.com/photos/25897810@N00/5699832418", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
  { slot: "cruise", title: "Geirangerfjord; Hurtigruten Coastal Voyage North - Day Two (363)", creator: "Prof. Mortel", source: "https://www.flickr.com/photos/43714545@N06/36537892255", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
  { slot: "suite", title: "Tented Lodge", creator: "5lab", source: "https://www.flickr.com/photos/28242862@N00/4003821473", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
  { slot: "greece", title: "Oia Santorini classic", creator: "jdlasica", source: "https://www.flickr.com/photos/36521958135@N01/26979412180", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
  { slot: "advisor", title: "Travel Trip Map Direction Exploration Planning Concept", creator: "Rawpixel Ltd", source: "https://www.flickr.com/photos/147875007@N03/32191464373", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" },
];
