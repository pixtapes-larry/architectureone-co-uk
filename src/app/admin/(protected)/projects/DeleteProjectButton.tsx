"use client";

import { useState } from "react";
import { deleteProjectFormAction } from "./actions";
import styles from "./projects.module.css";

export default function DeleteProjectButton({
  id,
  address,
}: {
  id: number;
  address: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        className={styles.deleteBtn}
        onClick={() => setConfirming(true)}
      >
        Delete
      </button>
    );
  }

  return (
    <div className={styles.rowActions}>
      <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
        Delete &quot;{address}&quot;?
      </span>
      <form action={deleteProjectFormAction}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={styles.deleteBtn}>
          Confirm
        </button>
      </form>
      <button
        type="button"
        className={styles.deleteBtn}
        onClick={() => setConfirming(false)}
      >
        Cancel
      </button>
    </div>
  );
}
