import { NextResponse } from "next/server";
import { prisma } from "@/lib/data";

// GET: Fetch banner for a specific page or all banners
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get("pageKey");

    if (pageKey) {
      // Find a single banner for the specific page
      const banner = await prisma.banner.findUnique({
        where: { pageKey },
      });
      return NextResponse.json(banner || {});
    }

    // Otherwise, return all banners (for an overview list)
    const banners = await prisma.banner.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("[BANNER_GET_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

// POST: Save or Update banner (Upsert Logic)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.pageKey || !body.imageUrl || !body.title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert ensures only ONE banner exists per pageKey
    const banner = await prisma.banner.upsert({
      where: { 
        pageKey: body.pageKey 
      },
      update: {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        breadcrumb: body.breadcrumb,
      },
      create: {
        pageKey: body.pageKey,
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        breadcrumb: body.breadcrumb,
      },
    });

    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.error("[BANNER_POST_ERROR]", error);
    return NextResponse.json({ error: "Failed to save banner" }, { status: 500 });
  }
}