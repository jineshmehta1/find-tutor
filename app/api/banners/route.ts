import { NextResponse } from "next/server";
import { prisma } from "@/lib/data";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get("pageKey");

    if (pageKey) {
      const banner = await prisma.banner.findUnique({ where: { pageKey } });
      return NextResponse.json(banner || {});
    }

    const banners = await prisma.banner.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pageKey, imageUrl } = body;

    if (!pageKey || !imageUrl) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const banner = await prisma.banner.upsert({
      where: { pageKey },
      update: { imageUrl },
      create: { pageKey, imageUrl },
    });

    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}