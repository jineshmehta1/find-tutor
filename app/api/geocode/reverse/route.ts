import { NextResponse } from "next/server";

/**
 * Known postal code & locality dictionary for accurate micro-locality resolution
 * across Andhra Pradesh & Vijayawada regions.
 */
function resolveKnownPostalCode(lat: number, lng: number, addressTokens: string[], currentPostcode: string): string {
  const combinedText = addressTokens.join(" ").toLowerCase();

  // 1. Bhavanipuram / Vidyadharapuram / Swathi Road / RTC Workshop / HB Colony -> 520012
  if (
    /bhavani\s*puram|vidyadhara\s*puram|v\s*d\s*puram|swathi\s*road|hanumaiah|hb\s*colony|rtc\s*workshop/i.test(combinedText) ||
    (lat >= 16.515 && lat <= 16.545 && lng >= 80.575 && lng <= 80.612)
  ) {
    return "520012";
  }

  // 2. Benz Circle / Patamata / Gayatri Nagar / Gurunanak Colony / Labbipet -> 520010
  if (/benz\s*circle|patamata|gayatri\s*nagar|gurunanak|labbipet|moghalrajpuram|tikle\s*road/i.test(combinedText)) {
    return "520010";
  }

  // 3. Governorpet / Suryaraopet / Besant Road / Gandhinagar -> 520002
  if (/governor\s*pet|suryarao\s*pet|besant\s*road|gandhinagar|prakasam\s*road/i.test(combinedText)) {
    return "520002";
  }

  // 4. Gunadala / Machavaram / Ramavarappadu -> 520004
  if (/gunadala|machavaram|ramavarappadu/i.test(combinedText)) {
    return "520004";
  }

  // 5. Kanuru / Poranki / Penamaluru / Auto Nagar -> 520007
  if (/kanuru|poranki|penamaluru|auto\s*nagar|tadigadapa/i.test(combinedText)) {
    return "520007";
  }

  // 6. Gollapudi -> 521225
  if (/gollapudi|one\s*center/i.test(combinedText)) {
    return "521225";
  }

  // 7. Satyanarayanapuram / Madhuranagar / SN Puram / Pezzonipet -> 520011
  if (
    /satyanarayana\s*puram|sn\s*puram|madhura\s*nagar|pezzoni\s*pet|satya\s*narayana/i.test(combinedText) ||
    (lat >= 16.516 && lat <= 16.532 && lng >= 80.628 && lng <= 80.648)
  ) {
    return "520011";
  }

  // 8. One Town / Kothapeta / Brahmin Street -> 520001
  if (/one\s*town|kothapeta|brahmin\s*street|islampet|tarapet|chittinagar/i.test(combinedText)) {
    return "520001";
  }

  return currentPostcode || "";
}

/**
 * Fuzzy token deduplication helper
 * Prevents "Bhavani Puram, Bhavanipuram" or "Vijayawada, Vijayawada Urban" duplications.
 */
function cleanAndDeduplicate(tokens: string[]): string[] {
  const result: string[] = [];
  const seenNorm = new Set<string>();

  for (const raw of tokens) {
    if (!raw) continue;
    const clean = raw.replace(/^[\s,.\-+]+|[\s,.\-+]+$/g, "").trim();
    if (!clean) continue;

    // Normalize: remove spaces, lowercase, remove common suffix variations
    const norm = clean
      .toLowerCase()
      .replace(/[\s\-_]+/g, "")
      .replace(/(urban|rural|mandal|district|city|so|po)$/g, "");

    if (!norm) continue;

    // Check if we already have this or a very similar token
    let isDuplicate = false;
    for (const s of seenNorm) {
      if (s === norm || (s.length > 5 && (s.includes(norm) || norm.includes(s)))) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seenNorm.add(norm);
      result.push(clean);
    }
  }

  return result;
}

/**
 * Server-side reverse geocoding API route.
 * Supports Google Maps API when GOOGLE_MAPS_API_KEY is configured,
 * with high-precision OSM Nominatim, Photon, and BigDataCloud fallback + Vijayawada micro-resolver.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  if (!latStr || !lngStr) {
    return NextResponse.json({ error: "Latitude and Longitude parameters are required." }, { status: 400 });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Invalid numeric coordinates." }, { status: 400 });
  }

  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // 1. If Google Maps API key is configured, use Google Maps Geocoding API for highest fidelity (Blinkit/Flipkart level)
  if (googleApiKey) {
    try {
      const gRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`
      );
      if (gRes.ok) {
        const gData = await gRes.json();
        if (gData.status === "OK" && gData.results?.length > 0) {
          const firstResult = gData.results[0];
          const formatted = firstResult.formatted_address;
          return NextResponse.json({
            address: formatted,
            streetAddress: formatted,
            latitude: lat,
            longitude: lng,
            provider: "google",
          });
        }
      }
    } catch (gErr) {
      console.warn("Google Maps reverse geocode failed, falling back to multi-provider engine:", gErr);
    }
  }

  // 2. Multi-provider OpenStreetMap Nominatim + Photon + BigDataCloud resolution
  try {
    const [nomRes, photonRes, bdcRes] = await Promise.allSettled([
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "AacharyaAcademy/1.0 (contact@aacharya.academy)",
            "Accept-Language": "en-US,en;q=0.9",
          },
          cache: "no-store",
        }
      ).then((r) => (r.ok ? r.json() : null)),

      fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`, {
        cache: "no-store",
      }).then((r) => (r.ok ? r.json() : null)),

      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        { cache: "no-store" }
      ).then((r) => (r.ok ? r.json() : null)),
    ]);

    const nomData = nomRes.status === "fulfilled" ? nomRes.value : null;
    const photonProps = photonRes.status === "fulfilled" ? photonRes.value?.features?.[0]?.properties : null;
    const bdcData = bdcRes.status === "fulfilled" ? bdcRes.value : null;

    const nomAddr = nomData?.address || {};

    // 1. Building / House Number / Landmark
    const building =
      nomAddr.building ||
      nomAddr.house_number ||
      nomAddr.house_name ||
      nomAddr.flat ||
      nomAddr.amenity ||
      nomAddr.shop ||
      nomAddr.office ||
      nomAddr.leisure ||
      nomAddr.tourism ||
      (photonProps?.osm_key === "amenity" || photonProps?.osm_key === "building" ? photonProps?.name : "");

    // 2. Street / Road / Pedestrian
    const road =
      nomAddr.road ||
      nomAddr.pedestrian ||
      nomAddr.footway ||
      nomAddr.street ||
      photonProps?.street ||
      "";

    // 3. Colony / Neighbourhood / Residential Area
    let neighbourhood =
      nomAddr.neighbourhood ||
      nomAddr.residential ||
      nomAddr.colony ||
      nomAddr.suburb ||
      nomAddr.quarter ||
      (photonProps?.osm_value === "neighbourhood" ? photonProps?.name : "") ||
      bdcData?.localityInfo?.informative?.find((i: any) => i.order === 15)?.name ||
      "";

    // Standardize Bhavanipuram
    if (
      /bhavani\s*puram/i.test(neighbourhood) ||
      /bhavani\s*puram/i.test(nomAddr.village || "") ||
      /bhavani\s*puram/i.test(nomData?.display_name || "")
    ) {
      neighbourhood = "Bhavanipuram";
    }

    // 4. Locality / Village / Sub-district
    let locality =
      nomAddr.village ||
      nomAddr.hamlet ||
      nomAddr.subdistrict ||
      nomAddr.city_district ||
      bdcData?.locality ||
      "";

    if (/bhavani\s*puram/i.test(locality)) {
      locality = "Bhavanipuram";
    }

    // 5. City / Town
    const city =
      nomAddr.city ||
      nomAddr.town ||
      nomAddr.municipality ||
      photonProps?.city ||
      bdcData?.city ||
      "Vijayawada";

    // 6. District / State
    const state = nomAddr.state || bdcData?.principalSubdivision || "Andhra Pradesh";
    let rawPostcode = nomAddr.postcode || bdcData?.postcode || "";

    // Assemble candidate address tokens
    const rawTokens: string[] = [];
    if (building) rawTokens.push(building);
    if (road && road !== building) rawTokens.push(road);
    if (neighbourhood && neighbourhood !== building) rawTokens.push(neighbourhood);
    if (locality && locality !== neighbourhood) rawTokens.push(locality);
    if (city && city !== locality && city !== neighbourhood) rawTokens.push(city);

    // Run smart Vijayawada pincode resolver (resolves Bhavanipuram to 520012)
    const resolvedPostcode = resolveKnownPostalCode(lat, lng, rawTokens, rawPostcode);

    // Deduplicate tokens
    const cleanTokens = cleanAndDeduplicate(rawTokens);

    // Assemble street-level address (road, neighbourhood, locality, city)
    let streetAddress = cleanTokens.join(", ");
    if (resolvedPostcode && !streetAddress.includes(resolvedPostcode)) {
      streetAddress += ` - ${resolvedPostcode}`;
    }

    // Assemble full address including state
    const fullTokens = [...cleanTokens];
    if (state && !fullTokens.includes(state)) {
      fullTokens.push(state);
    }
    let fullAddress = fullTokens.join(", ");
    if (resolvedPostcode && !fullAddress.includes(resolvedPostcode)) {
      fullAddress += ` - ${resolvedPostcode}`;
    }

    if (!fullAddress && nomData?.display_name) {
      fullAddress = nomData.display_name;
    }
    if (!streetAddress) {
      streetAddress = fullAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    return NextResponse.json({
      address: fullAddress,
      streetAddress: streetAddress,
      latitude: lat,
      longitude: lng,
      details: {
        building,
        road,
        neighbourhood,
        locality,
        city,
        state,
        postcode: resolvedPostcode,
      },
    });
  } catch (error: any) {
    console.error("Reverse geocoding error:", error);
    return NextResponse.json(
      {
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        streetAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        latitude: lat,
        longitude: lng,
      },
      { status: 200 }
    );
  }
}
