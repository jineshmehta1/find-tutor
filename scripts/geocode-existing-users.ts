import { prisma } from "../lib/prisma";

async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  if (!address || address.trim().length < 3) return null;
  
  // Clean address for geocoding
  const cleanAddress = address
    .replace(/^(d\.?\s*no|door|h\.?\s*no|house|flat|plot|#|\d{5,6})/i, "")
    .trim();

  const searchQueries = [
    address,
    cleanAddress,
    // Extract locality/city parts if long address
    address.split(",").slice(-3).join(", ")
  ];

  for (const q of searchQueries) {
    if (!q || q.length < 3) continue;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=1`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "AacharyaAcademyGeocoder/1.0 (info@aacharya.com)"
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          if (!isNaN(lat) && !isNaN(lng)) {
            return { latitude: lat, longitude: lng };
          }
        }
      }
    } catch (err) {
      console.warn(`Geocoding error for query "${q}":`, err);
    }
    // Respect OpenStreetMap rate limit
    await new Promise((r) => setTimeout(r, 1000));
  }

  return null;
}

async function main() {
  console.log("🔍 Fetching all users from database...");
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} total user profiles.`);

  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const user of users) {
    if (user.latitude && user.longitude) {
      console.log(`✓ User ${user.name} (${user.role}) already has coordinates: (${user.latitude}, ${user.longitude})`);
      skippedCount++;
      continue;
    }

    if (!user.address || !user.address.trim()) {
      console.log(`⚠️ User ${user.name} (${user.role}) has no address provided. Skipping.`);
      skippedCount++;
      continue;
    }

    console.log(`🌐 Geocoding address for ${user.name} (${user.role}): "${user.address}"...`);
    const coords = await geocodeAddress(user.address);

    if (coords) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      });
      console.log(`✅ Updated ${user.name}: Latitude ${coords.latitude}, Longitude ${coords.longitude}`);
      updatedCount++;
    } else {
      console.log(`❌ Could not geocode address for ${user.name}: "${user.address}". Defaulting to India central fallback if needed.`);
      failedCount++;
    }

    // Pause between requests to adhere to OSM Nominatim terms of service
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("\n==========================================");
  console.log(`🎉 Geocoding Complete!`);
  console.log(`Updated: ${updatedCount} users`);
  console.log(`Skipped: ${skippedCount} users`);
  console.log(`Failed:  ${failedCount} users`);
  console.log("==========================================\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
