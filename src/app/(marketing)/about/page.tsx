import Link from "next/link";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { getSiteSettings } from "@/lib/site-settings";
import { getAboutPageContent, getTeamMembers } from "@/lib/about-content";
import { getAllTestimonials } from "@/lib/testimonials";
import { getProjectCount, withProjectCount } from "@/lib/project-count";
import {
  HOME_HREF,
  ABOUT_SERVICES_HREF,
  BOOK_CONSULTATION_HREF,
} from "@/lib/nav";
import styles from "./page.module.css";

export const instant = false;

export default async function AboutPage() {
  const [settings, content, team, testimonials, projectCount] = await Promise.all([
    getSiteSettings(),
    getAboutPageContent(),
    getTeamMembers(),
    getAllTestimonials(),
    getProjectCount(),
  ]);
  const [lead, ...rest] = team;

  return (
    <>
      <div className={styles.page}>
        <div className={styles.crumb}>
          <Link href={HOME_HREF}>Home</Link> / About
        </div>

        <section className={styles.hero}>
          <ImagePlaceholder
            className={styles.heroImage}
            label={content.heroPhotoLabel}
          />
          <div className={styles.heroShade} />
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>About Architecture ONE</h1>
            <p className={styles.heroTagline}>
              {withProjectCount(content.heroTagline, projectCount)}
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Our story</h2>
          {content.storyParagraphs.map((para, i) => (
            <p key={i} className={styles.lead}>
              {withProjectCount(para, projectCount)}
            </p>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Meet the team</h2>

          {lead && (
            <div className={styles.leadBio}>
              <ImagePlaceholder
                rounded
                className={styles.leadBioPhoto}
                label={lead.photoLabel}
              />
              <div className={styles.leadBioBody}>
                <div className={styles.bioName}>{lead.name}</div>
                <div className={styles.bioRole}>{lead.role}</div>
                {lead.bio.split("\n\n").map((para, i, arr) => (
                  <p
                    key={i}
                    className={styles.lead}
                    style={i === arr.length - 1 ? { marginBottom: 18 } : undefined}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className={styles.teamGrid}>
            {rest.map((member) => (
              <div key={member.id} className={styles.teamCard}>
                <ImagePlaceholder
                  rounded
                  className={styles.teamCardPhoto}
                  label={member.photoLabel}
                />
                <div>
                  <div className={styles.teamCardName}>{member.name}</div>
                  <div className={styles.teamCardRole}>{member.role}</div>
                  <p className={styles.teamCardBio}>{member.bio.split("\n\n")[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.servicesTeaser}>
            <div>
              <h2 className={styles.h2} style={{ marginBottom: 6 }}>
                Services
              </h2>
              <p className={styles.lead} style={{ margin: 0 }}>
                {content.servicesTeaserLead}
              </p>
            </div>
            <Link href={ABOUT_SERVICES_HREF} className={styles.btnPrimary}>
              View all Services →
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.promiseGrid}>
            <div className={styles.trustCard}>
              <h3>The Architecture ONE Promise</h3>
              <ul className={styles.trustList}>
                {settings.promiseBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={styles.h2} style={{ marginBottom: 8 }}>
                {content.reviewsHeading}
              </h2>
              <p className={styles.lead} style={{ marginBottom: 16 }}>
                {content.reviewsLead}
              </p>
              {testimonials.length > 0 ? (
                <div className={styles.testimonialList}>
                  {testimonials.map((t) => (
                    <div key={t.id} className={styles.testimonialCard}>
                      <div className={styles.testimonialStars}>
                        {"★".repeat(t.stars)}
                      </div>
                      <p className={styles.testimonialQuote}>
                        &quot;{t.quote}&quot;
                      </p>
                      {(t.authorName || t.source) && (
                        <div className={styles.testimonialAuthor}>
                          {t.authorName}
                          {t.authorName && t.source && " — "}
                          {t.source && (
                            t.sourceUrl ? (
                              <a href={t.sourceUrl} target="_blank" rel="noreferrer" className={styles.sourceLink}>
                                via {t.source}
                              </a>
                            ) : (
                              <span>via {t.source}</span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.testimonialPlaceholder}>
                  {content.reviewsPlaceholderNote}
                </div>
              )}
              {settings.googleReviewsUrl && (
                <a
                  href={settings.googleReviewsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.googleLink}
                >
                  See all reviews on Google →
                </a>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className={styles.ctaBand} id="book">
        <h2 className={styles.h2}>{content.finalCtaHeading}</h2>
        <p className={styles.ctaLead}>{content.finalCtaLead}</p>
        <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
          Book a Consultation
        </Link>
      </section>
    </>
  );
}
