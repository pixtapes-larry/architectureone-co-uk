"use client";

import { useState } from "react";
import styles from "./forms.module.css";

// No backend is wired up yet — submitting builds a mailto: link from
// what's typed and hands it to the browser, which opens the visitor's
// own email client with the message pre-filled. Genuinely functional
// without needing a server, an email-sending service, or any secrets;
// swap for a real API route + email service before launch if a plain
// mailto isn't the final answer.
export default function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Website enquiry from ${name || "a visitor"}`;
    const body = [
      message,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
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
          <label className={styles.label} htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            className={styles.input}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            className={styles.input}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-phone">
          Phone (optional)
        </label>
        <input
          id="contact-phone"
          className={styles.input}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          className={styles.textarea}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Send Message
      </button>
      <p className={styles.formNote}>
        Sending opens your email client with this filled in — we&apos;re
        still confirming a dedicated enquiries address, so double-check
        the recipient before you send.
      </p>
    </form>
  );
}
