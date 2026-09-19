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
    // 1. Try our server-side proxy endpoint first (bypasses browser CORS & User-Agent restrictions)
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
      neighbourhood = "Bhavani Puram";
    }

    const city = nomAddr.city || nomAddr.town || nomAddr.municipality || photonProps?.city || bdcData?.city || "";

    const parts: string[] = [];
    if (road) parts.push(road);
    if (neighbourhood) parts.push(neighbourhood);
    if (village && village !== neighbourhood && !(/v\s*d\s*puram|vidyadharapuram/i.test(village) && neighbourhood === "Bhavani Puram")) {
      parts.push(village);
    }
    if (city && city !== village && city !== neighbourhood) parts.push(city);

    const uniqueParts: string[] = [];
    const seen = new Set<string>();

    for (const rawPart of parts) {
      if (!rawPart) continue;
      const clean = rawPart.replace(/^[\s,.\-+]+|[\s,.\-+]+$/g, "").trim();
      if (!clean) continue;
      const lower = clean.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        uniqueParts.push(clean);
      }
    }

    let result = uniqueParts.join(", ");
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
 * Calculates the great-circle distance between two points on Earth using Haversine formula in kilometers (km).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
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
 */
export async function geocodeAddressToCoords(
  address: string
): Promise<LocationCoordinates | null> {
  if (!address || address.trim().length < 3) return null;
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
    if (/^(d\.?\s*no|door|h\.?\s*no|house|flat|plot|#|\d{5,6})/i.test(lower)) return false;
    if (/^\d+[\d\s/\-A-Za-z]*$/.test(p) && p.length < 8) return false;
    return true;
  });

  if (filtered.length >= 2) {
    return `${filtered[filtered.length - 2]}, ${filtered[filtered.length - 1]}`;
  } else if (filtered.length === 1) {
    return filtered[0];
  }
  
  return parts.slice(-2).join(", ") || fullAddress;
}


