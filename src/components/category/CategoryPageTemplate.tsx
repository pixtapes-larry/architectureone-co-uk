import Link from "next/link";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import type { CategoryPageConfig } from "@/lib/category-pages";
import { HOME_HREF, CONTACT_HREF, BOOK_CONSULTATION_HREF } from "@/lib/nav";
import styles from "./CategoryPageTemplate.module.css";

function Kicker({ n, label }: { n: number; label: string }) {
  return (
    <div className={styles.kicker}>
      {String(n).padStart(2, "0")} — {label}
    </div>
  );
}

export default function CategoryPageTemplate({
  config,
}: {
  config: CategoryPageConfig;
}) {
  let n = 0;
  const kIntro = ++n;
  const kSubTypes = ++n;
  const kPlanningRoute = config.planningRoute ? ++n : 0;
  const kPricing = ++n;
  const kFees = config.fees ? ++n : 0;
  const kConsiderations = ++n;

  return (
    <>
      <div className={styles.page}>
        <div className={styles.crumb}>
          <Link href={HOME_HREF}>Home</Link> / Project Categories /{" "}
          {config.crumbLabel}
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
          <Kicker n={kIntro} label="Overview" />
          <h2 className={styles.h2}>{config.introHeading}</h2>
          {config.introParagraphs.map((p, i) => (
            <p key={i} className={styles.lead}>
              {p}
            </p>
          ))}
        </section>
      </div>

      <section className={styles.subTypesBand}>
        <div className={styles.bandInner}>
          <Kicker n={kSubTypes} label="How this typically happens" />
          <h2 className={styles.h2}>{config.subTypesHeading}</h2>
          <div
            className={styles.subTypeGrid}
            style={{ ["--cols" as string]: config.subTypes.length }}
          >
            {config.subTypes.map((sub) => (
              <div key={sub.title} className={styles.card}>
                <ImagePlaceholder
                  className={styles.cardImage}
                  label={sub.photoLabel}
                />
                {sub.routeTag && (
                  <span className={styles.routeTag}>{sub.routeTag}</span>
                )}
                <h3 className={styles.cardTitle}>{sub.title}</h3>
                <ul className={styles.cardList}>
                  {sub.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <Link href={sub.href} className={styles.cardLink}>
                  {sub.learnLabel}
                </Link>
              </div>
            ))}
          </div>
          <div className={styles.footerNote}>
            <p className={styles.lead} style={{ margin: 0 }}>
              {config.subTypesFooterNote}
            </p>
            <Link href={CONTACT_HREF} className={styles.btnPrimary}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <div className={`${styles.page} ${styles.pageNoTop}`}>
        {config.planningRoute && (
          <section className={styles.section}>
            <Kicker n={kPlanningRoute} label="The planning route" />
            <h2 className={styles.h2}>The planning route</h2>
            {config.planningRoute.kind === "text" ? (
              config.planningRoute.paragraphs.map((p, i) => (
                <p key={i} className={styles.lead}>
                  {p}
                </p>
              ))
            ) : (
              <>
                <p className={styles.lead}>{config.planningRoute.lead}</p>
                <div className={styles.considerationsGrid}>
                  {config.planningRoute.items.map((item) => (
                    <div key={item.title} className={styles.checkItem}>
                      <div className={styles.checkItemTitle}>
                        {item.title}
                      </div>
                      <div className={styles.checkItemDesc}>
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        <section className={styles.section}>
          {config.pricing.kind === "packages" ? (
            <>
              <Kicker n={kPricing} label="Pricing" />
              <h2 className={styles.h2}>Our {config.crumbLabel} Packages</h2>
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
              <Kicker n={kPricing} label="Pricing" />
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

        {config.fees && (
          <section className={styles.section}>
            <Kicker n={kFees} label="Other costs to plan for" />
            <h2 className={styles.h2}>{config.fees.heading}</h2>
            <p className={styles.lead}>{config.fees.intro}</p>
            <div className={styles.costList}>
              {config.fees.rows.map((row, i) => (
                <div key={i} className={styles.costRow}>
                  <span>{row.label}</span>
                  <span className={styles.costAmount}>{row.amount}</span>
                </div>
              ))}
            </div>
            <div className={styles.note}>{config.fees.note}</div>
          </section>
        )}

        <section className={styles.section}>
          <Kicker n={kConsiderations} label="Worth knowing" />
          <h2 className={styles.h2}>{config.considerationsHeading}</h2>
          <p className={styles.lead}>
            Most projects are straightforward, but sometimes there are some
            considerations that need to be taken into account.
          </p>
          <div className={styles.considerationsGrid}>
            {config.considerations.map((item) => (
              <div key={item.title} className={styles.checkItem}>
                <div className={styles.checkItemTitle}>{item.title}</div>
                <div className={styles.checkItemDesc}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.closingPanel}>
            {config.closing.kind === "trust-and-services" ? (
              <div className={styles.closingGrid}>
                <div className={styles.trustCard}>
                  <h3>The Architecture ONE Promise</h3>
                  <ul className={styles.trustList}>
                    <li>Clear, fixed-fee architectural quotations</li>
                    <li>Drawings ready in 7–10 working days</li>
                    <li>Personal and local expertise</li>
                    <li>Honest &amp; transparent interactions</li>
                    <li>Trusted by our customers [confirm rating]</li>
                    <li>Protection: professional indemnity [confirm figure]</li>
                  </ul>
                </div>
                <div className={styles.trustCard}>
                  <h3>Our Services</h3>
                  <ul className={styles.trustList}>
                    <li>Planning Application Drawings</li>
                    <li>Building Regulation Drawings</li>
                    <li>Single &amp; Two Storey Extensions</li>
                    <li>Garage &amp; Loft Conversions</li>
                    <li>New Dwellings</li>
                    <li>Permitted Development &amp; HMO</li>
                    <li>Barn Conversions (inc Class Q)</li>
                    <li>Developments</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <h2 className={styles.h2}>More than just drawings</h2>
                <p className={styles.lead}>
                  We support you well beyond the design stage — here&apos;s
                  what else is included along the way.
                </p>
                <ul className={styles.drawingsList}>
                  {config.closing.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href}>{item.label}</Link> —{" "}
                      {item.description}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </div>

      <section className={styles.ctaBand} id="book">
        <h2 className={styles.h2}>Ready to talk about your project?</h2>
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
