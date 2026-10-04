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
 * Search places via server proxy or Nominatim with India country bounds
 */
export async function searchPlacesAccurate(query: string): Promise<NominatimPlace[]> {
  if (!query.trim() || query.length < 2) return [];
  try {
    const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
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

/**
 * Comprehensive dictionary of known localities with high precision coordinates in AP, Telangana, and major Indian hubs.
 * Provides instant, offline-resilient coordinate resolution.
 */
export const KNOWN_LOCALITIES: Record<string, { lat: number; lng: number; pincode?: string }> = {
  // Vijayawada Localities
  "bhavanipuram": { lat: 16.5273, lng: 80.5960, pincode: "520012" },
  "bavanipuram": { lat: 16.5273, lng: 80.5960, pincode: "520012" },
  "vidyadharapuram": { lat: 16.5310, lng: 80.5900, pincode: "520012" },
  "v d puram": { lat: 16.5310, lng: 80.5900, pincode: "520012" },
  "vd puram": { lat: 16.5310, lng: 80.5900, pincode: "520012" },
  "swathi road": { lat: 16.5260, lng: 80.5980, pincode: "520012" },
  "lalitha nagar": { lat: 16.5260, lng: 80.5980, pincode: "520012" },
  "sivalayam center": { lat: 16.5280, lng: 80.5950, pincode: "520012" },
  "gollapudi": { lat: 16.5450, lng: 80.5750, pincode: "521225" },
  "one town": { lat: 16.5180, lng: 80.6120, pincode: "520001" },
  "onetown": { lat: 16.5180, lng: 80.6120, pincode: "520001" },
  "governorpet": { lat: 16.5100, lng: 80.6280, pincode: "520002" },
  "gandhi nagar": { lat: 16.5170, lng: 80.6280, pincode: "520003" },
  "gandhinagar": { lat: 16.5170, lng: 80.6280, pincode: "520003" },
  "labbipet": { lat: 16.5020, lng: 80.6400, pincode: "520010" },
  "benz circle": { lat: 16.4985, lng: 80.6520, pincode: "520010" },
  "moghalrajpuram": { lat: 16.5050, lng: 80.6480, pincode: "520010" },
  "patamata": { lat: 16.4920, lng: 80.6650, pincode: "520010" },
  "gurunanak colony": { lat: 16.4950, lng: 80.6600, pincode: "520008" },
  "auto nagar": { lat: 16.4960, lng: 80.6780, pincode: "520007" },
  "autonagar": { lat: 16.4960, lng: 80.6780, pincode: "520007" },
  "kanuru": { lat: 16.4850, lng: 80.6950, pincode: "520007" },
  "poranki": { lat: 16.4780, lng: 80.7100, pincode: "521137" },
  "gunadala": { lat: 16.5230, lng: 80.6650, pincode: "520004" },
  "enikepadu": { lat: 16.5280, lng: 80.7000, pincode: "521108" },
  "vijayawada": { lat: 16.5062, lng: 80.6480, pincode: "520001" },

  // Andhra Pradesh Major Cities & Hubs
  "guntur": { lat: 16.3067, lng: 80.4365, pincode: "522002" },
  "visakhapatnam": { lat: 17.6868, lng: 83.2185, pincode: "530001" },
  "vizag": { lat: 17.6868, lng: 83.2185, pincode: "530001" },
  "tirupati": { lat: 13.6288, lng: 79.4192, pincode: "517501" },
  "nellore": { lat: 14.4426, lng: 79.9865, pincode: "524001" },
  "kakinada": { lat: 16.9891, lng: 82.2475, pincode: "533001" },
  "rajahmundry": { lat: 17.0005, lng: 81.8040, pincode: "533101" },
  "kurnool": { lat: 15.8281, lng: 78.0373, pincode: "518001" },
  "anantapur": { lat: 14.6819, lng: 77.6006, pincode: "515001" },
  "kadapa": { lat: 14.4673, lng: 78.8242, pincode: "516001" },
  "eluru": { lat: 16.7107, lng: 81.0952, pincode: "534001" },
  "ongole": { lat: 15.5057, lng: 80.0499, pincode: "523001" },
  "machilipatnam": { lat: 16.1875, lng: 81.1389, pincode: "521001" },
  "tenali": { lat: 16.2435, lng: 80.6402, pincode: "522201" },
  "mangalagiri": { lat: 16.4300, lng: 80.5500, pincode: "522503" },
  "amaravati": { lat: 16.5417, lng: 80.5158, pincode: "522503" },
  "tadepalle": { lat: 16.4800, lng: 80.6000, pincode: "522501" },

  // Telangana Major Cities & Hubs
  "hyderabad": { lat: 17.3850, lng: 78.4867, pincode: "500001" },
  "secunderabad": { lat: 17.4399, lng: 78.4983, pincode: "500003" },
  "warangal": { lat: 17.9689, lng: 79.5941, pincode: "506001" },
  "karimnagar": { lat: 18.4386, lng: 79.1288, pincode: "505001" },
  "nizamabad": { lat: 18.6725, lng: 78.0941, pincode: "503001" },
  "khammam": { lat: 17.2473, lng: 80.1514, pincode: "507001" },
  "nalgonda": { lat: 17.0577, lng: 79.2684, pincode: "508001" },
  "mahbubnagar": { lat: 16.7488, lng: 77.9856, pincode: "509001" },
  "hitec city": { lat: 17.4435, lng: 78.3772, pincode: "500081" },
  "gachibowli": { lat: 17.4401, lng: 78.3489, pincode: "500032" },
  "madhapur": { lat: 17.4483, lng: 78.3915, pincode: "500081" },
  "kukatpally": { lat: 17.4849, lng: 78.4138, pincode: "500072" },
  "dilsukhnagar": { lat: 17.3688, lng: 78.5247, pincode: "500060" },
  "ameerpet": { lat: 17.4375, lng: 78.4482, pincode: "500016" }
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

  // 1. Fast match against known localities
  for (const [key, coords] of Object.entries(KNOWN_LOCALITIES)) {
    if (cleanAddr.includes(key) || key.includes(cleanAddr)) {
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



