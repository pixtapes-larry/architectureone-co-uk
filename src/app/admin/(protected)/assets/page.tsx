import Link from "next/link";
import { listAssetsAdmin } from "@/lib/admin/assets";
import { scanOwnedImages } from "@/lib/admin/asset-scan";
import AssetUploadForm from "@/components/admin/AssetUploadForm";
import DeleteAssetButton from "./DeleteAssetButton";
import styles from "../projects/projects.module.css";

export const instant = false;

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function kindLabel(mimeType: string) {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.startsWith("video/")) return "Video";
  return "File";
}

export default async function AdminAssetsPage() {
  const [assets, owned] = await Promise.all([listAssetsAdmin(), scanOwnedImages()]);

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Assets</h1>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 24, maxWidth: 640 }}>
        Upload standalone files here — brochures, promo video, loose images
        not tied to a specific project or award. Project photos, floorplans
        and award badges live on their own record instead (edit those from
        the project or award itself) — the section below just shows what's
        already on disk for a full picture.
      </p>

      <div style={{ maxWidth: 480, marginBottom: 40 }}>
        <AssetUploadForm />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
        Uploaded assets ({assets.length})
      </h2>
      {assets.length === 0 ? (
        <div className={styles.empty}>No standalone assets uploaded yet.</div>
      ) : (
        <table className={styles.table} style={{ marginBottom: 40 }}>
          <thead>
            <tr>
              <th></th>
              <th>Filename</th>
              <th>Type</th>
              <th>Size</th>
              <th>Label</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>
                  {asset.mimeType.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.url} alt="" className={styles.thumb} />
                  ) : (
                    <span style={{ color: "var(--color-muted)", fontSize: 11, fontWeight: 700 }}>
                      {kindLabel(asset.mimeType)}
                    </span>
                  )}
                </td>
                <td>
                  <a href={asset.url} target="_blank" rel="noreferrer" className={styles.editLink}>
                    {asset.filename}
                  </a>
                </td>
                <td>{kindLabel(asset.mimeType)}</td>
                <td>{formatSize(asset.fileSizeKb)}</td>
                <td>{asset.label ?? <span style={{ color: "var(--color-muted)" }}>—</span>}</td>
                <td>
                  <DeleteAssetButton id={asset.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
        Project &amp; award images on disk ({owned.length})
      </h2>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        Read-only — these belong to a project or award record. Click through
        to edit or replace them there.
      </p>
      {owned.length === 0 ? (
        <div className={styles.empty}>No project or award images yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Belongs to</th>
              <th>Size</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {owned.map((item) => (
              <tr key={item.url}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt="" className={styles.thumb} />
                </td>
                <td>
                  {item.owner.label}
                  <span style={{ color: "var(--color-muted)", fontSize: 11, display: "block" }}>
                    {item.owner.kind === "project" ? "Project" : "Award"}
                  </span>
                </td>
                <td>{formatSize(item.fileSizeKb)}</td>
                <td>
                  <Link href={item.owner.editHref} className={styles.editLink}>
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
