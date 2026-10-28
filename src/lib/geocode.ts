// Free geocoding via OpenStreetMap Nominatim. Usage policy requires a
// descriptive User-Agent and max 1 request/sec — https://operations.osmfoundation.org/policies/nominatim/
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "architectureone.co.uk admin (contact: luke.blackpheasant@gmail.com)";

export type GeocodeResult = { latitude: number; longitude: number };

let lastRequestAt = 0;

async function throttle() {
  const elapsed = Date.now() - lastRequestAt;
  const minGapMs = 1100;
  if (elapsed < minGapMs) {
    await new Promise((r) => setTimeout(r, minGapMs - elapsed));
  }
  lastRequestAt = Date.now();
}

async function lookup(query: string): Promise<GeocodeResult | null> {
  await throttle();
  try {
    const url = `${NOMINATIM_URL}?${new URLSearchParams({
      q: query,
      format: "json",
      limit: "1",
      countrycodes: "gb",
    })}`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) {
      console.error(`Geocoding failed (${res.status}) for: ${query}`);
      return null;
    }
    const results = (await res.json()) as { lat: string; lon: string }[];
    if (results.length === 0) return null;
    return { latitude: parseFloat(results[0].lat), longitude: parseFloat(results[0].lon) };
  } catch (err) {
    console.error(`Geocoding error for: ${query}`, err);
    return null;
  }
}

export async function geocodeAddress(
  address: string,
  place: string,
  postcode: string,
): Promise<GeocodeResult | null> {
  // Full address first (most precise); named/rural properties often aren't
  // indexed, so fall back to the postcode centroid, which Nominatim covers
  // reliably for the UK and is still plenty accurate for a map pin.
  const full = await lookup(`${address}, ${place}, ${postcode}, UK`);
  if (full) return full;

  console.warn(`Geocoding: no match for full address "${address}, ${place}, ${postcode}" — falling back to postcode`);
  const byPostcode = await lookup(`${postcode}, UK`);
  if (!byPostcode) {
    console.warn(`Geocoding: no match for postcode "${postcode}" either`);
  }
  return byPostcode;
}
