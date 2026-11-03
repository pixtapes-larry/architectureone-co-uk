import Link from "next/link";
import { listAssetsAdmin, listAssetCategoriesAdmin } from "@/lib/admin/assets";
import { scanOwnedImages } from "@/lib/admin/asset-scan";
import { getDirectAssetReferences } from "@/lib/admin/asset-usage";
import AssetUploadForm from "@/components/admin/AssetUploadForm";
import AssetBrowser, { type AssetRow, type DerivativeRow } from "./AssetBrowser";
import styles from "../projects/projects.module.css";
import filterStyles from "./filters.module.css";

export const instant = false;

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function kindOf(mimeType: string): "image" | "pdf" | "video" | "other" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("video/")) return "video";
  return "other";
}

function kindLabel(mimeType: string) {
  const kind = kindOf(mimeType);
  return kind === "other" ? "File" : kind === "pdf" ? "PDF" : kind === "video" ? "Video" : "Image";
}

const SYNTHETIC_CATEGORIES = ["Project photos", "Award badges"];

export default async function AdminAssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const type = params.type === "image" || params.type === "pdf" || params.type === "video" ? params.type : undefined;
  const category = params.category || undefined;
  const search = params.q?.trim().toLowerCase() || undefined;

  const [assets, dbCategories, owned, directRefs] = await Promise.all([
    listAssetsAdmin({}),
    listAssetCategoriesAdmin(),
    scanOwnedImages(),
    getDirectAssetReferences(),
  ]);

  // Owned files (cover/gallery derivatives) that were cropped from a
  // retained original get grouped under it, keyed by that original's
  // Asset id.
  const ownedByAssetId = new Map<number, typeof owned>();
  for (const o of owned) {
    if (o.assetId === null) continue;
    const list = ownedByAssetId.get(o.assetId) ?? [];
    list.push(o);
    ownedByAssetId.set(o.assetId, list);
  }

  // Floorplan/elevation/badge fields that reused an original's own file
  // directly (no crop, so no separate derivative file exists) — keyed by
  // the exact URL they copied, which only matches an Asset when that
  // happened.
  const directRefsByUrl = new Map<string, typeof directRefs>();
  for (const ref of directRefs) {
    const list = directRefsByUrl.get(ref.url) ?? [];
    list.push(ref);
    directRefsByUrl.set(ref.url, list);
  }

  type Original = {
    key: string;
    filename: string;
    url: string;
    mimeType: string;
    fileSizeKb: number;
    width: number | null;
    height: number | null;
    label: string | null;
    category: string | null;
    createdAt: Date;
    assetId: number | null;
    ownerLabel: string | null; // search only — the rest of the usage detail lives in `derivatives`
    derivatives: DerivativeRow[];
  };

  const originals: Original[] = [
    // Every retained original and standalone upload (brochures, PDFs,
    // video) — the primary list. Cover/gallery crops and any direct
    // floorplan/elevation/badge reuse nest underneath as "iterations".
    ...assets.map((a): Original => {
      const dims = a.width && a.height ? `${a.width} × ${a.height}` : null;
      const sizeLabel = formatSize(a.fileSizeKb);
      const croppedDerivatives: DerivativeRow[] = (ownedByAssetId.get(a.id) ?? []).map((o) => ({
        key: o.url,
        url: o.url,
        role: o.role,
        roleLabel: o.roleLabel,
        ownerLabel: o.owner.label,
        editHref: o.owner.editHref,
        ownerKind: o.owner.kind,
        ownerId: o.owner.id,
        dimensions: o.width && o.height ? `${o.width} × ${o.height}` : null,
        sizeLabel: formatSize(o.fileSizeKb),
      }));
      const directDerivatives: DerivativeRow[] = (directRefsByUrl.get(a.url) ?? []).map((r) => ({
        key: `${r.editHref}-${r.roleLabel}`,
        url: a.url,
        role: r.role,
        roleLabel: r.roleLabel,
        ownerLabel: r.ownerLabel,
        editHref: r.editHref,
        ownerKind: r.ownerKind,
        ownerId: r.ownerId,
        dimensions: dims,
        sizeLabel,
      }));
      return {
        key: `asset-${a.id}`,
        filename: a.filename,
        url: a.url,
        mimeType: a.mimeType,
        fileSizeKb: a.fileSizeKb,
        width: a.width,
        height: a.height,
        label: a.label,
        category: a.category,
        createdAt: a.createdAt,
        assetId: a.id,
        ownerLabel: null,
        derivatives: [...croppedDerivatives, ...directDerivatives],
      };
    }),
    // Owned files with no retained original behind them — floorplans,
    // elevations, badges, and any cover/gallery photo uploaded before the
    // crop model existed. Each is its own single-use file, not grouped —
    // but still gets a one-item `derivatives` list, so expanding works the
    // same way here as it does for a retained original with real
    // derivatives, instead of needing a separate always-visible treatment.
    ...owned
      .filter((o) => o.assetId === null)
      .map((o): Original => {
        const dims = o.width && o.height ? `${o.width} × ${o.height}` : null;
        const sizeLabel = formatSize(o.fileSizeKb);
        return {
          key: `owned-${o.url}`,
          filename: o.filename,
          url: o.url,
          mimeType: o.mimeType,
          fileSizeKb: o.fileSizeKb,
          width: o.width,
          height: o.height,
          label: null,
          category: o.category,
          createdAt: o.createdAt,
          assetId: null,
          ownerLabel: o.owner.label,
          derivatives: [
            {
              key: `self-${o.url}`,
              url: o.url,
              role: o.role,
              roleLabel: o.roleLabel,
              ownerLabel: o.owner.label,
              editHref: o.owner.editHref,
              ownerKind: o.owner.kind,
              ownerId: o.owner.id,
              dimensions: dims,
              sizeLabel,
            },
          ],
        };
      }),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const filtered = originals.filter((a) => {
    if (type && kindOf(a.mimeType) !== type) return false;
    if (category && a.category !== category) return false;
    if (search) {
      const haystack = `${a.filename} ${a.label ?? ""} ${a.ownerLabel ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  const categories = [...new Set([...dbCategories, ...SYNTHETIC_CATEGORIES.filter((c) => originals.some((a) => a.category === c))])];

  const hasFilters = Boolean(type || category || search);

  const rows: AssetRow[] = filtered.map((a) => ({
    key: a.key,
    filename: a.filename,
    url: a.url,
    isImage: a.mimeType.startsWith("image/"),
    typeLabel: kindLabel(a.mimeType),
    category: a.category,
    dimensions: a.width && a.height ? `${a.width} × ${a.height}` : null,
    sizeLabel: formatSize(a.fileSizeKb),
    dateLabel: formatDate(a.createdAt),
    label: a.label,
    assetId: a.assetId,
    derivatives: a.derivatives,
  }));

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Assets</h1>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 24, maxWidth: 640 }}>
        Every original file — standalone uploads (brochures, promo video,
        loose images) and the retained source behind any cover or gallery
        photo. Expand a row to see where it's actually being used — a cover
        photo, a gallery slot — each with its own independent crop. Any image
        here can also be picked straight from the &quot;Choose from
        library&quot; option on an image field elsewhere in the admin.
      </p>

      <div style={{ maxWidth: 480, marginBottom: 40 }}>
        <AssetUploadForm existingCategories={dbCategories} />
      </div>

      <div className={filterStyles.filterBar}>
        <form className={filterStyles.filterForm}>
          <input
            type="text"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search filename or label…"
            className={filterStyles.filterInput}
          />
          <select name="type" defaultValue={type ?? ""} className={filterStyles.filterSelect}>
            <option value="">All types</option>
            <option value="image">Images</option>
            <option value="pdf">PDFs</option>
            <option value="video">Video</option>
          </select>
          <select name="category" defaultValue={category ?? ""} className={filterStyles.filterSelect}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button type="submit" className={filterStyles.filterSubmit}>
            Filter
          </button>
          {hasFilters && (
            <Link href="/admin/assets" className={filterStyles.filterClear}>
              Clear
            </Link>
          )}
        </form>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
        {filtered.length} of {originals.length} files
      </h2>
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          {hasFilters ? "No files match those filters." : "No files yet."}
        </div>
      ) : (
        <AssetBrowser rows={rows} />
      )}
    </>
  );
}
