const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><radialGradient id="sky" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#3d2660"/><stop offset="1" stop-color="#0f0f1a"/></radialGradient><linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff0d0"/><stop offset=".5" stop-color="#d4a574"/><stop offset="1" stop-color="#e8a0bf"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#sky)"/><path d="M32 10 37.4 26.6 54 32l-16.6 5.4L32 54l-5.4-16.6L10 32l16.6-5.4Z" fill="url(#gold)"/><circle cx="32" cy="32" r="5" fill="#fff8f0"/></svg>`;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ asset: string }> }
) {
  const { asset } = await params;

  if (asset !== "favicon.ico") {
    return new Response(null, { status: 404 });
  }

  return new Response(FAVICON, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
