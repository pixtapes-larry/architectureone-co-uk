import Link from "next/link";
import type { ProjectMapSummary } from "@/lib/mock-projects";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import {
  PROJECT_TYPE_LABELS,
  PROJECT_TYPE_ROUTES,
  PROJECT_TYPE_CATEGORY,
  PLANNING_TYPE_LABELS,
} from "@/lib/project-labels";
import { HOME_HREF, BOOK_CONSULTATION_HREF } from "@/lib/nav";
import ProjectMiniMapLoader from "./ProjectMiniMapLoader";
import styles from "./FeaturedProjectTemplate.module.css";

function yearFromCompleted(completed: string): string {
  const match = completed.match(/\d{4}/);
  return match ? match[0] : "—";
}

function serviceLabel(service: string) {
  return service
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function BeforeAfterPair({
  heading,
  before,
  after,
}: {
  heading: string;
  before?: string;
  after?: string;
}) {
  if (!before && !after) return null;
  return (
    <>
      <div className={styles.h2}>{heading}</div>
      <div className={styles.beforeAfterGrid}>
        {before && (
          <div>
            <div className={styles.imageCaption}>Before</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.beforeAfterImage} src={before} alt="" />
          </div>
        )}
        {after && (
          <div>
            <div className={styles.imageCaption}>After</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.beforeAfterImage} src={after} alt="" />
          </div>
        )}
      </div>
    </>
  );
}

export default function FeaturedProjectTemplate({
  project,
}: {
  project: ProjectMapSummary;
}) {
  const typeLabel = PROJECT_TYPE_LABELS[project.projectType];
  const typeHref = PROJECT_TYPE_ROUTES[project.projectType];
  const category = PROJECT_TYPE_CATEGORY[project.projectType];

  const related = MOCK_PROJECTS.filter(
    (p) =>
      p.featured &&
      p.slug &&
      p.slug !== project.slug &&
      PROJECT_TYPE_CATEGORY[p.projectType] === category,
  ).slice(0, 3);

  const beforePhotos = project.photos?.filter((p) => p.isBefore) ?? [];
  const afterPhotos = project.photos?.filter((p) => !p.isBefore) ?? [];

  return (
    <>
      <div className={styles.page}>
        <div className={styles.crumb}>
          <Link href={HOME_HREF}>Home</Link> /{" "}
          <Link href={typeHref}>{typeLabel}</Link> / {project.address}
        </div>

        <div className={styles.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.heroImage}
            src={project.photoUrl}
            alt={project.address}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className={styles.heroTags}>
            <span className={styles.heroTagDark}>{typeLabel}</span>
            <span className={styles.heroTagLight}>
              {project.place.split(",")[0]} · {project.postcode}
            </span>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <h1 className={styles.title}>{project.address}</h1>

            {(beforePhotos.length > 0 || afterPhotos.length > 0) && (
              <>
                {beforePhotos.length > 0 && (
                  <>
                    <div className={styles.h2}>Before</div>
                    <div className={styles.photoGrid}>
                      {beforePhotos.map((p, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          className={styles.photoThumb}
                          src={p.url}
                          alt={p.caption ?? ""}
                        />
                      ))}
                    </div>
                  </>
                )}
                {afterPhotos.length > 0 && (
                  <>
                    <div className={styles.h2}>After</div>
                    <div className={styles.photoGrid}>
                      {afterPhotos.map((p, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          className={styles.photoThumb}
                          src={p.url}
                          alt={p.caption ?? ""}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            <div className={styles.h2}>About this project</div>
            {project.fullDescription ? (
              project.fullDescription
                .split("\n\n")
                .map((para, i) => (
                  <p key={i} className={styles.lead}>
                    {para}
                  </p>
                ))
            ) : (
              <p className={styles.lead}>{project.description}</p>
            )}
            {!project.fullDescription && (
              <p className={styles.pendingNote}>
                Full case study write-up pending — coming once this
                project&apos;s archive data is confirmed.
              </p>
            )}

            <BeforeAfterPair
              heading="Floor Plan"
              before={project.floorplanBeforeImage}
              after={project.floorplanAfterImage}
            />

            <BeforeAfterPair
              heading="Elevations"
              before={project.elevationBeforeImage}
              after={project.elevationAfterImage}
            />

            {project.teamNote && (
              <div className={styles.noteCard}>
                <div className={styles.noteLabel}>A note from the team</div>
                <div className={styles.noteText}>
                  &quot;{project.teamNote}&quot;
                </div>
              </div>
            )}
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Project details</div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Type</span>
                <span className={styles.detailValue}>{typeLabel}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>
                  {project.place.split(",")[0]}, {project.postcode}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Local Authority</span>
                <span className={styles.detailValue}>
                  {project.localAuthority}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Planning Type</span>
                <span className={styles.detailValue}>
                  {PLANNING_TYPE_LABELS[project.planningType]}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Builder</span>
                <span className={styles.detailValue}>
                  {project.constructionCompany ?? "—"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Awards</span>
                <span className={styles.detailValue}>
                  {project.awards && project.awards.length > 0
                    ? project.awards
                        .map((a) => `${a.name} (${a.year})`)
                        .join(", ")
                    : "—"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Year</span>
                <span className={styles.detailValue}>
                  {project.year ?? yearFromCompleted(project.completed)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue}>
                  {project.status ?? "Completed"}
                </span>
              </div>
            </div>

            {project.services && project.services.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardLabel}>Services Delivered</div>
                <ul className={styles.servicesList}>
                  {project.services.map((service) => (
                    <li key={service}>{serviceLabel(service)}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
              <ProjectMiniMapLoader
                latitude={project.latitude}
                longitude={project.longitude}
                label={project.address}
              />
            </div>

            <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.relatedBand}>
          <div className={styles.relatedInner}>
            <div className={styles.h2}>Related projects</div>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  className={styles.relatedCard}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.relatedImage}
                    src={p.photoUrl}
                    alt={p.address}
                    style={{ width: "100%", objectFit: "cover" }}
                  />
                  <div className={styles.relatedMeta}>
                    <div className={styles.relatedTag}>
                      {PROJECT_TYPE_LABELS[p.projectType]}
                    </div>
                    <div className={styles.relatedName}>
                      {p.address}, {p.place.split(",")[0]}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
