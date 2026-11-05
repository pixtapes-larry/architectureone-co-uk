"use client";

import { useState } from "react";
import { deleteProjectFormAction, getProjectDeletionImpactAction } from "./actions";
import type { ProjectDeletionImpact } from "@/lib/admin/projects";
import styles from "./projects.module.css";

export default function DeleteProjectButton({
  id,
  address,
}: {
  id: number;
  address: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [impact, setImpact] = useState<ProjectDeletionImpact | null>(null);
  const [deleteFiles, setDeleteFiles] = useState(false);

  async function startConfirm() {
    setConfirming(true);
    setLoading(true);
    const result = await getProjectDeletionImpactAction(id);
    setImpact(result);
    setDeleteFiles(result.deletable.length > 0);
    setLoading(false);
  }

  if (!confirming) {
    return (
      <button type="button" className={styles.deleteBtn} onClick={startConfirm}>
        Delete
      </button>
    );
  }

  return (
    <div className={styles.rowActions} style={{ flexDirection: "column", alignItems: "flex-start", gap: 8, maxWidth: 360 }}>
      <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
        Delete &quot;{address}&quot;?
      </span>

      {loading ? (
        <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Checking its images…</span>
      ) : (
        impact && (
          <>
            {impact.protectedItems.length > 0 && (
              <div style={{ fontSize: 11.5, color: "#9c6a0c", background: "#faf0dc", borderRadius: 6, padding: "8px 10px" }}>
                <strong>Kept regardless:</strong> these are also used elsewhere, so they won&apos;t be deleted.
                <ul style={{ margin: "4px 0 0", paddingLeft: 16 }}>
                  {impact.protectedItems.map((item) => (
                    <li key={item.label}>
                      {item.label} — also used by {item.usedElsewhere.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {impact.deletable.length > 0 ? (
              <label style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={deleteFiles}
                  onChange={(e) => setDeleteFiles(e.target.checked)}
                />
                <span>
                  Also delete this project&apos;s image files from disk ({impact.deletable.length}
                  {" "}
                  {impact.deletable.length === 1 ? "file" : "files"}: {impact.deletable.map((f) => f.label).join(", ")})
                </span>
              </label>
            ) : (
              <span style={{ fontSize: 11.5, color: "var(--color-muted)" }}>
                No image files belong only to this project — nothing to delete beyond the record itself.
              </span>
            )}
          </>
        )
      )}

      <div className={styles.rowActions}>
        <form action={deleteProjectFormAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="deleteFiles" value={deleteFiles ? "on" : "off"} />
          <button type="submit" className={styles.deleteBtn} disabled={loading}>
            Confirm
          </button>
        </form>
        <button type="button" className={styles.deleteBtn} onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
