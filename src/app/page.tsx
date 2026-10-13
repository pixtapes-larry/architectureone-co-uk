import Link from "next/link";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { MOCK_FEATURED_PROJECTS } from "@/lib/mock-projects";
import { PROJECT_TYPE_LABELS } from "@/lib/project-labels";
import { EXPLORE_PROJECTS_HREF, ABOUT_HREF, BOOK_CONSULTATION_HREF } from "@/lib/nav";
import styles from "./page.module.css";

// TODO: hero headline/subheadline are draft copy, not yet signed off.
export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <ImagePlaceholder
          className={styles.bgImage}
          label="[Hero photo — a recent project, full-bleed]"
        />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <span className={styles.pill}>
            <span className={styles.dot} /> Award-winning architecture practice
          </span>
          <h1 className={styles.heroHeading}>
            <span className={styles.heroAccent}>850+ projects</span> delivered
            across the East of England
          </h1>
          <p className={styles.heroLead}>
            Extensions, loft conversions and new builds — designed and
            delivered locally, from first sketch to signed-off plans.
          </p>
          <div className={styles.heroActions}>
            <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
              Book a Consultation →
            </Link>
            <Link href={EXPLORE_PROJECTS_HREF} className={styles.btnGhost}>
              See work near you
            </Link>
          </div>
          <div className={styles.heroStats}>
            Est. 2015 &nbsp;·&nbsp; ★ 4.9 (28 reviews) &nbsp;·&nbsp; 3 awards
            won
          </div>
        </div>
        <div className={styles.floatingQuote}>
          <div className={styles.stars}>★★★★★</div>
          <div>
            &quot;An exceptional job securing planning permission for our
            Grade II listed house.&quot;
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Which project sounds like yours?</h2>
        <p className={styles.lead}>
          Whatever stage your project is at, there&apos;s a clear path
          forward.
        </p>
        <div className={styles.audienceGrid}>
          <Link href="/permitted-development" className={styles.card}>
            <ImagePlaceholder
              className={styles.cardImage}
              label="[Permitted Development photo]"
            />
            <div className={styles.cardBody}>
              <span className={styles.tagCoral}>From £1,199</span>
              <div className={styles.cardTitle}>
                Small Extensions &amp; Permitted Development
              </div>
              <p className={styles.cardText}>
                Three fixed-scope packages with guide pricing.
              </p>
              <span className={styles.cardLink}>View packages →</span>
            </div>
          </Link>
          <Link href="/large-extensions" className={styles.card}>
            <ImagePlaceholder
              className={styles.cardImage}
              label="[Large Extensions photo]"
            />
            <div className={styles.cardBody}>
              <span className={styles.tagNeutral}>Design-led</span>
              <div className={styles.cardTitle}>
                Loft Conversions &amp; Large Extensions
              </div>
              <p className={styles.cardText}>
                Bigger transformations, start to sign-off.
              </p>
              <span className={styles.cardLink}>See examples →</span>
            </div>
          </Link>
          <Link href="/new-builds-developments" className={styles.card}>
            <ImagePlaceholder
              className={styles.cardImage}
              label="[New Builds & Developments photo]"
            />
            <div className={styles.cardBody}>
              <span className={styles.tagNeutral}>Incl. Class Q &amp; barns</span>
              <div className={styles.cardTitle}>New Builds &amp; Developments</div>
              <p className={styles.cardText}>
                From feasibility through to consent.
              </p>
              <span className={styles.cardLink}>See examples →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className={styles.mapTeaser}>
        <ImagePlaceholder label="[Map preview — pins across the East of England]" />
        <div className={styles.mapTeaserOverlay}>
          <span className={styles.pill}>
            <span className={styles.dot} /> 850 projects, mapped
          </span>
          <div className={styles.mapTeaserTitle}>Discover your next project</div>
          <p className={styles.mapTeaserLead}>
            Enter your postcode to see Architecture ONE&apos;s work near you.
          </p>
          <div className={styles.searchRow}>
            <div className={styles.searchInput}>Enter your postcode</div>
            <Link href={EXPLORE_PROJECTS_HREF} className={styles.btnPrimary}>
              Search
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.guideSection}>
        <div className={styles.guideCover}>
          A Homeowner&apos;s Guide to Extending
        </div>
        <div className={styles.guideBody}>
          <span className={styles.tagCoral}>Free download</span>
          <h2 className={styles.h2}>A Homeowner&apos;s Guide to Extending</h2>
          <p className={styles.lead} style={{ margin: 0 }}>
            Permitted development rules, budgets, and what to expect at each
            stage — the same guide handed out after every consultation.
          </p>
        </div>
        <div className={styles.guideForm}>
          <div className={styles.emailInput}>Your email address</div>
          <Link href="/resources" className={styles.btnPrimary}>
            Download the free guide
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeadRow}>
          <div>
            <h2 className={styles.h2} style={{ marginBottom: 4 }}>
              Featured projects
            </h2>
            <p className={styles.lead} style={{ margin: 0 }}>
              A sample of the 850 — explore all of them on the map.
            </p>
          </div>
          <Link href={EXPLORE_PROJECTS_HREF} className={styles.btnOutline}>
            View all on the map
          </Link>
        </div>
        <div className={styles.featuredGrid}>
          {MOCK_FEATURED_PROJECTS.map((project) => (
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
        <div className={styles.awardsLabel}>Multi-award-winning</div>
        <div className={styles.awardsRow}>
          <span>LABC</span>
          <span>FLOURISH</span>
          <span>BEST OF IPSWICH</span>
        </div>
      </section>

      <section className={styles.teamSection}>
        <ImagePlaceholder
          rounded
          className={styles.teamPhoto}
          label="[Photo — the team on site]"
        />
        <div>
          <h2 className={styles.h2}>Meet the team behind Architecture ONE</h2>
          <p className={styles.lead} style={{ maxWidth: 620 }}>
            A first-person introduction — how long in Suffolk, why this work,
            what matters on a project. Named relationships with Babergh, Mid
            Suffolk and Ipswich Borough planning teams.
          </p>
          <Link href={ABOUT_HREF} className={styles.btnOutline}>
            ▶ Watch a short introduction
          </Link>
        </div>
      </section>

      <section className={styles.ctaSection} id="book">
        <h2 className={styles.h2} style={{ color: "var(--color-white)" }}>
          Ready to talk about your project?
        </h2>
        <p className={styles.ctaLead}>
          Book a paid initial consultation — you&apos;ll leave with a written
          brief covering scope, approach and indicative costs.
        </p>
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
