/**
 * GeoUtils - High Precision Geolocation & Reverse Geocoding Service
 * Combines OpenStreetMap Nominatim, Photon (Komoot), and BigDataCloud for micro-locality accuracy.
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

/**
 * Perform high-precision reverse geocoding to construct clean, micro-locality address strings.
 * E.g. "Swathi Road, Bhavanipuram, Vidhyadharapuram, Vijayawada"
 */
export async function smartReverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        const [nomRes, photonRes, bdcRes] = await Promise.allSettled([
            fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                { headers: { "User-Agent": "AacharyaAcademy/1.0 (contact@aacharya.academy)" } }
            ).then((r) => (r.ok ? r.json() : null)),
            fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`).then((r) =>
                r.ok ? r.json() : null
            ),
            fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            ).then((r) => (r.ok ? r.json() : null)),
        ]);

        const nomData = nomRes.status === "fulfilled" ? nomRes.value : null;
        const photonProps =
            photonRes.status === "fulfilled" ? photonRes.value?.features?.[0]?.properties : null;
        const bdcData = bdcRes.status === "fulfilled" ? bdcRes.value : null;

        const nomAddr = nomData?.address || {};

        // 1. Landmark / Specific Place
        const landmark =
            nomAddr.amenity ||
            nomAddr.building ||
            nomAddr.shop ||
            nomAddr.leisure ||
            nomAddr.historic ||
            nomAddr.tourism ||
            (photonProps?.osm_key === "amenity" || photonProps?.osm_key === "building" ? photonProps?.name : "");

        // 2. Street / Road Name
        const road =
            nomAddr.road ||
            nomAddr.pedestrian ||
            nomAddr.footway ||
            nomAddr.street ||
            photonProps?.street ||
            "";

        // 3. Micro-locality / Neighbourhood / Colony / Street
        const neighbourhood =
            nomAddr.neighbourhood ||
            nomAddr.residential ||
            nomAddr.colony ||
            (photonProps?.osm_value === "neighbourhood" ? photonProps?.name : "") ||
            bdcData?.localityInfo?.informative?.find((i: any) => i.order === 15)?.name ||
            "";

        // 4. Locality / Area / Village (e.g., Bhavanipuram)
        const village = nomAddr.village || nomAddr.hamlet || bdcData?.locality || "";

        // 5. Suburb / Sub-district (e.g., Vidhyadharapuram)
        const suburb = nomAddr.suburb || nomAddr.subdistrict || photonProps?.district || "";

        // 6. City / Town
        const city =
            nomAddr.city ||
            nomAddr.town ||
            nomAddr.city_district ||
            nomAddr.municipality ||
            photonProps?.city ||
            bdcData?.city ||
            "Vijayawada";

        // Assemble hierarchy without duplicate generic overlays
        const parts: string[] = [];

        if (landmark) parts.push(landmark);
        if (road && road !== landmark) parts.push(road);
        if (neighbourhood && neighbourhood !== landmark && neighbourhood !== "Vijayawada Urban") {
            parts.push(neighbourhood);
        }
        if (village) parts.push(village);
        if (suburb && suburb !== village) parts.push(suburb);
        if (city && city !== village && city !== suburb) parts.push(city);

        // Sanitize and deduplicate tokens
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
 * Get current browser GPS location with High Accuracy settings
 */
export function getBrowserCoordinates(
    timeoutMs = 12000
): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !navigator.geolocation) {
            return reject(new Error("Geolocation is not supported by your browser."));
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            },
            (err) => {
                reject(err);
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
 * Search places via Nominatim with India country bounds
 */
export async function searchPlacesAccurate(query: string): Promise<NominatimPlace[]> {
    if (!query.trim() || query.length < 3) return [];
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&countrycodes=in&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
        );
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}
