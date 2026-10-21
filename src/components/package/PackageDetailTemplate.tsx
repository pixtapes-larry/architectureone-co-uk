import Link from "next/link";
import type { PackageTier } from "@/lib/packages";
import { PD_PACKAGE_TIERS, PD_PACKAGE_NOTE } from "@/lib/packages";
import { HOME_HREF, BOOK_CONSULTATION_HREF } from "@/lib/nav";
import styles from "./PackageDetailTemplate.module.css";

const CATEGORY_HREF = "/permitted-development";
const CATEGORY_LABEL = "Permitted Development";

export default function PackageDetailTemplate({
  tier,
}: {
  tier: PackageTier;
}) {
  const otherTiers = PD_PACKAGE_TIERS.filter((t) => t.slug !== tier.slug);

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link href={HOME_HREF}>Home</Link> /{" "}
        <Link href={CATEGORY_HREF}>{CATEGORY_LABEL}</Link> / {tier.name}{" "}
        Package
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          <h1 className={styles.title}>{tier.name} Package</h1>
          <div className={styles.price}>{tier.price}</div>
          <div className={styles.vat}>inc. VAT</div>

          <h2 className={styles.h2}>What&apos;s included</h2>
          <ul className={styles.includesList}>
            {tier.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <div className={styles.note}>{PD_PACKAGE_NOTE}</div>

          <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
            Book a Consultation
          </Link>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.othersCard}>
            <h3>Other packages</h3>
            {otherTiers.map((t) => (
              <Link
                key={t.slug}
                href={`/packages/${t.slug}`}
                className={styles.otherTierLink}
              >
                <div className={styles.otherTier}>
                  <span className={styles.otherTierName}>{t.name}</span>
                  <span className={styles.otherTierPrice}>{t.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
