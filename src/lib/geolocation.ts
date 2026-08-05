export interface GeoData {
  ipAddress: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
}

export async function getGeoFromRequest(
  request: Request
): Promise<GeoData> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  if (!ip) {
    return { ipAddress: null, location: null, latitude: null, longitude: null };
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon`, {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();

    if (data.status === "success") {
      const parts = [data.city, data.regionName, data.country].filter(Boolean);
      return {
        ipAddress: ip,
        location: parts.join(", ") || null,
        latitude: data.lat ?? null,
        longitude: data.lon ?? null,
      };
    }
  } catch {
    // Geolocation failed — still record the IP
  }

  return { ipAddress: ip, location: null, latitude: null, longitude: null };
}
