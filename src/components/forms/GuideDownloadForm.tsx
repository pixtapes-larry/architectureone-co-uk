"use client";

import { useState } from "react";
import styles from "./forms.module.css";

// Same interim approach as ContactForm/ConsultationForm — no email-sending
// service wired up yet, so "downloading" opens the visitor's own email
// client, addressed to us, requesting the guide. Replace with a real
// email-capture + auto-send flow before launch.
export default function GuideDownloadForm({
  contactEmail,
  buttonLabel,
}: {
  contactEmail: string;
  buttonLabel: string;
}) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = "Guide download request";
    const body = `Please send me a copy of the free guide.\n\nMy email: ${email}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="guide-email">
          Your email address
        </label>
        <input
          id="guide-email"
          className={styles.input}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" className={styles.submitBtn}>
        {buttonLabel}
      </button>
      <p className={styles.formNote}>
        Sending opens your email client with a request addressed to us —
        we&apos;ll reply with the guide attached. A proper automatic
        download is coming before launch.
      </p>
    </form>
  );
}
