import Link from "next/link";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import {
  SUB_TYPE_CLOSING,
  subTypeCategoryHref,
  subTypeCategoryLabel,
  type SubTypePageConfig,
} from "@/lib/sub-type-pages";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import { PROJECT_TYPE_LABELS } from "@/lib/project-labels";
import { HOME_HREF, BOOK_CONSULTATION_HREF, ABOUT_SERVICES_HREF } from "@/lib/nav";
import styles from "./SubTypePageTemplate.module.css";

export default function SubTypePageTemplate({
  config,
}: {
  config: SubTypePageConfig;
}) {
  const categoryHref = subTypeCategoryHref(config);
  const categoryLabel = subTypeCategoryLabel(config);
  const heroTitle = PROJECT_TYPE_LABELS[config.projectType];
  const examples = MOCK_PROJECTS.filter(
    (p) => p.projectType === config.projectType,
  ).slice(0, 4);

  return (
    <>
      <div className={styles.page}>
        <div className={styles.crumb}>
          <Link href={HOME_HREF}>Home</Link> /{" "}
          <Link href={categoryHref}>{categoryLabel}</Link> / {heroTitle}
        </div>

        <section className={styles.hero}>
          <ImagePlaceholder
            className={styles.heroImage}
            label={config.heroPhotoLabel}
          />
          <div className={styles.heroShade} />
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>{config.heroTitle}</h1>
            <p className={styles.heroTagline}>{config.heroTagline}</p>
            <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
              Book a Consultation
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>About this project type</h2>
          {config.aboutParagraphs.map((p, i) => (
            <p key={i} className={styles.lead}>
              {p}
            </p>
          ))}
        </section>
      </div>

      <section className={styles.examplesBand}>
        <div className={styles.bandInner}>
          <h2 className={styles.h2}>Examples of our work</h2>
          <div className={styles.dynamicFlag}>
            ⟳ DYNAMIC — pulled from Featured Projects, filtered to this
            project type
          </div>
          {examples.length > 0 ? (
            <div className={styles.exampleGrid}>
              {examples.map((p, i) => (
                <Link
                  key={i}
                  href={p.featured && p.slug ? `/work/${p.slug}` : categoryHref}
                  className={styles.exampleCard}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.exampleImage}
                    src={p.photoUrl}
                    alt={p.address}
                    style={{ width: "100%", objectFit: "cover" }}
                  />
                  <div className={styles.exampleMeta}>
                    <div className={styles.exampleTag}>{p.place}</div>
                    <div className={styles.exampleName}>{p.address}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyExamples}>
              We&apos;re adding real examples of this project type as our
              project archive comes online — in the meantime,{" "}
              <Link href="/projects">explore the full map</Link>.
            </div>
          )}
        </div>
      </section>

      <div className={`${styles.page} ${styles.pageNoTop}`}>
        <section className={styles.section}>
          <h2 className={styles.h2}>{config.planningHeading}</h2>
          <div className={styles.cardGrid}>
            {config.planningCards.map((card) => (
              <div key={card.title} className={styles.card}>
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardDesc}>{card.description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>How it typically works</h2>
          <div className={styles.steps}>
            {config.steps.map((step, i) => (
              <div key={step.title} className={styles.step}>
                <div className={styles.stepNumber}>{i + 1}</div>
                <div>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepDesc}>{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          {config.pricing.kind === "packages" ? (
            <>
              <h2 className={styles.h2}>Our {heroTitle} Packages</h2>
              <p className={styles.lead}>
                Summary only on this page — full scope-of-work lives on each
                package&apos;s own page.
              </p>
              <div className={styles.pkgGrid}>
                {config.pricing.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`${styles.pkg} ${tier.featured ? styles.pkgFeatured : ""}`}
                  >
                    <div className={styles.pkgName}>{tier.name}</div>
                    <div className={styles.pkgPrice}>{tier.price}</div>
                    <div className={styles.pkgVat}>inc. VAT</div>
                    <ul className={styles.pkgList}>
                      {tier.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                    <Link
                      href="#"
                      className={
                        tier.featured ? styles.btnPrimary : styles.btnOutline
                      }
                    >
                      Learn more →
                    </Link>
                  </div>
                ))}
              </div>
              <div className={styles.note}>{config.pricing.note}</div>
            </>
          ) : (
            <>
              <h2 className={styles.h2}>How we price this work</h2>
              <p className={styles.lead}>{config.pricing.lead}</p>
              <Link
                href={BOOK_CONSULTATION_HREF}
                className={styles.btnPrimary}
              >
                Book a Consultation for a tailored proposal
              </Link>
            </>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{SUB_TYPE_CLOSING.heading}</h2>
          <p className={styles.lead}>{SUB_TYPE_CLOSING.lead}</p>
          <ul className={styles.drawingsList}>
            {SUB_TYPE_CLOSING.items.map((item) => (
              <li key={item.label}>
                <Link href={ABOUT_SERVICES_HREF}>
                  <span>{item.label}</span>
                </Link>{" "}
                — {item.description}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className={styles.ctaBand} id="book">
        <h2 className={styles.h2}>{config.ctaQuestion}</h2>
        <p className={styles.ctaLead}>
          Book a conversation with us — we&apos;ll help you work out
          what&apos;s possible, honestly, before you commit to anything.
        </p>
        <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
          Book a Consultation
        </Link>
      </section>
    </>
  );
}
