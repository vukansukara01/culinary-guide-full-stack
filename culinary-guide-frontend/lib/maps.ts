/** Google Maps deep links — no API key required */

export function googleMapsDirectionsUrl(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    api: "1",
    destination: `${latitude},${longitude}`,
    travelmode: "driving",
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function googleMapsPlaceUrl(
  latitude: number,
  longitude: number,
  name?: string
) {
  const query = name
    ? `${name} @${latitude},${longitude}`
    : `${latitude},${longitude}`;
  const params = new URLSearchParams({
    api: "1",
    query,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function googleMapsEmbedUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps?q=${latitude},${longitude}&hl=sr&z=16&output=embed`;
}

export function hasCoordinates(
  latitude?: number | null,
  longitude?: number | null
): boolean {
  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
}

export function parseCoordinates(
  latitude?: number | null,
  longitude?: number | null
): { latitude: number; longitude: number } | null {
  if (!hasCoordinates(latitude, longitude)) {
    return null;
  }
  return { latitude: latitude as number, longitude: longitude as number };
}
