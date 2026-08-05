import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGeoFromRequest } from "@/lib/geolocation";

export const runtime = "nodejs";

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(artworks);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, artistName, description, imageUrl } = body;

    if (!title?.trim() || !artistName?.trim()) {
      return NextResponse.json(
        { error: "Title and artist name are required" },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const geo = await getGeoFromRequest(request);

    const artwork = await prisma.artwork.create({
      data: {
        title: title.trim(),
        artistName: artistName.trim(),
        imageUrl,
        description: description?.trim() || null,
        ...geo,
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save artwork";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}