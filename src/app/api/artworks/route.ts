import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const { title, artistName, imageUrl, description } = body;

    if (!title?.trim() || !artistName?.trim() || !imageUrl?.trim()) {
      return NextResponse.json(
        { error: "Title, artist name, and image URL are required" },
        { status: 400 }
      );
    }

    const artwork = await prisma.artwork.create({
      data: {
        title: title.trim(),
        artistName: artistName.trim(),
        imageUrl: imageUrl.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create artwork" },
      { status: 500 }
    );
  }
}
