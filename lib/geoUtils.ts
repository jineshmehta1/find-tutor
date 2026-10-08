/**
 * GeoUtils - High Precision Geolocation & Reverse Geocoding Service
 * Uses server-side API proxy (/api/geocode/reverse) for unconstrained CORS/User-Agent reverse geocoding,
 * plus robust browser GPS-to-network fallback handling.
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface NominatimPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface StructuredAddress {
  doorNumber: string;
  houseName: string;
  streetLocation: string;
}

/**
 * Combine door number, house/apartment name, and map street location into a clean address string.
 */
export function combineStructuredAddress(
  doorNumber: string,
  houseName: string,
  streetLocation: string
): string {
  const parts: string[] = [];
  const cleanDoor = (doorNumber || "").trim().replace(/^[\s,]+|[\s,]+$/g, "");
  const cleanHouse = (houseName || "").trim().replace(/^[\s,]+|[\s,]+$/g, "");
  const cleanStreet = (streetLocation || "").trim().replace(/^[\s,]+|[\s,]+$/g, "");

  if (cleanDoor) parts.push(cleanDoor);
  if (cleanHouse && cleanHouse.toLowerCase() !== cleanDoor.toLowerCase()) parts.push(cleanHouse);
  if (cleanStreet) {
    let remainingStreet = cleanStreet;
    if (cleanHouse && remainingStreet.toLowerCase().startsWith(cleanHouse.toLowerCase())) {
      remainingStreet = remainingStreet.substring(cleanHouse.length).replace(/^[\s,]+/, "");
    }
    if (cleanDoor && remainingStreet.toLowerCase().startsWith(cleanDoor.toLowerCase())) {
      remainingStreet = remainingStreet.substring(cleanDoor.length).replace(/^[\s,]+/, "");
    }
    if (remainingStreet) parts.push(remainingStreet);
  }

  return parts.join(", ");
}

/**
 * Parse an existing full address string back into structured components.
 */
export function parseStructuredAddress(fullAddress: string): StructuredAddress {
  if (!fullAddress || !fullAddress.trim()) {
    return { doorNumber: "", houseName: "", streetLocation: "" };
  }

  const rawTokens = fullAddress.split(",").map((t) => t.trim()).filter(Boolean);
  if (rawTokens.length <= 1) {
    return { doorNumber: "", houseName: "", streetLocation: fullAddress };
  }

  let doorNumber = "";
  let houseName = "";
  let streetStartIndex = 0;

  const token0 = rawTokens[0];
  const isDoorNo =
    /^(d\.?\s*no|door|h\.?\s*no|house\s*no|flat|plot|#|\d+[\d\s/\-A-Za-z]*$)/i.test(token0) &&
    !/st|street|road|rd|nagar|colony|puram/i.test(token0);

  if (isDoorNo) {
    doorNumber = token0;
    streetStartIndex = 1;
  }

  if (rawTokens.length > streetStartIndex) {
    const candidateHouse = rawTokens[streetStartIndex];
    const isHouseName =
      /(apartment|apt|nilayam|nivas|tower|residency|villa|manor|palace|building|house|complex|plaza)/i.test(
        candidateHouse
      ) || (!isDoorNo && streetStartIndex === 0 && rawTokens.length >= 3);

    if (isHouseName && !/st|street|road|rd|nagar|colony|puram/i.test(candidateHouse)) {
      houseName = candidateHouse;
      streetStartIndex++;
    }
  }

  const streetLocation = rawTokens.slice(streetStartIndex).join(", ");
  return { doorNumber, houseName, streetLocation: streetLocation || fullAddress };
}

/**
 * Perform high-precision reverse geocoding to construct clean, micro-locality address strings.
 */
export async function smartReverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    // 1. Try our server-side proxy endpoint first (handles Google Maps API, CORS & Vijayawada micro-resolver)
    const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
    if (res.ok) {
      const data = await res.json();
      if (data.streetAddress && data.streetAddress !== `${lat.toFixed(6)}, ${lng.toFixed(6)}`) {
        return data.streetAddress;
      }
      if (data.address && data.address !== `${lat.toFixed(6)}, ${lng.toFixed(6)}`) {
        return data.address;
      }
    }
  } catch (err) {
    console.warn("Server geocode proxy failed, falling back to direct client fetch:", err);
  }

  // 2. Direct client fallback if API route is unreachable
  try {
    const [nomRes, photonRes, bdcRes] = await Promise.allSettled([
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      ).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      ).then((r) => (r.ok ? r.json() : null)),
    ]);

    const nomData = nomRes.status === "fulfilled" ? nomRes.value : null;
    const photonProps = photonRes.status === "fulfilled" ? photonRes.value?.features?.[0]?.properties : null;
    const bdcData = bdcRes.status === "fulfilled" ? bdcRes.value : null;

    const nomAddr = nomData?.address || {};

    const road = nomAddr.road || nomAddr.pedestrian || nomAddr.street || photonProps?.street || "";

    let neighbourhood =
      nomAddr.neighbourhood ||
      nomAddr.residential ||
      nomAddr.colony ||
      nomAddr.suburb ||
      bdcData?.localityInfo?.informative?.find((i: any) => i.order === 15)?.name ||
      "";

    let village = nomAddr.village || nomAddr.hamlet || bdcData?.locality || "";
    if (/bhavani\s*puram/i.test(neighbourhood) || /bhavani\s*puram/i.test(village) || /bhavani\s*puram/i.test(nomData?.display_name || "")) {
      neighbourhood = "Bhavanipuram";
    }

    const city = nomAddr.city || nomAddr.town || nomAddr.municipality || photonProps?.city || bdcData?.city || "Vijayawada";

    const parts: string[] = [];
    if (road) parts.push(road);
    if (neighbourhood) parts.push(neighbourhood);
    if (village && !/bhavani\s*puram/i.test(village)) parts.push(village);
    if (city && city !== village && city !== neighbourhood) parts.push(city);

    // Deduplicate
    const uniqueParts: string[] = [];
    const seenNorm = new Set<string>();

    for (const rawPart of parts) {
      if (!rawPart) continue;
      const clean = rawPart.replace(/^[\s,.\-+]+|[\s,.\-+]+$/g, "").trim();
      if (!clean) continue;
      const norm = clean.toLowerCase().replace(/[\s\-_]+/g, "");
      if (!seenNorm.has(norm)) {
        seenNorm.add(norm);
        uniqueParts.push(clean);
      }
    }

    let result = uniqueParts.join(", ");
    
    // Check known pincode (520012 for Bhavanipuram)
    let postcode = nomAddr.postcode || bdcData?.postcode || "";
    if (
      /bhavani\s*puram|v\s*d\s*puram|swathi\s*road|hanumaiah/i.test(result) ||
      (lat >= 16.515 && lat <= 16.545 && lng >= 80.575 && lng <= 80.612)
    ) {
      postcode = "520012";
    }

    if (postcode && result && !result.includes(postcode)) {
      result += ` - ${postcode}`;
    }

    if (!result && nomData?.display_name) {
      result = nomData.display_name;
    }

    return result || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

/**
 * Get current browser GPS location with High Accuracy settings,
 * automatically falling back to network/IP geolocation if high-accuracy GPS times out (e.g. on desktop PCs).
 */
export function getBrowserCoordinates(
  timeoutMs = 8000
): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    // Try High Accuracy (Hardware GPS / Wi-Fi) first
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("High accuracy geolocation timed out or failed, falling back to network location:", err.message);
        // Fallback: try low accuracy (Network / IP)
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          (fallbackErr) => {
            reject(fallbackErr);
          },
          {
            enableHighAccuracy: false,
            timeout: 6000,
            maximumAge: 30000,
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Search places via server proxy or Nominatim with India country bounds and proximity ranking
 */
export async function searchPlacesAccurate(
  query: string,
  userLat?: number,
  userLng?: number
): Promise<NominatimPlace[]> {
  if (!query.trim() || query.length < 2) return [];

  let proximityLat = userLat;
  let proximityLng = userLng;

  if ((proximityLat === undefined || proximityLng === undefined) && typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("aacharya_last_known_coords");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.lat && parsed.lng) {
          proximityLat = parsed.lat;
          proximityLng = parsed.lng;
        }
      }
    } catch {}
  }

  const queryParams = new URLSearchParams({ q: query });
  if (proximityLat !== undefined && proximityLng !== undefined && !isNaN(proximityLat) && !isNaN(proximityLng)) {
    queryParams.set("userLat", String(proximityLat));
    queryParams.set("userLng", String(proximityLng));
  }

  try {
    const res = await fetch(`/api/geocode/search?${queryParams.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Server search proxy failed, trying direct nominatim:", err);
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&countrycodes=in&addressdetails=1`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Enhanced comprehensive dictionary of known localities with high precision coordinates in AP, Telangana, and major Indian hubs.
export const KNOWN_LOCALITIES: Record<string, { lat: number; lng: number; pincode?: string; displayName?: string }> = {
  // Vijayawada Localities (NTR District, AP)
  "satyanarayanapuram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "satyanarayanpuram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "satyanarayana puram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "satyanarayan puram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "satya narayana puram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "satya narayan puram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "sn puram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "snpuram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "s.n. puram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "s n puram": { lat: 16.5218, lng: 80.6348, pincode: "520011", displayName: "Satyanarayanapuram, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "bhavanipuram": { lat: 16.5273, lng: 80.5960, pincode: "520012", displayName: "Bhavanipuram, Vijayawada, NTR District, Andhra Pradesh, 520012, India" },
  "bavanipuram": { lat: 16.5273, lng: 80.5960, pincode: "520012", displayName: "Bhavanipuram, Vijayawada, NTR District, Andhra Pradesh, 520012, India" },
  "vidyadharapuram": { lat: 16.5310, lng: 80.5900, pincode: "520012", displayName: "Vidyadharapuram, Vijayawada, NTR District, Andhra Pradesh, 520012, India" },
  "v d puram": { lat: 16.5310, lng: 80.5900, pincode: "520012", displayName: "Vidyadharapuram, Vijayawada, NTR District, Andhra Pradesh, 520012, India" },
  "vd puram": { lat: 16.5310, lng: 80.5900, pincode: "520012", displayName: "Vidyadharapuram, Vijayawada, NTR District, Andhra Pradesh, 520012, India" },
  "swathi road": { lat: 16.5260, lng: 80.5980, pincode: "520012", displayName: "Swathi Road, Bhavanipuram, Vijayawada, Andhra Pradesh, 520012, India" },
  "lalitha nagar": { lat: 16.5260, lng: 80.5980, pincode: "520012", displayName: "Lalitha Nagar, Bhavanipuram, Vijayawada, Andhra Pradesh, 520012, India" },
  "sivalayam center": { lat: 16.5280, lng: 80.5950, pincode: "520012", displayName: "Sivalayam Center, Bhavanipuram, Vijayawada, Andhra Pradesh, 520012, India" },
  "gollapudi": { lat: 16.5450, lng: 80.5750, pincode: "521225", displayName: "Gollapudi, Vijayawada, NTR District, Andhra Pradesh, 521225, India" },
  "one town": { lat: 16.5180, lng: 80.6120, pincode: "520001", displayName: "One Town, Vijayawada, NTR District, Andhra Pradesh, 520001, India" },
  "onetown": { lat: 16.5180, lng: 80.6120, pincode: "520001", displayName: "One Town, Vijayawada, NTR District, Andhra Pradesh, 520001, India" },
  "kothapeta vijayawada": { lat: 16.5180, lng: 80.6120, pincode: "520001", displayName: "Kothapeta, One Town, Vijayawada, Andhra Pradesh, 520001, India" },
  "governorpet": { lat: 16.5100, lng: 80.6280, pincode: "520002", displayName: "Governorpet, Vijayawada, NTR District, Andhra Pradesh, 520002, India" },
  "governor pet": { lat: 16.5100, lng: 80.6280, pincode: "520002", displayName: "Governorpet, Vijayawada, NTR District, Andhra Pradesh, 520002, India" },
  "gandhi nagar": { lat: 16.5170, lng: 80.6280, pincode: "520003", displayName: "Gandhi Nagar, Vijayawada, NTR District, Andhra Pradesh, 520003, India" },
  "gandhinagar": { lat: 16.5170, lng: 80.6280, pincode: "520003", displayName: "Gandhi Nagar, Vijayawada, NTR District, Andhra Pradesh, 520003, India" },
  "suryaraopet": { lat: 16.5080, lng: 80.6350, pincode: "520002", displayName: "Suryaraopet, Vijayawada, NTR District, Andhra Pradesh, 520002, India" },
  "suryaraopeta": { lat: 16.5080, lng: 80.6350, pincode: "520002", displayName: "Suryaraopet, Vijayawada, NTR District, Andhra Pradesh, 520002, India" },
  "surya rao pet": { lat: 16.5080, lng: 80.6350, pincode: "520002", displayName: "Suryaraopet, Vijayawada, NTR District, Andhra Pradesh, 520002, India" },
  "machavaram": { lat: 16.5150, lng: 80.6550, pincode: "520004", displayName: "Machavaram, Vijayawada, NTR District, Andhra Pradesh, 520004, India" },
  "madhuranagar": { lat: 16.5230, lng: 80.6420, pincode: "520011", displayName: "Madhura Nagar, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "madhura nagar": { lat: 16.5230, lng: 80.6420, pincode: "520011", displayName: "Madhura Nagar, Vijayawada, NTR District, Andhra Pradesh, 520011, India" },
  "ajit singh nagar": { lat: 16.5400, lng: 80.6350, pincode: "520015", displayName: "Ajit Singh Nagar, Vijayawada, NTR District, Andhra Pradesh, 520015, India" },
  "ajitsingh nagar": { lat: 16.5400, lng: 80.6350, pincode: "520015", displayName: "Ajit Singh Nagar, Vijayawada, NTR District, Andhra Pradesh, 520015, India" },
  "singh nagar": { lat: 16.5400, lng: 80.6350, pincode: "520015", displayName: "Ajit Singh Nagar, Vijayawada, NTR District, Andhra Pradesh, 520015, India" },
  "payakapuram": { lat: 16.5520, lng: 80.6380, pincode: "520015", displayName: "Payakapuram, Vijayawada, NTR District, Andhra Pradesh, 520015, India" },
  "labbipet": { lat: 16.5020, lng: 80.6400, pincode: "520010", displayName: "Labbipet, Vijayawada, NTR District, Andhra Pradesh, 520010, India" },
  "labbipeta": { lat: 16.5020, lng: 80.6400, pincode: "520010", displayName: "Labbipet, Vijayawada, NTR District, Andhra Pradesh, 520010, India" },
  "benz circle": { lat: 16.4985, lng: 80.6520, pincode: "520010", displayName: "Benz Circle, Vijayawada, NTR District, Andhra Pradesh, 520010, India" },
  "moghalrajpuram": { lat: 16.5050, lng: 80.6480, pincode: "520010", displayName: "Moghalrajpuram, Vijayawada, NTR District, Andhra Pradesh, 520010, India" },
  "patamata": { lat: 16.4920, lng: 80.6650, pincode: "520010", displayName: "Patamata, Vijayawada, NTR District, Andhra Pradesh, 520010, India" },
  "gurunanak colony": { lat: 16.4950, lng: 80.6600, pincode: "520008", displayName: "Guru Nanak Colony, Vijayawada, NTR District, Andhra Pradesh, 520008, India" },
  "guru nanak colony": { lat: 16.4950, lng: 80.6600, pincode: "520008", displayName: "Guru Nanak Colony, Vijayawada, NTR District, Andhra Pradesh, 520008, India" },
  "auto nagar": { lat: 16.4960, lng: 80.6780, pincode: "520007", displayName: "Auto Nagar, Vijayawada, NTR District, Andhra Pradesh, 520007, India" },
  "autonagar": { lat: 16.4960, lng: 80.6780, pincode: "520007", displayName: "Auto Nagar, Vijayawada, NTR District, Andhra Pradesh, 520007, India" },
  "kanuru": { lat: 16.4850, lng: 80.6950, pincode: "520007", displayName: "Kanuru, Vijayawada, NTR District, Andhra Pradesh, 520007, India" },
  "poranki": { lat: 16.4780, lng: 80.7100, pincode: "521137", displayName: "Poranki, Vijayawada, NTR District, Andhra Pradesh, 521137, India" },
  "gunadala": { lat: 16.5230, lng: 80.6650, pincode: "520004", displayName: "Gunadala, Vijayawada, NTR District, Andhra Pradesh, 520004, India" },
  "enikepadu": { lat: 16.5280, lng: 80.7000, pincode: "521108", displayName: "Enikepadu, Vijayawada, NTR District, Andhra Pradesh, 521108, India" },
  "ramavarappadu": { lat: 16.5250, lng: 80.6800, pincode: "521108", displayName: "Ramavarappadu, Vijayawada, NTR District, Andhra Pradesh, 521108, India" },
  "prasadampadu": { lat: 16.5200, lng: 80.6900, pincode: "521108", displayName: "Prasadampadu, Vijayawada, NTR District, Andhra Pradesh, 521108, India" },
  "tadigadapa": { lat: 16.4750, lng: 80.7000, pincode: "521137", displayName: "Tadigadapa, Vijayawada, Andhra Pradesh, 521137, India" },
  "penamaluru": { lat: 16.4680, lng: 80.7180, pincode: "521139", displayName: "Penamaluru, Vijayawada, Andhra Pradesh, 521139, India" },
  "krishna lanka": { lat: 16.5010, lng: 80.6250, pincode: "520013", displayName: "Krishna Lanka, Vijayawada, NTR District, Andhra Pradesh, 520013, India" },
  "krishnalanka": { lat: 16.5010, lng: 80.6250, pincode: "520013", displayName: "Krishna Lanka, Vijayawada, NTR District, Andhra Pradesh, 520013, India" },
  "mangalagiri": { lat: 16.4300, lng: 80.5500, pincode: "522503", displayName: "Mangalagiri, Guntur/Vijayawada Region, Andhra Pradesh, 522503, India" },
  "tadepalle": { lat: 16.4800, lng: 80.6000, pincode: "522501", displayName: "Tadepalle, Vijayawada/Guntur Region, Andhra Pradesh, 522501, India" },
  "tadepalli": { lat: 16.4800, lng: 80.6000, pincode: "522501", displayName: "Tadepalli, Vijayawada/Guntur Region, Andhra Pradesh, 522501, India" },
  "gannavaram": { lat: 16.5380, lng: 80.8030, pincode: "521101", displayName: "Gannavaram, Vijayawada Region, Andhra Pradesh, 521101, India" },
  "kondapalli": { lat: 16.6180, lng: 80.5360, pincode: "521228", displayName: "Kondapalli, Vijayawada Region, Andhra Pradesh, 521228, India" },
  "ibrahimpatnam": { lat: 16.5860, lng: 80.5180, pincode: "521456", displayName: "Ibrahimpatnam, Vijayawada Region, Andhra Pradesh, 521456, India" },
  "nunna": { lat: 16.5850, lng: 80.6650, pincode: "521212", displayName: "Nunna, Vijayawada, NTR District, Andhra Pradesh, 521212, India" },
  "vijayawada": { lat: 16.5062, lng: 80.6480, pincode: "520001", displayName: "Vijayawada, NTR District, Andhra Pradesh, India" },

  // Andhra Pradesh Major Cities & Localities
  "guntur": { lat: 16.3067, lng: 80.4365, pincode: "522002", displayName: "Guntur, Andhra Pradesh, India" },
  "brodipet": { lat: 16.3120, lng: 80.4380, pincode: "522002", displayName: "Brodipet, Guntur, Andhra Pradesh, 522002, India" },
  "arundelpet": { lat: 16.3080, lng: 80.4420, pincode: "522002", displayName: "Arundelpet, Guntur, Andhra Pradesh, 522002, India" },
  "lakshmipuram guntur": { lat: 16.3010, lng: 80.4280, pincode: "522007", displayName: "Lakshmipuram, Guntur, Andhra Pradesh, 522007, India" },
  "visakhapatnam": { lat: 17.6868, lng: 83.2185, pincode: "530001", displayName: "Visakhapatnam, Andhra Pradesh, India" },
  "vizag": { lat: 17.6868, lng: 83.2185, pincode: "530001", displayName: "Visakhapatnam, Andhra Pradesh, India" },
  "mvp colony": { lat: 17.7420, lng: 83.3370, pincode: "530017", displayName: "MVP Colony, Visakhapatnam, Andhra Pradesh, 530017, India" },
  "gajuwaka": { lat: 17.6900, lng: 83.2080, pincode: "530026", displayName: "Gajuwaka, Visakhapatnam, Andhra Pradesh, 530026, India" },
  "madhurawada": { lat: 17.8000, lng: 83.3550, pincode: "530048", displayName: "Madhurawada, Visakhapatnam, Andhra Pradesh, 530048, India" },
  "siripuram": { lat: 17.7210, lng: 83.3150, pincode: "530003", displayName: "Siripuram, Visakhapatnam, Andhra Pradesh, 530003, India" },
  "dwaraka nagar": { lat: 17.7250, lng: 83.3050, pincode: "530016", displayName: "Dwaraka Nagar, Visakhapatnam, Andhra Pradesh, 530016, India" },
  "seethammadhara": { lat: 17.7400, lng: 83.3120, pincode: "530013", displayName: "Seethammadhara, Visakhapatnam, Andhra Pradesh, 530013, India" },
  "tirupati": { lat: 13.6288, lng: 79.4192, pincode: "517501", displayName: "Tirupati, Andhra Pradesh, India" },
  "alipiri": { lat: 13.6550, lng: 79.4000, pincode: "517507", displayName: "Alipiri, Tirupati, Andhra Pradesh, India" },
  "nellore": { lat: 14.4426, lng: 79.9865, pincode: "524001", displayName: "Nellore, Andhra Pradesh, India" },
  "kakinada": { lat: 16.9891, lng: 82.2475, pincode: "533001", displayName: "Kakinada, Andhra Pradesh, India" },
  "rajahmundry": { lat: 17.0005, lng: 81.8040, pincode: "533101", displayName: "Rajahmundry, Andhra Pradesh, India" },
  "kurnool": { lat: 15.8281, lng: 78.0373, pincode: "518001", displayName: "Kurnool, Andhra Pradesh, India" },
  "anantapur": { lat: 14.6819, lng: 77.6006, pincode: "515001", displayName: "Anantapur, Andhra Pradesh, India" },
  "kadapa": { lat: 14.4673, lng: 78.8242, pincode: "516001", displayName: "Kadapa, Andhra Pradesh, India" },
  "eluru": { lat: 16.7107, lng: 81.0952, pincode: "534001", displayName: "Eluru, Andhra Pradesh, India" },
  "ongole": { lat: 15.5057, lng: 80.0499, pincode: "523001", displayName: "Ongole, Andhra Pradesh, India" },
  "machilipatnam": { lat: 16.1875, lng: 81.1389, pincode: "521001", displayName: "Machilipatnam, Andhra Pradesh, India" },
  "tenali": { lat: 16.2435, lng: 80.6402, pincode: "522201", displayName: "Tenali, Andhra Pradesh, India" },
  "amaravati": { lat: 16.5417, lng: 80.5158, pincode: "522503", displayName: "Amaravati, Andhra Pradesh, India" },

  // Telangana Major Cities & Hubs
  "hyderabad": { lat: 17.3850, lng: 78.4867, pincode: "500001", displayName: "Hyderabad, Telangana, India" },
  "secunderabad": { lat: 17.4399, lng: 78.4983, pincode: "500003", displayName: "Secunderabad, Telangana, India" },
  "warangal": { lat: 17.9689, lng: 79.5941, pincode: "506001", displayName: "Warangal, Telangana, India" },
  "karimnagar": { lat: 18.4386, lng: 79.1288, pincode: "505001", displayName: "Karimnagar, Telangana, India" },
  "nizamabad": { lat: 18.6725, lng: 78.0941, pincode: "503001", displayName: "Nizamabad, Telangana, India" },
  "khammam": { lat: 17.2473, lng: 80.1514, pincode: "507001", displayName: "Khammam, Telangana, India" },
  "nalgonda": { lat: 17.0577, lng: 79.2684, pincode: "508001", displayName: "Nalgonda, Telangana, India" },
  "mahbubnagar": { lat: 16.7488, lng: 77.9856, pincode: "509001", displayName: "Mahbubnagar, Telangana, India" },
  "hitec city": { lat: 17.4435, lng: 78.3772, pincode: "500081", displayName: "HITEC City, Hyderabad, Telangana, 500081, India" },
  "gachibowli": { lat: 17.4401, lng: 78.3489, pincode: "500032", displayName: "Gachibowli, Hyderabad, Telangana, 500032, India" },
  "madhapur": { lat: 17.4483, lng: 78.3915, pincode: "500081", displayName: "Madhapur, Hyderabad, Telangana, 500081, India" },
  "kukatpally": { lat: 17.4849, lng: 78.4138, pincode: "500072", displayName: "Kukatpally, Hyderabad, Telangana, 500072, India" },
  "dilsukhnagar": { lat: 17.3688, lng: 78.5247, pincode: "500060", displayName: "Dilsukhnagar, Hyderabad, Telangana, 500060, India" },
  "ameerpet": { lat: 17.4375, lng: 78.4482, pincode: "500016", displayName: "Ameerpet, Hyderabad, Telangana, 500016, India" },
  "kondapur": { lat: 17.4680, lng: 78.3580, pincode: "500084", displayName: "Kondapur, Hyderabad, Telangana, 500084, India" },
  "miyapur": { lat: 17.4980, lng: 78.3550, pincode: "500049", displayName: "Miyapur, Hyderabad, Telangana, 500049, India" },
  "manikonda": { lat: 17.3990, lng: 78.3850, pincode: "500089", displayName: "Manikonda, Hyderabad, Telangana, 500089, India" },
};

/**
 * Calculates the great-circle distance between two points on Earth using Haversine formula in kilometers (km).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined || isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return 9999;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Rounded to 1 decimal place (e.g. 0.5 km)
}

/**
 * Helper to forward geocode an address string to { latitude, longitude }
 * Checks local high-speed dictionary first, then falls back to server/Nominatim geocoder.
 */
export async function geocodeAddressToCoords(
  address: string
): Promise<LocationCoordinates | null> {
  if (!address || address.trim().length < 2) return null;
  
  const cleanAddr = address.toLowerCase().trim();
  const normalizedQuery = cleanAddr.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

  // 1. Fast match against known localities (exact, word-boundary, or substring match)
  // Check exact key match first
  if (KNOWN_LOCALITIES[cleanAddr]) {
    return { latitude: KNOWN_LOCALITIES[cleanAddr].lat, longitude: KNOWN_LOCALITIES[cleanAddr].lng };
  }
  if (KNOWN_LOCALITIES[normalizedQuery]) {
    return { latitude: KNOWN_LOCALITIES[normalizedQuery].lat, longitude: KNOWN_LOCALITIES[normalizedQuery].lng };
  }

  // Check dictionary keys in clean address
  for (const [key, coords] of Object.entries(KNOWN_LOCALITIES)) {
    const keyNorm = key.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
    if (
      normalizedQuery === keyNorm ||
      normalizedQuery.includes(keyNorm) ||
      keyNorm.includes(normalizedQuery) ||
      cleanAddr.includes(key)
    ) {
      return { latitude: coords.lat, longitude: coords.lng };
    }
  }

  // 2. Query search server / Nominatim
  try {
    const places = await searchPlacesAccurate(address);
    if (places && places.length > 0) {
      const lat = parseFloat(places[0].lat);
      const lng = parseFloat(places[0].lon);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
  } catch (e) {
    console.error("Failed to geocode address:", e);
  }
  return null;
}

/**
 * Format address for public view (Zomato/Swiggy style).
 * Strips exact door numbers, house numbers, flat numbers, and returns "Locality, City".
 */
export function getPublicLocality(fullAddress: string): string {
  if (!fullAddress || !fullAddress.trim()) return "Vijayawada";
  const parts = fullAddress.split(",").map((p) => p.trim()).filter(Boolean);
  
  // Filter out door numbers, flat numbers, house numbers, pin codes
  const filtered = parts.filter((p) => {
    const lower = p.toLowerCase();
    if (/^(d\.?\s*no|door|h\.?\s*no|house|flat|falt|plot|room|apt|#|\d{5,6})/i.test(lower)) return false;
    if (/^\d+[\d\s/\-A-Za-z]*$/.test(p) && p.length < 8) return false;
    return true;
  });

  const cleanPart = (s: string) => s.replace(/\s*-\s*\d{5,6}$/, "").trim();

  if (filtered.length >= 2) {
    return `${cleanPart(filtered[filtered.length - 2])}, ${cleanPart(filtered[filtered.length - 1])}`;
  } else if (filtered.length === 1) {
    return cleanPart(filtered[0]);
  }
  
  const fallback = parts.slice(-2).map(cleanPart).join(", ");
  return fallback || fullAddress;
}

/**
 * Universal teaching mode matcher.
 * Matches user-selected filter modes (e.g. "Home Tutor", "At Student Home", "Online Tutor", "Online mode", "At Centre", "At Teacher Home")
 * against database values which can be JSON arrays ('["Online mode","At Student Home"]'), single strings, or comma-separated values.
 */
export function matchesTeachingMode(
  storedMode: string | null | undefined,
  filterMode: string | null | undefined
): boolean {
  if (!filterMode || filterMode === "All" || filterMode.trim() === "" || filterMode === "Any type of mode") {
    return true;
  }
  if (!storedMode) return false;

  const f = filterMode.toLowerCase().trim();
  
  // Extract individual modes from storedMode (JSON array, comma-separated, or single string)
  let storedList: string[] = [];
  try {
    const parsed = JSON.parse(storedMode);
    if (Array.isArray(parsed)) {
      storedList = parsed.map(String);
    } else if (typeof parsed === "string") {
      storedList = [parsed];
    }
  } catch {
    storedList = storedMode.split(",").map(s => s.trim());
  }
  if (storedList.length === 0) {
    storedList = [storedMode];
  }

  const sLowerList = storedList.map(item => item.toLowerCase().trim());
  const rawLower = storedMode.toLowerCase().trim();

  // 1. Online filter ("Online Tutor", "Online mode", "online", "remote", "virtual")
  if (f.includes("online") || f.includes("remote") || f.includes("virtual")) {
    return sLowerList.some(m => m.includes("online") || m.includes("remote") || m.includes("virtual")) || rawLower.includes("online") || rawLower.includes("remote");
  }

  // 2. Student Home / Home Tutor ("Home Tutor", "At Student Home", "Student Home", "Home Tuition")
  if (f.includes("student") || f.includes("home tutor") || f === "home" || f.includes("home tuition") || f === "at student home") {
    return sLowerList.some(m => 
      m.includes("student") || 
      m.includes("home tutor") || 
      m.includes("student home") || 
      m.includes("home tuition") ||
      (m.includes("home") && !m.includes("teacher home"))
    ) || rawLower.includes("student") || rawLower.includes("home tutor");
  }

  // 3. Teacher Home / At Centre ("At Centre", "At Center", "At Teacher Home", "Teacher Home", "Tuition Centre", "Centre", "Center")
  if (f.includes("teacher") || f.includes("centre") || f.includes("center") || f === "at centre" || f === "at teacher home") {
    return sLowerList.some(m => 
      m.includes("teacher") || 
      m.includes("centre") || 
      m.includes("center") || 
      m.includes("teacher home")
    ) || rawLower.includes("teacher") || rawLower.includes("centre") || rawLower.includes("center");
  }

  return rawLower.includes(f) || sLowerList.some(m => m.includes(f));
}



