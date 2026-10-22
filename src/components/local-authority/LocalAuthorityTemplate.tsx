import Link from "next/link";
import type { LocalAuthorityStats } from "@/lib/local-authorities";
import { PROJECT_TYPE_LABELS } from "@/lib/project-labels";
import { HOME_HREF, BOOK_CONSULTATION_HREF } from "@/lib/nav";
import styles from "./LocalAuthorityTemplate.module.css";

export default function LocalAuthorityTemplate({
  stats,
}: {
  stats: LocalAuthorityStats;
}) {
  return (
    <>
      <div className={styles.page}>
        <div className={styles.crumb}>
          <Link href={HOME_HREF}>Home</Link> / Local Authority Showcase /{" "}
          {stats.name}
        </div>

        <div className={styles.intro}>
          <h1 className={styles.title}>{stats.name}</h1>
          <p className={styles.lead}>
            Planning permission granted across {stats.name} — {stats.total}{" "}
            project{stats.total === 1 ? "" : "s"} and counting.
          </p>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statTile}>
            <div className={styles.statCount}>{stats.total}</div>
            <div className={styles.statLabel}>Projects delivered</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statCount}>{stats.featuredCount}</div>
            <div className={styles.statLabel}>Featured case studies</div>
          </div>
          <div className={styles.statTile} style={{ flex: 1 }}>
            <div className={styles.statLabel} style={{ marginBottom: 10 }}>
              Project types
            </div>
            <div className={styles.categoryChips}>
              {stats.byCategory.map((c) => (
                <span key={c.label} className={styles.categoryChip}>
                  {c.label} · {c.count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className={styles.examplesBand}>
        <div className={styles.bandInner}>
          <h2 className={styles.h2}>Examples of our work in {stats.name}</h2>
          {stats.featuredProjects.length > 0 ? (
            <div className={styles.exampleGrid}>
              {stats.featuredProjects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  className={styles.exampleCard}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.exampleImage}
                    src={p.photoUrl}
                    alt={p.address}
                  />
                  <div className={styles.exampleMeta}>
                    <div className={styles.exampleTag}>
                      {PROJECT_TYPE_LABELS[p.projectType]}
                    </div>
                    <div className={styles.exampleName}>
                      {p.address}, {p.place.split(",")[0]}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyExamples}>
              No featured case studies in {stats.name} yet — explore the
              full project map instead.
            </div>
          )}
        </div>
      </section>

      <section className={styles.ctaBand}>
        <h2 className={styles.h2}>Have a project in {stats.name}?</h2>
        <p className={styles.ctaLead}>
          We know the area, and we know the planning team. Book a
          conversation and we&apos;ll tell you honestly what&apos;s
          possible.
        </p>
        <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
          Book a Consultation
        </Link>
      </section>
    </>
  );
}
