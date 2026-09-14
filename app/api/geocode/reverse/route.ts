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
    const neighbourhood =
      nomAddr.neighbourhood ||
      nomAddr.residential ||
      nomAddr.colony ||
      nomAddr.suburb ||
      nomAddr.quarter ||
      (photonProps?.osm_value === "neighbourhood" ? photonProps?.name : "") ||
      bdcData?.localityInfo?.informative?.find((i: any) => i.order === 15)?.name ||
      "";

    // 4. Locality / Village / Sub-district
    const locality =
      nomAddr.village ||
      nomAddr.hamlet ||
      nomAddr.subdistrict ||
      nomAddr.city_district ||
      bdcData?.locality ||
      "";

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

    // Assemble address tokens hierarchically
    const parts: string[] = [];

    if (building) parts.push(building);
    if (road && road !== building) parts.push(road);
    if (neighbourhood && neighbourhood !== building) parts.push(neighbourhood);
    if (locality && locality !== neighbourhood) parts.push(locality);
    if (city && city !== locality && city !== neighbourhood) parts.push(city);
    if (state && state !== city) parts.push(state);

    // Sanitize and deduplicate
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

    let fullAddress = uniqueParts.join(", ");
    if (postcode && fullAddress && !fullAddress.includes(postcode)) {
      fullAddress += ` - ${postcode}`;
    }

    if (!fullAddress && nomData?.display_name) {
      fullAddress = nomData.display_name;
    }

    if (!fullAddress) {
      fullAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    return NextResponse.json({
      address: fullAddress,
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
