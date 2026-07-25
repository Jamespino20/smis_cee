import { NextResponse } from "next/server";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pathname } = body;

    if (!pathname) {
      return NextResponse.json({ error: "pathname is required" }, { status: 400 });
    }

    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ clientToken });
  } catch (error) {
    console.error("[upload-token] Error:", error);
    const msg = error instanceof Error ? error.message : "Upload token failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}