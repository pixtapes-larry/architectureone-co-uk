"use client";

import { useState } from "react";
import { deleteTestimonialFormAction } from "./actions";
import styles from "../projects/projects.module.css";

export default function DeleteTestimonialButton({ id }: { id: number }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" className={styles.deleteBtn} onClick={() => setConfirming(true)}>
        Delete
      </button>
    );
  }

  return (
    <div className={styles.rowActions}>
      <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Delete this testimonial?</span>
      <form action={deleteTestimonialFormAction}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={styles.deleteBtn}>
          Confirm
        </button>
      </form>
      <button type="button" className={styles.deleteBtn} onClick={() => setConfirming(false)}>
        Cancel
      </button>
    </div>
  );
}
