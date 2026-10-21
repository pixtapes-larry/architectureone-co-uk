import Link from "next/link";
import ConsultationForm from "@/components/forms/ConsultationForm";
import { HOME_HREF, CONTACT_HREF } from "@/lib/nav";
import styles from "./page.module.css";

export default function BookAConsultationPage() {
  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link href={HOME_HREF}>Home</Link> / Book a Consultation
      </div>

      <div className={styles.intro}>
        <h1 className={styles.title}>Book a Consultation</h1>
        <p className={styles.lead}>
          Book a paid initial consultation — you&apos;ll leave with a
          written brief covering scope, approach and indicative costs.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.formCard}>
          <ConsultationForm />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.includesCard}>
            <h3>What&apos;s included</h3>
            <ul className={styles.includesList}>
              <li>A clear view of the scope for your project</li>
              <li>Our honest approach to what&apos;s achievable</li>
              <li>Indicative costs, in writing</li>
            </ul>
            <p className={styles.contactNote}>
              Have a question first?{" "}
              <Link href={CONTACT_HREF}>Contact us</Link> instead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
