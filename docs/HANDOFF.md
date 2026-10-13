# Architecture ONE Website Rebuild — handoff

Written 2026-10-11 by Claude (Sonnet 5), from a cloud session (desktop app,
linked to this computer via the device bridge — no local shell access), at
Luke's request, for a Claude Code session running directly on this machine
to pick up.

The point of this file: this project has **no git repo, no CHANGELOG, no
CLAUDE.md yet** — it's the earliest possible stage. What exists right now
is a brief, a wireframe artifact, and one unversioned HTML prototype. This
file is the only thing tying those together until a real project structure
exists.

---

## What this project is

**Architecture ONE** — an award-winning architecture practice in Hadleigh,
Suffolk, with 850+ delivered projects across East Anglia. Luke (via **Black
Pheasant Consulting**) is rebuilding their website, currently
`architectureone.co.uk`, which runs on a legacy CMS and does none of the
trust-building/SEO work that 850-project history could do.

Two source documents exist, neither in this folder yet:

### 1. The brief (PDF)
`Architecture1 Website Rebuild — Brief & Plan`, Oct 8 2026, 10 pages,
prepared by Black Pheasant for Architecture ONE. Luke has the file locally
(it was uploaded to a chat, not saved to disk here — ask Luke for it, or
re-export the brief if he still has the source).

**Problem statement:** the current site undersells a huge, provable local
track record; 850 real projects sit entirely offline; the homepage has a
spammy repeated-keyword banner; no productized pricing; thin review volume
vs. a local competitor (28 vs 42 reviews, both ~5★).

**Proposal — 8 elements** (full reasoning + competitive analysis for each
is in the brief itself):

1. **Three audiences, three front doors** — split nav/landing pages: Small
   Extensions & PD / Loft Conversions & Large Extensions / New Builds &
   Developments (incl. Class Q & barns). Each targets a distinct search
   intent and buyer type.
2. **Productized small-extension/PD tiers** — three named packages,
   *working guide prices only, not locked*: Starter £1,199 / Standard
   £1,799 / Extended £2,499. Needs war-gaming against real project
   experience + a tight scope-of-work doc per tier before anything goes
   public.
3. **The interactive project map** — ~850 geocoded pins, ~100 "featured"
   clickable through to case studies, postcode search with distance badge
   ("0.4 miles away"), filterable by service type, marker clustering. **The
   single biggest lever in the brief** — the trust signal no competitor
   can replicate quickly.
4. **Case study pages & local SEO** — each of the ~100 featured projects
   gets its own page: human-readable URL (e.g.
   `/work/ip7-hadleigh-loft-conversion`), type/area/postcode, narrative,
   6–12 images, schema.org structured data, cross-links.
5. **Site-wide SEO / AI-era search** — local-area landing pages (Hadleigh,
   Ipswich, Colchester, Bury St Edmunds, Sudbury, Chelmsford/Essex
   corridor), technical SEO, OpenGraph everywhere, content written to be
   quotable by AI answer engines (schema.org `LocalBusiness`/`FAQPage`).
6. **Integrations & measuring success** — live Google Reviews via Places
   API, GA4/Search Console, postcode-search usage as a demand signal,
   enquiry→client conversion tracked by source page and tier.
7. **Put a face to the practice** — real "meet the architect" presence,
   named relationships with Babergh/Mid Suffolk/Ipswich Borough planning
   authorities, short intro video, first-person copy throughout.
8. **Leave-behind resources** — downloadable guide PDFs ("A Homeowner's
   Guide to Extending in Suffolk" etc.) as email-gated lead magnets and
   physical leave-behinds.

**Technical approach decided in the brief:**
- Custom-built site, bespoke secure admin back end — *not* a third-party
  headless CMS.
- Front end: server-rendered, brief names **Next.js** for speed + clean SEO.
- Map layer: **Leaflet + OpenStreetMap** (free, no usage billing risk), or
  Mapbox GL if nicer styling is worth the small cost.
- Data bootstrap: Black Pheasant + AI tooling scrape/categorise
  Architecture ONE's existing project folders into a structured database
  (location, type, photos, dates) as a first pass; both parties then
  review/curate into the ~100 featured case studies + the fuller 850-pin
  dataset.
- UX: primary CTA everywhere is **Book a Consultation** (a paid initial
  consultation, client gets a written brief back afterwards) — a standard
  contact form stays available but is deliberately secondary. Mobile-first
  (postcode/map search is an on-the-go behaviour).

**Open/unresolved per the brief:** tier pricing + scope-of-work are
*working figures only*, not locked. No hard deadline — "initial proposal
stage." Budget not a current constraint. Photo/address usage rights
assumed yes for now, revisit per-project if anything sensitive surfaces.

**Competitive analysis (Appendix)** covers three real local one-person
competitors: Daking Designs (closest working model of this plan, already
live, but shallow case-study library), Box Valley Architectural Design
(strongest photography/widest services, but zero content behind the
images), Embrace Architecture (closest direct competitor, based in
Hadleigh itself, upmarket/sustainability angle, but same depth gap as Box
Valley). Full detail in the brief PDF.

### 2. The wireframes (Claude artifact — Design canvas)
**URL:** `https://claude.ai/artifact/6vVfwfDa2bqX8LqqZnXPPW`
Title: "Architecture ONE Wireframes (Black Pheasant)". Lives on claude.ai,
tied to Luke's account — reachable from any machine logged in, nothing to
copy. A Claude session with the Artifact tool can read it directly via
that URL, or find it via `Artifact action: "list"`.

**Important — environment-specific gotcha:** reading this from certain
sandboxed cloud sessions fails with
`ENOTFOUND ...frame.claudeusercontent.com` — the sandbox's outbound
HTTPS allowlist doesn't cover the artifact-content domain. This is NOT a
property of the artifact; it's a networking restriction of some
environments. A Claude Code session running directly on this machine,
with normal internet access, should be able to read it fine via the
Artifact tool.

**Contents — 12 artboards**, structured as 3 pages × 2 fidelity passes ×
2 viewports (desktop/mobile): **Home**, **Interactive Map**, **Case
Study** — each with a lower-fidelity wireframe pass and a high-fidelity
"Visual Design" pass.

Visual design system (read directly from the high-fidelity artboards):
- **Font:** Montserrat (400/500/600/700/800), loaded via Google Fonts.
- **Palette:** ink `#14141B` text, white `#FFFFFF` panels, accent coral-red
  `#E63950` (dark `#C62A40`, tint `#FDEAEC`), muted grey `#7A7A82`, grey pin
  `#9CA3AF`/`#B9B9BF`, warm map background `#F7F4EE`.
- **Signature shape:** an asymmetric rounded corner — `border-radius: 4px
  18px 18px 18px` (one sharp corner, three round) — used consistently on
  cards, search boxes, map popups, legend, the free-guide tile. This
  recurs across all three pages; it's the single most distinctive visual
  signature of the design and worth preserving exactly.
- **Buttons:** pill-shaped (`border-radius: 999px`), primary = solid
  coral with a soft coral shadow, secondary = white/outline.
- **Home page:** full-bleed hero (left-aligned dark gradient over photo),
  "850+ projects delivered" headline, floating testimonial card
  bottom-right of hero, est./rating/awards line, three audience cards
  (image + price tag + CTA), a map-teaser banner with postcode search
  inset, free-guide section (dark tile + email capture), award logo row,
  "meet the team" (circular photo + video CTA), dark CTA band, footer with
  address/phone.
- **Map page:** the map genuinely *is* the hero — full-bleed, header bar
  overlaid, filter chips top-left (All / Small Ext & PD / Loft & Large
  Ext / New Builds & Barns), a large "850+" ghost numeral low-opacity in
  the background, centred postcode search card over the map, pin tooltip
  (thumbnail + type tag + mileage + "View case study" link) on a sample
  pin, legend (featured vs. regular pin) + zoom controls bottom corners,
  map attribution line, results strip along the bottom that's meant to
  populate after a search.
- **Case study page:** breadcrumb, full-width hero image with type/location
  tags overlaid bottom-left, 3-image gallery grid, "The brief" / "The
  outcome" copy sections (currently bracketed placeholders — real content
  comes from the data bootstrap), a coral pull-quote card ("a note from
  the team"), a sidebar with project-details table + "what we delivered"
  checklist + a small map-pin thumbnail, related-projects grid, CTA
  footer.

The low-fidelity wireframe artboards (`Main.dc.html`, `MapDesktop.dc.html`,
`CaseStudyDesktop.dc.html`, and their `*Mobile.dc.html` counterparts) were
not read in full detail this session — only the file list and the
high-fidelity "Design" boards were read closely. Worth a pass if the
layout logic (not just the visual skin) needs checking.

---

## What already exists on disk

### `C:\_claude\localtest\` — a working prototype, NOT in this folder
A standalone, un-versioned static HTML/Leaflet prototype of **just the
map page** (proposal item 3), titled "Architecture ONE Project Map — live
demo" in its `<title>`. Built before the wireframes above, so it's
functionally similar (postcode-style search card, filter chips, legend,
results strip) but visually plain — none of the high-fidelity design
system (Montserrat, coral palette, asymmetric-rounded-corner shape
language) has been applied to it yet.

- `index.html` — the live demo page (Leaflet.js, OpenStreetMap tiles)
- `assets/` — 14 real property photos (`p1-station-road.jpg` through
  `p14-squirrellsmill.jpg`), plus `logo.png` and `default.jpg`. Property
  names visible from filenames: Station Road, Pheasant Barn, Elmsett,
  Capel, Layham, Christchurch, Landsdown, Orchard, Kesgrave, Elmhouse,
  Tintagel, Harrowcross, Oaklands, Squirrellsmill.

A zip at `C:\_claude\architecture-one-live-map-demo.zip` is just an Oct 8
snapshot of this same folder — `localtest\index.html` (Oct 10) is newer.

**Not yet started:** no Home page, no Case Study page/template, no real
850-project dataset (the 14 sample properties are placeholder/demo data,
not the real project archive), no git repo, no admin back end, no Next.js
scaffold. This is genuinely early-stage — a brief + a design + one
single-page prototype.

### This folder — `C:\_claude\architectureone.co.uk\`
Empty. Intended (per Luke, this session) as the home for the real project
once work starts here — presumably named to match the eventual live
domain, the same pattern as the `thalloeducation.co.uk` folder elsewhere
in `C:\_claude`.

---

## Suggested next steps for whoever (human or Claude) picks this up

1. **Read the wireframes artifact directly** — `Artifact action: "read"`,
   url `https://claude.ai/artifact/6vVfwfDa2bqX8LqqZnXPPW` — this session
   could only reach it via a long detour (list → read each file) because
   of a sandbox networking gap; a normal session should just be able to
   open it. Also worth reading the 6 low-fidelity artboards not yet
   reviewed (`Main.dc.html`, `MapDesktop.dc.html`,
   `CaseStudyDesktop.dc.html`, `HomeMobile.dc.html`, `MapMobile.dc.html`,
   `CaseStudyMobile.dc.html`) for layout/structural intent, separate from
   the visual skin.
2. **Get the brief PDF onto disk** — ask Luke to re-share
   `Architecture1_Website_Rebuild___Brief__Plan.pdf`; this handoff
   summarizes it but the full text (especially the Appendix's
   per-competitor detail) is worth having verbatim.
3. **Decide the real stack and scaffold it** — brief recommends Next.js;
   nothing's been scaffolded yet. A `git init` + basic structure here
   would turn this into a normal project (the ChaseCard project elsewhere
   in `C:\_claude` is a model for what a mature CLAUDE.md/CHANGELOG setup
   looks like, if that pattern is wanted here too).
4. **Decide what happens to `localtest\`** — fold its prototype + the 14
   sample photos into the new project as the first draft of the map page,
   or treat it as throwaway and rebuild clean from the wireframes. Its
   Leaflet logic (postcode-style search, filtering, clustering groundwork)
   is probably worth keeping even if the visual chrome gets replaced.
5. **The data bootstrap is the real unlock** — the brief depends on
   turning Architecture ONE's actual 850-project archive into structured
   data. That archive lives with Architecture ONE/Luke, not in this
   folder or `localtest\`. Nothing can become real (map pins, case
   studies) until that handoff happens.
6. **Tier pricing is explicitly not locked** — don't treat the £1,199 /
   £1,799 / £2,499 figures as final; the brief flags them as working
   numbers pending a scope-of-work review.
