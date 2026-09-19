import { NextResponse } from "next/server";

/**
 * Server-side high precision reverse geocoding API route.
 * Queries OpenStreetMap Nominatim with proper User-Agent header (bypasses browser CORS / header restrictions),
 * along with Photon and BigDataCloud as complementary providers for granular micro-locality accuracy.
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

    // 4. Locality / Village / Sub-district
    let locality =
      nomAddr.village ||
      nomAddr.hamlet ||
      nomAddr.subdistrict ||
      nomAddr.city_district ||
      bdcData?.locality ||
      "";

    // Standardize Bhavani Puram / Bhavanipuram in Vijayawada
    if (/bhavani\s*puram/i.test(neighbourhood) || /bhavani\s*puram/i.test(locality) || /bhavani\s*puram/i.test(nomData?.display_name || "")) {
      neighbourhood = "Bhavani Puram";
    }

    // 5. City / Town
    const city =
      nomAddr.city ||
      nomAddr.town ||
      nomAddr.municipality ||
      photonProps?.city ||
      bdcData?.city ||
      "";

    // 6. District / State
    const state = nomAddr.state || bdcData?.principalSubdivision || "";
    const postcode = nomAddr.postcode || bdcData?.postcode || "";

    // Assemble full address tokens
    const fullParts: string[] = [];
    if (building) fullParts.push(building);
    if (road && road !== building) fullParts.push(road);
    if (neighbourhood && neighbourhood !== building) fullParts.push(neighbourhood);
    if (locality && locality !== neighbourhood && !(/v\s*d\s*puram|vidyadharapuram/i.test(locality) && neighbourhood === "Bhavani Puram")) {
      fullParts.push(locality);
    }
    if (city && city !== locality && city !== neighbourhood) fullParts.push(city);
    if (state && state !== city) fullParts.push(state);

    // Assemble street-level address tokens (excluding exact building/house number)
    const streetParts: string[] = [];
    if (road) streetParts.push(road);
    if (neighbourhood) streetParts.push(neighbourhood);
    if (locality && locality !== neighbourhood && !(/v\s*d\s*puram|vidyadharapuram/i.test(locality) && neighbourhood === "Bhavani Puram")) {
      streetParts.push(locality);
    }
    if (city && city !== locality && city !== neighbourhood) streetParts.push(city);

    // Sanitize and deduplicate helper
    const sanitize = (tokens: string[]) => {
      const res: string[] = [];
      const seen = new Set<string>();
      for (const t of tokens) {
        if (!t) continue;
        const clean = t.replace(/^[\s,.\-+]+|[\s,.\-+]+$/g, "").trim();
        if (!clean) continue;
        const lower = clean.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          res.push(clean);
        }
      }
      return res.join(", ");
    };

    let fullAddress = sanitize(fullParts);
    let streetAddress = sanitize(streetParts);

    if (postcode && fullAddress && !fullAddress.includes(postcode)) {
      fullAddress += ` - ${postcode}`;
    }
    if (postcode && streetAddress && !streetAddress.includes(postcode)) {
      streetAddress += ` - ${postcode}`;
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
        postcode,
      },
    });
  } catch (error: any) {
    console.error("Reverse geocoding error:", error);
    return NextResponse.json(
      {
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        latitude: lat,
        longitude: lng,
      },
      { status: 200 }
    );
  }
}
