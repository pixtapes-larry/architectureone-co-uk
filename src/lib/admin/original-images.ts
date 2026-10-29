"use server";

// Lists retained originals (Asset rows backed by an untouched source file)
// that the cover-photo / gallery crop pickers can reuse. Deliberately NOT
// the same list as the plain-URL library picker (AssetLibraryPicker) —
// that one includes legacy project/award-owned derivatives that have no
// retained original behind them, so they can't be re-cropped. Only a real
// Asset row can be.
import { listAssetsAdmin } from "./assets";

export type OriginalImage = { id: number; url: string; label: string };

export async function listOriginalImagesAction(search?: string): Promise<OriginalImage[]> {
  const assets = await listAssetsAdmin({ type: "image", search });
  return assets.map((a) => ({ id: a.id, url: a.url, label: a.label || a.filename }));
}
