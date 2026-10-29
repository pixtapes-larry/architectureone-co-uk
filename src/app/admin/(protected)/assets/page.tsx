import Link from "next/link";
import { listAssetsAdmin, listAssetCategoriesAdmin } from "@/lib/admin/assets";
import { scanOwnedImages } from "@/lib/admin/asset-scan";
import { getAssetUsageCounts } from "@/lib/admin/asset-usage";
import AssetUploadForm from "@/components/admin/AssetUploadForm";
import AssetBrowser, { type AssetRow } from "./AssetBrowser";
import styles from "../projects/projects.module.css";
import filterStyles from "./filters.module.css";

export const instant = false;

type UnifiedAsset = {
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
  source: "asset" | "project" | "award";
  assetId: number | null;
  owner: { kind: "project" | "award"; id: number; editHref: string } | null;
  useCount: number;
};

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

function sourceLabel(source: UnifiedAsset["source"]) {
  return source === "asset" ? "Standalone" : source === "project" ? "Project" : "Award";
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

  const [assets, dbCategories, owned, usage] = await Promise.all([
    listAssetsAdmin({}),
    listAssetCategoriesAdmin(),
    scanOwnedImages(),
    getAssetUsageCounts(),
  ]);

  const unified: UnifiedAsset[] = [
    ...assets.map((a): UnifiedAsset => ({
      key: a.url,
      filename: a.filename,
      url: a.url,
      mimeType: a.mimeType,
      fileSizeKb: a.fileSizeKb,
      width: a.width,
      height: a.height,
      label: a.label,
      category: a.category,
      createdAt: a.createdAt,
      source: "asset",
      assetId: a.id,
      owner: null,
      useCount: (usage.byUrl.get(a.url) ?? 0) + (usage.byAssetId.get(a.id) ?? 0),
    })),
    ...owned.map((o): UnifiedAsset => ({
      key: o.url,
      filename: o.filename,
      url: o.url,
      mimeType: o.mimeType,
      fileSizeKb: o.fileSizeKb,
      width: o.width,
      height: o.height,
      label: o.owner.label,
      category: o.category,
      createdAt: o.createdAt,
      source: o.owner.kind,
      assetId: null,
      owner: { kind: o.owner.kind, id: o.owner.id, editHref: o.owner.editHref },
      useCount: usage.byUrl.get(o.url) ?? 0,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const filtered = unified.filter((a) => {
    if (type && kindOf(a.mimeType) !== type) return false;
    if (category && a.category !== category) return false;
    if (search) {
      const haystack = `${a.filename} ${a.label ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  const categories = [...new Set([...dbCategories, ...SYNTHETIC_CATEGORIES.filter((c) => unified.some((a) => a.category === c))])];

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
    sourceLabel: sourceLabel(a.source),
    label: a.label,
    useLabel: a.useCount === 0 ? "Unused" : `${a.useCount}×`,
    assetId: a.source === "asset" ? a.assetId : null,
    editHref: a.owner?.editHref ?? null,
  }));

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Assets</h1>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 24, maxWidth: 640 }}>
        Everything that's actually on disk, in one place — standalone uploads
        (brochures, promo video, loose images) alongside photos, floorplans
        and badges that live on a project or award record. Any image here can
        also be picked straight from the &quot;Choose from library&quot;
        option on an image field elsewhere in the admin. Use count shows how
        many places on the site currently point at that file.
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
        {filtered.length} of {unified.length} files
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
