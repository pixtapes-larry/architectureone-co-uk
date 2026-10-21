import Link from "next/link";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { ARCHITECTURE_ONE_PROMISE } from "@/lib/site-content";
import {
  HOME_HREF,
  ABOUT_SERVICES_HREF,
  BOOK_CONSULTATION_HREF,
} from "@/lib/nav";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <>
      <div className={styles.page}>
        <div className={styles.crumb}>
          <Link href={HOME_HREF}>Home</Link> / About
        </div>

        <section className={styles.hero}>
          <ImagePlaceholder
            className={styles.heroImage}
            label="[Hero photo — Jonathon or the team on site]"
          />
          <div className={styles.heroShade} />
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>About Architecture ONE</h1>
            <p className={styles.heroTagline}>
              Local, personal, and 850+ projects delivered across the East
              of England.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Our story</h2>
          <p className={styles.lead}>
            Architecture ONE was founded in 2015 by Jonathon
            Bensley-Byham, based in the East of England — bringing
            international experience from London, Sydney, Dubai and Doha
            back to a genuinely local practice.
          </p>
          <p className={styles.lead}>
            Eleven years on, we&apos;re one of the most prolific
            architectural practices in the area, with over 850 projects
            delivered across Suffolk and Essex — each one grounded in a
            genuine relationship with the people who live there. That
            local knowledge, of the councils, the conservation areas, the
            quirks of a particular street, is what lets us give honest,
            personable advice from the very first conversation.
          </p>
          <p className={styles.lead}>
            We punch above our weight, too — picking up regional and
            national awards for both design and building control along
            the way. But our heads aren&apos;t in the clouds — we&apos;re
            still a practice built on people, with design, planning and
            construction oversight all under one roof, so you only ever
            have one number to call.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Meet the team</h2>

          <div className={styles.leadBio}>
            <ImagePlaceholder
              rounded
              className={styles.leadBioPhoto}
              label="[Roundel photo — Jonathon]"
            />
            <div className={styles.leadBioBody}>
              <div className={styles.bioName}>
                Jonathon Bensley-Byham
              </div>
              <div className={styles.bioRole}>Project Director</div>
              <p className={styles.lead}>
                After years working in large practices abroad, Jonathon
                moved back home to England in 2015 and set up
                Architecture ONE — wanting a more hands-on approach to
                the design and build process. His multi-disciplinary
                background means he can help people see the real
                potential in their space, and for Jonathon nothing beats
                the satisfaction of helping a client visualise that
                potential, then working alongside them to see it
                actually come to life. The problem-solving along the
                way, working a tricky site or a stubborn planning
                constraint until it clicks, is still the part he loves
                most, more than a decade in.
              </p>
              <p className={styles.lead} style={{ marginBottom: 18 }}>
                He&apos;s spent as much time on site in boots as at a
                drawing board, so he designs knowing what something
                actually costs to build, not just to draw — which is
                also why planners, builders and engineers across the
                East of England keep coming back to him. A modest rear
                extension gets exactly the same care as a multi-house
                development. Off the clock, he&apos;s usually got his
                head under a bonnet, fixing something that probably
                didn&apos;t need fixing yet.
              </p>
            </div>
          </div>

          <div className={styles.teamGrid}>
            <div className={styles.teamCard}>
              <ImagePlaceholder
                rounded
                className={styles.teamCardPhoto}
                label="[Tenielle]"
              />
              <div>
                <div className={styles.teamCardName}>
                  Tenielle Bensley-Byham
                </div>
                <div className={styles.teamCardRole}>Practice Manager</div>
                <p className={styles.teamCardBio}>
                  A partner at Architecture ONE, Tenielle played a key
                  role in setting up the studio in 2015 and brings her
                  extensive business experience and meticulous attention
                  to detail to both the architecture and the business
                  side.
                </p>
              </div>
            </div>
            <div className={styles.teamCard}>
              <ImagePlaceholder
                rounded
                className={styles.teamCardPhoto}
                label="[Luke]"
              />
              <div>
                <div className={styles.teamCardName}>
                  Luke MacKay-Morris
                </div>
                <div className={styles.teamCardRole}>
                  Barn Conversion / Self Build Consultant
                </div>
                <p className={styles.teamCardBio}>
                  Luke first worked alongside Architecture ONE as a
                  client, on his own Class Q barn conversion — a project
                  that won the LABC national award for Best Conversion
                  to a Residential Dwelling in 2023. He now supports
                  clients on the niche legislation, ecology and
                  biodiversity side of conversions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.servicesTeaser}>
            <div>
              <h2 className={styles.h2} style={{ marginBottom: 6 }}>
                Services
              </h2>
              <p className={styles.lead} style={{ margin: 0 }}>
                From first sketch to a finished build — the full range
                of what we do, start to finish.
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
                {ARCHITECTURE_ONE_PROMISE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={styles.h2} style={{ marginBottom: 8 }}>
                What our clients say
              </h2>
              <p className={styles.lead} style={{ marginBottom: 16 }}>
                A sample of our Google reviews — see them all on our
                profile.
              </p>
              <div className={styles.testimonialPlaceholder}>
                Real client reviews are coming once pulled from our
                Google Business Profile — not shown here yet so nothing
                is fabricated in the meantime.
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.ctaBand} id="book">
        <h2 className={styles.h2}>Ready to talk about your project?</h2>
        <p className={styles.ctaLead}>
          Book a paid initial consultation — you&apos;ll leave with a
          written brief covering scope, approach and indicative costs.
        </p>
        <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
          Book a Consultation
        </Link>
      </section>
    </>
  );
}
