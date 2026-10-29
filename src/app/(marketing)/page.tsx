import type { Metadata } from "next";
import Link from "next/link";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { getFeaturedProjects } from "@/lib/projects";
import { PROJECT_TYPE_LABELS } from "@/lib/project-labels";
import { getHomePageContent } from "@/lib/home-content";
import { getHomeCategoryTeasers } from "@/lib/category-pages";
import { getFeaturedTestimonial, getReviewStats } from "@/lib/testimonials";
import { getAwardCount } from "@/lib/awards";
import { getProjectCount, withProjectCount } from "@/lib/project-count";
import { EXPLORE_PROJECTS_HREF, ABOUT_HREF, BOOK_CONSULTATION_HREF, TESTIMONIALS_HREF, AWARDS_HREF } from "@/lib/nav";
import styles from "./page.module.css";

// Dynamic DB read now powers the featured list — see the instant=false
// note in work/[slug]/page.tsx for why this flag is needed in dev.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomePageContent();
  return {
    title: {
      absolute:
        content.metaTitle?.trim() ||
        "Architecture ONE — Residential Architects in the East of England",
    },
    description:
      content.metaDescription?.trim() ||
      "Award-winning residential architecture across the East of England — extensions, loft conversions and new builds.",
  };
}

export default async function Home() {
  const [content, featuredProjects, categoryTeasers, testimonial, projectCount, reviewStats, awardCount] =
    await Promise.all([
      getHomePageContent(),
      getFeaturedProjects(),
      getHomeCategoryTeasers(),
      getFeaturedTestimonial(),
      getProjectCount(),
      getReviewStats(),
      getAwardCount(),
    ]);

  return (
    <>
      <section className={styles.hero}>
        <ImagePlaceholder className={styles.bgImage} label={content.heroPhotoLabel} />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <span className={styles.pill}>
            <span className={styles.dot} /> {content.heroPill}
          </span>
          <h1 className={styles.heroHeading}>
            <span className={styles.heroAccent}>
              {withProjectCount(content.heroHeadingAccent, projectCount)}
            </span>{" "}
            {content.heroHeadingRest}
          </h1>
          <p className={styles.heroLead}>{content.heroLead}</p>
          <div className={styles.heroActions}>
            <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
              Book a Consultation →
            </Link>
            <Link href={EXPLORE_PROJECTS_HREF} className={styles.btnGhost}>
              See work near you
            </Link>
          </div>
          <div className={styles.heroStats}>
            Est. {content.statsFoundedYear} &nbsp;·&nbsp;{" "}
            <Link href={TESTIMONIALS_HREF} className={styles.heroStatsLink}>
              ★ {reviewStats.average.toFixed(1)} ({reviewStats.count} review{reviewStats.count === 1 ? "" : "s"})
            </Link>{" "}
            &nbsp;·&nbsp;{" "}
            <Link href={AWARDS_HREF} className={styles.heroStatsLink}>
              {awardCount} award{awardCount === 1 ? "" : "s"} won
            </Link>
          </div>
        </div>
        {testimonial && (
          <div className={styles.floatingQuote}>
            <div className={styles.stars}>{"★".repeat(testimonial.stars)}</div>
            <div className={styles.quoteClamp}>&quot;{testimonial.quote}&quot;</div>
            <Link href={`${TESTIMONIALS_HREF}#testimonial-${testimonial.id}`} className={styles.quoteReadMore}>
              Read more →
            </Link>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>{content.audienceHeading}</h2>
        <p className={styles.lead}>{content.audienceLead}</p>
        <div className={styles.audienceGrid}>
          {categoryTeasers.map((teaser) => (
            <Link key={teaser.category} href={`/${teaser.category}`} className={styles.card}>
              <ImagePlaceholder className={styles.cardImage} label={teaser.photoLabel} />
              <div className={styles.cardBody}>
                <span className={styles.tagCoral}>{teaser.tag}</span>
                <div className={styles.cardTitle}>{teaser.title}</div>
                <p className={styles.cardText}>{teaser.blurb}</p>
                <span className={styles.cardLink}>{teaser.linkLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.mapTeaser}>
        <ImagePlaceholder label="[Map preview — pins across the East of England]" />
        <div className={styles.mapTeaserOverlay}>
          <span className={styles.pill}>
            <span className={styles.dot} /> {withProjectCount(content.mapTeaserPillText, projectCount)}
          </span>
          <div className={styles.mapTeaserTitle}>{content.mapTeaserTitle}</div>
          <p className={styles.mapTeaserLead}>{content.mapTeaserLead}</p>
          <div className={styles.searchRow}>
            <div className={styles.searchInput}>Enter your postcode</div>
            <Link href={EXPLORE_PROJECTS_HREF} className={styles.btnPrimary}>
              Search
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.guideSection}>
        <div className={styles.guideCover}>{content.guideCoverText}</div>
        <div className={styles.guideBody}>
          <span className={styles.tagCoral}>{content.guideTag}</span>
          <h2 className={styles.h2}>{content.guideHeading}</h2>
          <p className={styles.lead} style={{ margin: 0 }}>
            {content.guideLead}
          </p>
        </div>
        <div className={styles.guideForm}>
          <div className={styles.emailInput}>Your email address</div>
          <Link href="/resources" className={styles.btnPrimary}>
            {content.guideButtonLabel}
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeadRow}>
          <div>
            <h2 className={styles.h2} style={{ marginBottom: 4 }}>
              {content.featuredHeading}
            </h2>
            <p className={styles.lead} style={{ margin: 0 }}>
              {withProjectCount(content.featuredLead, projectCount)}
            </p>
          </div>
          <Link href={EXPLORE_PROJECTS_HREF} className={styles.btnOutline}>
            View all on the map
          </Link>
        </div>
        <div className={styles.featuredGrid}>
          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={styles.card}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.cardImage}
                src={project.photoUrl}
                alt={project.address}
              />
              <div className={styles.cardBody}>
                <span className={styles.tagNeutral}>
                  {PROJECT_TYPE_LABELS[project.projectType]}
                </span>
                <div className={styles.cardTitle}>
                  {project.address}, {project.postcode}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.awardsSection}>
        <div className={styles.awardsLabel}>{content.awardsLabel}</div>
        <div className={styles.awardsRow}>
          {content.awardNames.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </section>

      <section className={styles.teamSection}>
        <ImagePlaceholder
          rounded
          className={styles.teamPhoto}
          label="[Photo — the team on site]"
        />
        <div>
          <h2 className={styles.h2}>{content.teamTeaserHeading}</h2>
          <p className={styles.lead} style={{ maxWidth: 620 }}>
            {content.teamTeaserLead}
          </p>
          <Link href={ABOUT_HREF} className={styles.btnOutline}>
            {content.teamTeaserButtonLabel}
          </Link>
        </div>
      </section>

      <section className={styles.ctaSection} id="book">
        <h2 className={styles.h2} style={{ color: "var(--color-white)" }}>
          {content.finalCtaHeading}
        </h2>
        <p className={styles.ctaLead}>{content.finalCtaLead}</p>
        <div className={styles.ctaActions}>
          <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
            Book a Consultation
          </Link>
          <Link href="/contact" className={styles.btnGhostDark}>
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
