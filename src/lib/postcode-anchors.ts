// A small postcode-outcode → coordinates table, standing in for real
// geocoding on the /projects map's search box until it's wired up to a
// proper service (e.g. postcodes.io). Previously lived in mock-projects.ts
// (now deletable) even though it's genuinely-used data, not mock content.
export const POSTCODE_SEARCH_ANCHORS: Record<string, [number, number]> = {
  IP7: [52.0456, 0.9592],
  IP1: [52.0665, 1.1456],
  IP8: [52.0586, 1.063],
  CO9: [51.9711, 0.5799],
  CO10: [52.0256, 0.8694],
  CM6: [51.8544, 0.4287],
  CM3: [51.6961, 0.595],
};
