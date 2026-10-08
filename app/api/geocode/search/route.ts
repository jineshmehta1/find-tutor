import { NextResponse } from "next/server";
import { KNOWN_LOCALITIES } from "@/lib/geoUtils";

interface CuratedPlace {
  id: number;
  name: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  aliases: string[];
}

const CURATED_PLACES: CuratedPlace[] = [
  // ─── Vijayawada (NTR District, AP) ───
  {
    id: 9001,
    name: "Satyanarayanapuram",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520011",
    lat: 16.5218,
    lng: 80.6348,
    aliases: ["satyanarayanapuram", "satyanarayana puram", "sn puram", "s.n. puram", "s n puram", "satya narayana puram"]
  },
  {
    id: 9002,
    name: "Bhavanipuram",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520012",
    lat: 16.5273,
    lng: 80.5960,
    aliases: ["bhavanipuram", "bavanipuram", "bhavani puram"]
  },
  {
    id: 9003,
    name: "Vidyadharapuram",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520012",
    lat: 16.5310,
    lng: 80.5900,
    aliases: ["vidyadharapuram", "v d puram", "vd puram", "vidyadhara puram"]
  },
  {
    id: 9004,
    name: "Benz Circle",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520010",
    lat: 16.4985,
    lng: 80.6520,
    aliases: ["benz circle", "benz circle vijayawada", "benzcircle"]
  },
  {
    id: 9005,
    name: "Labbipet",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520010",
    lat: 16.5020,
    lng: 80.6400,
    aliases: ["labbipet", "labbipeta", "labbi pet"]
  },
  {
    id: 9006,
    name: "Patamata",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520010",
    lat: 16.4920,
    lng: 80.6650,
    aliases: ["patamata", "patamatapada", "patamata lanka"]
  },
  {
    id: 9007,
    name: "Moghalrajpuram",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520010",
    lat: 16.5050,
    lng: 80.6480,
    aliases: ["moghalrajpuram", "mughalrajpuram", "moghalraj puram"]
  },
  {
    id: 9008,
    name: "Guru Nanak Colony",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520008",
    lat: 16.4950,
    lng: 80.6600,
    aliases: ["gurunanak colony", "guru nanak colony", "gurunanak nagar", "guru nanak nagar"]
  },
  {
    id: 9009,
    name: "Gollapudi",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "521225",
    lat: 16.5450,
    lng: 80.5750,
    aliases: ["gollapudi", "one center gollapudi"]
  },
  {
    id: 9010,
    name: "Gunadala",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520004",
    lat: 16.5230,
    lng: 80.6650,
    aliases: ["gunadala", "gunadala vijayawada"]
  },
  {
    id: 9011,
    name: "Kanuru",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520007",
    lat: 16.4850,
    lng: 80.6950,
    aliases: ["kanuru", "kanuru vijayawada"]
  },
  {
    id: 9012,
    name: "Poranki",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "521137",
    lat: 16.4780,
    lng: 80.7100,
    aliases: ["poranki", "poranki vijayawada"]
  },
  {
    id: 9013,
    name: "Lalitha Nagar",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520012",
    lat: 16.5260,
    lng: 80.5980,
    aliases: ["lalitha nagar", "lalithanagar", "lalitha nagar bhavanipuram"]
  },
  {
    id: 9014,
    name: "One Town",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520001",
    lat: 16.5180,
    lng: 80.6120,
    aliases: ["one town", "onetown", "kothapeta", "chittinagar"]
  },
  {
    id: 9015,
    name: "Governorpet",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520002",
    lat: 16.5100,
    lng: 80.6280,
    aliases: ["governorpet", "governor pet", "besant road"]
  },
  {
    id: 9016,
    name: "Gandhi Nagar",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520003",
    lat: 16.5170,
    lng: 80.6280,
    aliases: ["gandhi nagar", "gandhinagar"]
  },
  {
    id: 9017,
    name: "Suryaraopet",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520002",
    lat: 16.5080,
    lng: 80.6350,
    aliases: ["suryaraopet", "suryaraopeta", "surya rao pet"]
  },
  {
    id: 9018,
    name: "Machavaram",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520004",
    lat: 16.5150,
    lng: 80.6550,
    aliases: ["machavaram", "machavaram down"]
  },
  {
    id: 9019,
    name: "Madhura Nagar",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520011",
    lat: 16.5230,
    lng: 80.6420,
    aliases: ["madhuranagar", "madhura nagar"]
  },
  {
    id: 9020,
    name: "Ajit Singh Nagar",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520015",
    lat: 16.5400,
    lng: 80.6350,
    aliases: ["ajit singh nagar", "ajitsingh nagar", "singh nagar", "singhnagar", "prakash nagar vijayawada"]
  },
  {
    id: 9021,
    name: "Payakapuram",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520015",
    lat: 16.5520,
    lng: 80.6380,
    aliases: ["payakapuram", "payaka puram"]
  },
  {
    id: 9022,
    name: "Auto Nagar",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520007",
    lat: 16.4960,
    lng: 80.6780,
    aliases: ["auto nagar", "autonagar"]
  },
  {
    id: 9023,
    name: "Enikepadu",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "521108",
    lat: 16.5280,
    lng: 80.7000,
    aliases: ["enikepadu"]
  },
  {
    id: 9024,
    name: "Ramavarappadu",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "521108",
    lat: 16.5250,
    lng: 80.6800,
    aliases: ["ramavarappadu", "ramavarappadu ring"]
  },
  {
    id: 9025,
    name: "Prasadampadu",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "521108",
    lat: 16.5200,
    lng: 80.6900,
    aliases: ["prasadampadu"]
  },
  {
    id: 9026,
    name: "Tadigadapa",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "521137",
    lat: 16.4750,
    lng: 80.7000,
    aliases: ["tadigadapa", "tadigadapa donka road"]
  },
  {
    id: 9027,
    name: "Penamaluru",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "521139",
    lat: 16.4680,
    lng: 80.7180,
    aliases: ["penamaluru"]
  },
  {
    id: 9028,
    name: "Krishna Lanka",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520013",
    lat: 16.5010,
    lng: 80.6250,
    aliases: ["krishna lanka", "krishnalanka", "krishna lanka vijayawada"]
  },
  {
    id: 9029,
    name: "Mangalagiri",
    city: "Mangalagiri",
    district: "Guntur / Vijayawada Region",
    state: "Andhra Pradesh",
    pincode: "522503",
    lat: 16.4300,
    lng: 80.5500,
    aliases: ["mangalagiri", "mangalagiri vijayawada"]
  },
  {
    id: 9030,
    name: "Tadepalli",
    city: "Tadepalli",
    district: "Guntur / Vijayawada Region",
    state: "Andhra Pradesh",
    pincode: "522501",
    lat: 16.4800,
    lng: 80.6000,
    aliases: ["tadepalli", "tadepalle"]
  },
  {
    id: 9031,
    name: "Gannavaram",
    city: "Gannavaram",
    district: "Vijayawada Region",
    state: "Andhra Pradesh",
    pincode: "521101",
    lat: 16.5380,
    lng: 80.8030,
    aliases: ["gannavaram", "gannavaram airport"]
  },
  {
    id: 9032,
    name: "Kondapalli",
    city: "Kondapalli",
    district: "Vijayawada Region",
    state: "Andhra Pradesh",
    pincode: "521228",
    lat: 16.6180,
    lng: 80.5360,
    aliases: ["kondapalli", "kondapalli ibrahimpatnam"]
  },
  {
    id: 9033,
    name: "Ibrahimpatnam",
    city: "Ibrahimpatnam",
    district: "Vijayawada Region",
    state: "Andhra Pradesh",
    pincode: "521456",
    lat: 16.5860,
    lng: 80.5180,
    aliases: ["ibrahimpatnam", "ibrahimpatnam vijayawada"]
  },
  {
    id: 9034,
    name: "Vijayawada",
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    pincode: "520001",
    lat: 16.5062,
    lng: 80.6480,
    aliases: ["vijayawada", "bezawada", "vijayawada center"]
  },

  // ─── Visakhapatnam / Vizag ───
  {
    id: 9100,
    name: "MVP Colony",
    city: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    pincode: "530017",
    lat: 17.7420,
    lng: 83.3370,
    aliases: ["mvp colony", "mvp colony vizag", "mvp"]
  },
  {
    id: 9101,
    name: "Gajuwaka",
    city: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    pincode: "530026",
    lat: 17.6900,
    lng: 83.2080,
    aliases: ["gajuwaka", "gajuwaka vizag"]
  },
  {
    id: 9102,
    name: "Madhurawada",
    city: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    pincode: "530048",
    lat: 17.8000,
    lng: 83.3550,
    aliases: ["madhurawada", "madhurawada vizag"]
  },
  {
    id: 9103,
    name: "Siripuram",
    city: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    pincode: "530003",
    lat: 17.7210,
    lng: 83.3150,
    aliases: ["siripuram", "siripuram vizag"]
  },
  {
    id: 9104,
    name: "Dwaraka Nagar",
    city: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    pincode: "530016",
    lat: 17.7250,
    lng: 83.3050,
    aliases: ["dwaraka nagar", "dwarakanagar vizag"]
  },
  {
    id: 9105,
    name: "Seethammadhara",
    city: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    pincode: "530013",
    lat: 17.7400,
    lng: 83.3120,
    aliases: ["seethammadhara", "seethammadhara vizag"]
  },
  {
    id: 9106,
    name: "Rushikonda",
    city: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    pincode: "530045",
    lat: 17.7800,
    lng: 83.3850,
    aliases: ["rushikonda", "rishikonda"]
  },
  {
    id: 9107,
    name: "Visakhapatnam",
    city: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    pincode: "530001",
    lat: 17.6868,
    lng: 83.2185,
    aliases: ["visakhapatnam", "vizag", "waltair"]
  },

  // ─── Guntur ───
  {
    id: 9200,
    name: "Brodipet",
    city: "Guntur",
    district: "Guntur",
    state: "Andhra Pradesh",
    pincode: "522002",
    lat: 16.3120,
    lng: 80.4380,
    aliases: ["brodipet", "brodipet guntur"]
  },
  {
    id: 9201,
    name: "Arundelpet",
    city: "Guntur",
    district: "Guntur",
    state: "Andhra Pradesh",
    pincode: "522002",
    lat: 16.3080,
    lng: 80.4420,
    aliases: ["arundelpet", "arundelpet guntur"]
  },
  {
    id: 9202,
    name: "Lakshmipuram",
    city: "Guntur",
    district: "Guntur",
    state: "Andhra Pradesh",
    pincode: "522007",
    lat: 16.3010,
    lng: 80.4280,
    aliases: ["lakshmipuram", "lakshmipuram guntur"]
  },
  {
    id: 9203,
    name: "Guntur",
    city: "Guntur",
    district: "Guntur",
    state: "Andhra Pradesh",
    pincode: "522002",
    lat: 16.3067,
    lng: 80.4365,
    aliases: ["guntur", "guntur city"]
  },

  // ─── Hyderabad (Telangana) ───
  {
    id: 9300,
    name: "HITEC City",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    lat: 17.4435,
    lng: 78.3772,
    aliases: ["hitec city", "hiteccity", "cyberabad"]
  },
  {
    id: 9301,
    name: "Madhapur",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    lat: 17.4483,
    lng: 78.3915,
    aliases: ["madhapur", "madhapur hyderabad"]
  },
  {
    id: 9302,
    name: "Gachibowli",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500032",
    lat: 17.4401,
    lng: 78.3489,
    aliases: ["gachibowli", "gachibowli hyderabad"]
  },
  {
    id: 9303,
    name: "Kukatpally",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500072",
    lat: 17.4849,
    lng: 78.4138,
    aliases: ["kukatpally", "kphb", "kukatpally hyderabad"]
  },
  {
    id: 9304,
    name: "Banjara Hills",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
    lat: 17.4156,
    lng: 78.4350,
    aliases: ["banjara hills", "banjara hills hyderabad"]
  },
  {
    id: 9305,
    name: "Jubilee Hills",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    lat: 17.4319,
    lng: 78.4074,
    aliases: ["jubilee hills", "jubilee hills hyderabad"]
  },
  {
    id: 9306,
    name: "Ameerpet",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500016",
    lat: 17.4375,
    lng: 78.4482,
    aliases: ["ameerpet", "ameerpet hyderabad"]
  },
  {
    id: 9307,
    name: "Dilsukhnagar",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500060",
    lat: 17.3688,
    lng: 78.5247,
    aliases: ["dilsukhnagar", "dilsukh nagar"]
  },
  {
    id: 9308,
    name: "Secunderabad",
    city: "Secunderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500003",
    lat: 17.4399,
    lng: 78.4983,
    aliases: ["secunderabad", "secunderabad hyderabad"]
  },
  {
    id: 9309,
    name: "Hyderabad",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
    lat: 17.3850,
    lng: 78.4867,
    aliases: ["hyderabad", "hyderabad city"]
  },

  // ─── Tirupati & Other Major AP Hubs ───
  {
    id: 9400,
    name: "Tirupati",
    city: "Tirupati",
    district: "Tirupati",
    state: "Andhra Pradesh",
    pincode: "517501",
    lat: 13.6288,
    lng: 79.4192,
    aliases: ["tirupati", "tirupati city"]
  },
  {
    id: 9401,
    name: "Alipiri",
    city: "Tirupati",
    district: "Tirupati",
    state: "Andhra Pradesh",
    pincode: "517507",
    lat: 13.6550,
    lng: 79.4000,
    aliases: ["alipiri", "alipiri tirupati"]
  },
  {
    id: 9402,
    name: "Kakinada",
    city: "Kakinada",
    district: "Kakinada",
    state: "Andhra Pradesh",
    pincode: "533001",
    lat: 16.9891,
    lng: 82.2475,
    aliases: ["kakinada"]
  },
  {
    id: 9403,
    name: "Rajahmundry",
    city: "Rajahmundry",
    district: "East Godavari",
    state: "Andhra Pradesh",
    pincode: "533101",
    lat: 17.0005,
    lng: 81.8040,
    aliases: ["rajahmundry", "rajamahendravaram"]
  },
  {
    id: 9404,
    name: "Nellore",
    city: "Nellore",
    district: "Nellore",
    state: "Andhra Pradesh",
    pincode: "524001",
    lat: 14.4426,
    lng: 79.9865,
    aliases: ["nellore"]
  },
  {
    id: 9405,
    name: "Kurnool",
    city: "Kurnool",
    district: "Kurnool",
    state: "Andhra Pradesh",
    pincode: "518001",
    lat: 15.8281,
    lng: 78.0373,
    aliases: ["kurnool"]
  },
  {
    id: 9406,
    name: "Warangal",
    city: "Warangal",
    district: "Warangal",
    state: "Telangana",
    pincode: "506001",
    lat: 17.9689,
    lng: 79.5941,
    aliases: ["warangal", "hanamkonda", "kazipet"]
  },
  {
    id: 9407,
    name: "Eluru",
    city: "Eluru",
    district: "Eluru",
    state: "Andhra Pradesh",
    pincode: "534001",
    lat: 16.7107,
    lng: 81.0952,
    aliases: ["eluru"]
  },
  {
    id: 9408,
    name: "Ongole",
    city: "Ongole",
    district: "Prakasam",
    state: "Andhra Pradesh",
    pincode: "523001",
    lat: 15.5057,
    lng: 80.0499,
    aliases: ["ongole"]
  },
  {
    id: 9409,
    name: "Kadapa",
    city: "Kadapa",
    district: "YSR District",
    state: "Andhra Pradesh",
    pincode: "516001",
    lat: 14.4673,
    lng: 78.8242,
    aliases: ["kadapa", "cuddapah"]
  },
  {
    id: 9410,
    name: "Anantapur",
    city: "Anantapur",
    district: "Anantapur",
    state: "Andhra Pradesh",
    pincode: "515001",
    lat: 14.6819,
    lng: 77.6006,
    aliases: ["anantapur"]
  }
];

function formatCuratedPlace(place: CuratedPlace) {
  const parts = [place.name];
  if (place.city && place.city !== place.name) parts.push(place.city);
  if (place.district && place.district !== place.city) parts.push(place.district);
  parts.push(place.state);
  if (place.pincode) parts.push(place.pincode);
  parts.push("India");

  return {
    place_id: place.id,
    display_name: parts.join(", "),
    lat: String(place.lat),
    lon: String(place.lng),
    type: "suburb",
    importance: 0.99,
    address: {
      suburb: place.name,
      city: place.city,
      state: place.state,
      postcode: place.pincode,
      country: "India",
      country_code: "in",
    },
  };
}

/**
 * Server-side places search API route with regional curated priority + Nominatim OSM fallback.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const cleanQuery = q.toLowerCase().trim();
  const normalizedQuery = cleanQuery.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const queryWords = normalizedQuery.split(" ").filter((w) => w.length >= 2);

  // 1. Find matching curated places
  const matchedCurated: ReturnType<typeof formatCuratedPlace>[] = [];
  const matchedIds = new Set<number>();

  for (const place of CURATED_PLACES) {
    const nameNorm = place.name.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
    const cityNorm = place.city.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
    const allAliases = [nameNorm, cityNorm, ...(place.aliases || [])];

    let isMatch = false;

    // Check exact or substring match in aliases or name
    if (
      nameNorm.includes(normalizedQuery) ||
      normalizedQuery.includes(nameNorm) ||
      allAliases.some((alias) => {
        const aNorm = alias.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
        return aNorm.includes(normalizedQuery) || normalizedQuery.includes(aNorm);
      })
    ) {
      isMatch = true;
    } else if (queryWords.length > 0) {
      // If multi-word search e.g. "satyanarayanapuram vijayawada", check if all words match the place
      const combinedPlaceString = `${nameNorm} ${cityNorm} ${place.district || ""} ${place.pincode} ${allAliases.join(" ")}`.toLowerCase();
      if (queryWords.every((w) => combinedPlaceString.includes(w))) {
        isMatch = true;
      }
    }

    if (isMatch && !matchedIds.has(place.id)) {
      matchedIds.add(place.id);
      matchedCurated.push(formatCuratedPlace(place));
    }
  }

  // 2. Fetch from OpenStreetMap Nominatim
  let nominatimResults: any[] = [];
  try {
    const fetchPromises = [
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=8&countrycodes=in&addressdetails=1`,
        {
          headers: {
            "User-Agent": "AacharyaAcademy/1.0 (contact@aacharya.academy)",
            "Accept-Language": "en-US,en;q=0.9",
          },
          cache: "no-store",
        }
      ).then((r) => (r.ok ? r.json() : [])),
    ];

    // If query doesn't specify a city, also query with "Vijayawada" to ensure regional completeness
    if (!cleanQuery.includes("vijayawada") && !cleanQuery.includes("hyderabad") && !cleanQuery.includes("vizag")) {
      fetchPromises.push(
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + " Vijayawada")}&limit=4&countrycodes=in&addressdetails=1`,
          {
            headers: {
              "User-Agent": "AacharyaAcademy/1.0 (contact@aacharya.academy)",
              "Accept-Language": "en-US,en;q=0.9",
            },
            cache: "no-store",
          }
        ).then((r) => (r.ok ? r.json() : [])).catch(() => [])
      );
    }

    const settled = await Promise.allSettled(fetchPromises);
    const combinedNom: any[] = [];
    for (const res of settled) {
      if (res.status === "fulfilled" && Array.isArray(res.value)) {
        combinedNom.push(...res.value);
      }
    }
    nominatimResults = combinedNom;
  } catch (error) {
    console.warn("Nominatim search error:", error);
  }

  const userLatStr = searchParams.get("userLat") || searchParams.get("lat");
  const userLngStr = searchParams.get("userLng") || searchParams.get("lng");
  const userLat = userLatStr ? parseFloat(userLatStr) : null;
  const userLng = userLngStr ? parseFloat(userLngStr) : null;
  const hasUserCoords = userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng);

  function computeDist(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 3. Merge & Deduplicate
  const finalResults: any[] = [...matchedCurated];

  for (const nPlace of nominatimResults) {
    const lat = parseFloat(nPlace.lat);
    const lon = parseFloat(nPlace.lon);
    if (isNaN(lat) || isNaN(lon)) continue;

    // Check if already in final results (within ~400m distance or matching name)
    const isDuplicate = finalResults.some((item) => {
      const iLat = parseFloat(item.lat);
      const iLon = parseFloat(item.lon);
      const dist = Math.sqrt(Math.pow(lat - iLat, 2) + Math.pow(lon - iLon, 2));
      return dist < 0.004; // roughly 400m
    });

    if (!isDuplicate) {
      finalResults.push(nPlace);
    }
  }

  // 4. Proximity-based Sorting: Prefer nearest location to the user
  if (hasUserCoords) {
    finalResults.sort((a, b) => {
      const aLat = parseFloat(a.lat);
      const aLon = parseFloat(a.lon);
      const bLat = parseFloat(b.lat);
      const bLon = parseFloat(b.lon);

      const distA = !isNaN(aLat) && !isNaN(aLon) ? computeDist(userLat!, userLng!, aLat, aLon) : 99999;
      const distB = !isNaN(bLat) && !isNaN(bLon) ? computeDist(userLat!, userLng!, bLat, bLon) : 99999;

      return distA - distB;
    });
  }

  return NextResponse.json(finalResults.slice(0, 10));
}
