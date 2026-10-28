"use client";

import { useState } from "react";
import { CATEGORY_LABELS, CATEGORIES } from "@/lib/project-labels";
import styles from "./forms.module.css";

// Same interim approach as ContactForm — no booking system or backend
// is wired up yet, so submitting opens the visitor's email client with
// a pre-filled request rather than silently failing or faking a
// confirmation. Replace with a real booking flow (API route + calendar
// integration) before launch.
export default function ConsultationForm({ contactEmail }: { contactEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Consultation request from ${name || "a visitor"}`;
    const body = [
      notes,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      projectType ? `Project type: ${projectType}` : null,
      address ? `Property address / postcode: ${address}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="booking-name">
            Name
          </label>
          <input
            id="booking-name"
            className={styles.input}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="booking-email">
            Email
          </label>
          <input
            id="booking-email"
            className={styles.input}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="booking-phone">
            Phone (optional)
          </label>
          <input
            id="booking-phone"
            className={styles.input}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="booking-address">
            Property address / postcode
          </label>
          <input
            id="booking-address"
            className={styles.input}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="booking-project-type">
          What kind of project is it?
        </label>
        <select
          id="booking-project-type"
          className={styles.select}
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
        >
          <option value="">Not sure yet</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={CATEGORY_LABELS[cat]}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="booking-notes">
          Tell us a bit about what you have in mind
        </label>
        <textarea
          id="booking-notes"
          className={styles.textarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Request a Consultation
      </button>
      <p className={styles.formNote}>
        Sending opens your email client with this filled in — we&apos;re
        still confirming a dedicated enquiries address, so double-check
        the recipient before you send.
      </p>
    </form>
  );
}
