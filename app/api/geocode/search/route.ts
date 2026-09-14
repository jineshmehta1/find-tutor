import { NextResponse } from "next/server";

/**
 * Server-side places search API route with India country bounds filter.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=8&countrycodes=in&addressdetails=1`,
      {
        headers: {
          "User-Agent": "AacharyaAcademy/1.0 (contact@aacharya.academy)",
          "Accept-Language": "en-US,en;q=0.9",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Geocode search error:", error);
    return NextResponse.json([]);
  }
}
