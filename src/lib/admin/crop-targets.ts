// Minimum pixel dimensions a crop should have for a crisp result in each
// spot — a UI hint only (the low-res warning in the crop tool). Nothing
// resizes or rejects a crop based on this; it just tells the admin when a
// source photo doesn't have enough resolution for where it's being used.
export const CROP_TARGETS = {
  cover: { width: 1200, height: 900 },
  gallery: { width: 1200, height: 900 },
} as const;
