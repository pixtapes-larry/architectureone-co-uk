import { prisma } from "@/lib/prisma";
import styles from "./dashboard.module.css";

export const instant = false;

export default async function AdminDashboardPage() {
  const [totalProjects, featuredCount, authorityCount] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { featured: true } }),
    prisma.project
      .findMany({ distinct: ["localAuthority"], select: { localAuthority: true } })
      .then((rows) => rows.length),
  ]);

  return (
    <>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.statsRow}>
        <div className={styles.statTile}>
          <div className={styles.statCount}>{totalProjects}</div>
          <div className={styles.statLabel}>Projects in DB</div>
        </div>
        <div className={styles.statTile}>
          <div className={styles.statCount}>{featuredCount}</div>
          <div className={styles.statLabel}>Featured case studies</div>
        </div>
        <div className={styles.statTile}>
          <div className={styles.statCount}>{authorityCount}</div>
          <div className={styles.statLabel}>Local authorities covered</div>
        </div>
      </div>

      <div className={styles.comingSoon}>
        This is the Phase 1 shell — login and session handling only.
        Projects, Packages and Settings CRUD screens land in Phase 2+.
      </div>
    </>
  );
}
