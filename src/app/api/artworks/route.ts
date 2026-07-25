import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

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
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const artistName = formData.get("artistName") as string;
    const description = formData.get("description") as string | null;
    const file = formData.get("file") as File | null;

    if (!title?.trim() || !artistName?.trim()) {
      return NextResponse.json(
        { error: "Title and artist name are required" },
        { status: 400 }
      );
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "An image file is required" },
        { status: 400 }
      );
    }

    if (file.size > 30 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 30MB" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, GIF, and WebP images are allowed" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `artworks/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    const artwork = await prisma.artwork.create({
      data: {
        title: title.trim(),
        artistName: artistName.trim(),
        imageUrl: blob.url,
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to upload artwork";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
