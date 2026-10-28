"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectType } from "@/generated/prisma/enums";
import { PROJECT_TYPE_LABELS } from "@/lib/project-labels";
import type { getCategoryPageAdmin } from "@/lib/admin/category-pages";
import { saveCategoryPageAction, type CategoryPageFormState } from "@/app/admin/(protected)/category-pages/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";

type CategoryPageRecord = NonNullable<Awaited<ReturnType<typeof getCategoryPageAdmin>>>;

const initialState: CategoryPageFormState = {};

// A plain string list with add/remove — introParagraphs, planningRouteParagraphs,
// and each sub-type card's own bullets all use this same shape. Always a
// textarea: every one of these holds real page copy, never a short value.
function StringListEditor({
  items,
  setItems,
  fieldName,
  placeholder,
  addLabel,
}: {
  items: string[];
  setItems: (fn: (prev: string[]) => string[]) => void;
  fieldName: string;
  placeholder: string;
  addLabel: string;
}) {
  return (
    <>
      {items.map((value, i) => (
        <div key={i} className={styles.awardsRow}>
          <textarea
            name={fieldName}
            defaultValue={value}
            placeholder={placeholder}
            className={formStyles.textarea}
          />
          <button
            type="button"
            className={styles.removeBtn}
            aria-label="Remove"
            onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.smallBtn}
        onClick={() => setItems((prev) => [...prev, ""])}
      >
        {addLabel}
      </button>
    </>
  );
}

// A list of {a, b}-shaped pairs with add/remove — considerations,
// planningRouteItems and feesRows all use this shape (field names differ
// per use, passed in as props). Both fields are textareas by default since
// they hold copy; pass bFieldType="input" for a genuinely short value like
// a fees amount ("£528*").
function PairListEditor({
  items,
  setItems,
  fieldAName,
  fieldBName,
  placeholderA,
  placeholderB,
  addLabel,
  bFieldType = "textarea",
}: {
  items: { a: string; b: string }[];
  setItems: (fn: (prev: { a: string; b: string }[]) => { a: string; b: string }[]) => void;
  fieldAName: string;
  fieldBName: string;
  placeholderA: string;
  placeholderB: string;
  addLabel: string;
  bFieldType?: "input" | "textarea";
}) {
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className={styles.awardsRow}>
          <textarea
            name={fieldAName}
            defaultValue={item.a}
            placeholder={placeholderA}
            className={formStyles.textarea}
          />
          {bFieldType === "textarea" ? (
            <textarea
              name={fieldBName}
              defaultValue={item.b}
              placeholder={placeholderB}
              className={formStyles.textarea}
            />
          ) : (
            <input
              name={fieldBName}
              defaultValue={item.b}
              placeholder={placeholderB}
              className={formStyles.input}
            />
          )}
          <button
            type="button"
            className={styles.removeBtn}
            aria-label="Remove"
            onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.smallBtn}
        onClick={() => setItems((prev) => [...prev, { a: "", b: "" }])}
      >
        {addLabel}
      </button>
    </>
  );
}

type CardState = {
  projectType: ProjectType;
  title: string;
  photoLabel: string;
  routeTag: string;
  bullets: string[];
};

export default function CategoryPageForm({ page }: { page: CategoryPageRecord }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveCategoryPageAction,
    initialState,
  );

  const [introParagraphs, setIntroParagraphs] = useState<string[]>(
    page.introParagraphs as string[],
  );
  const [cards, setCards] = useState<CardState[]>(
    page.subTypeCards.map((c) => ({
      projectType: c.projectType,
      title: c.title,
      photoLabel: c.photoLabel,
      routeTag: c.routeTag ?? "",
      bullets: c.bullets as string[],
    })),
  );
  const [planningRouteKind, setPlanningRouteKind] = useState(page.planningRouteKind ?? "");
  const [planningRouteParagraphs, setPlanningRouteParagraphs] = useState<string[]>(
    (page.planningRouteParagraphs as string[] | null) ?? [],
  );
  const [planningRouteItems, setPlanningRouteItems] = useState<
    { title: string; description: string; href: string }[]
  >(
    (
      (page.planningRouteItems as { title: string; description: string; href?: string }[] | null) ??
      []
    ).map((i) => ({ title: i.title, description: i.description, href: i.href ?? "" })),
  );
  const [pricingKind, setPricingKind] = useState(page.pricingKind);
  const [hasFees, setHasFees] = useState(Boolean(page.feesHeading));
  const [feesRows, setFeesRows] = useState<{ a: string; b: string }[]>(
    ((page.feesRows as { label: string; amount: string }[] | null) ?? []).map((r) => ({
      a: r.label,
      b: r.amount,
    })),
  );
  const [considerations, setConsiderations] = useState<{ a: string; b: string }[]>(
    (page.considerations as { title: string; description: string }[]).map((c) => ({
      a: c.title,
      b: c.description,
    })),
  );
  const [closingKind, setClosingKind] = useState(page.closingKind);
  const [closingItems, setClosingItems] = useState<
    { label: string; href: string; description: string }[]
  >(
    (page.closingItems as { label: string; href: string; description: string }[] | null) ?? [],
  );

  function updateCard(index: number, patch: Partial<CardState>) {
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function updateCardBullets(index: number, fn: (prev: string[]) => string[]) {
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, bullets: fn(c.bullets) } : c)));
  }

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={page.id} />
      <input type="hidden" name="category" value={page.category} />
      <input type="hidden" name="cardCount" value={cards.length} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hero &amp; intro</h2>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="heroTitle">Hero title</label>
            <textarea id="heroTitle" name="heroTitle" required defaultValue={page.heroTitle} className={formStyles.textarea} />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="crumbLabel">Breadcrumb label</label>
            <textarea id="crumbLabel" name="crumbLabel" required defaultValue={page.crumbLabel} className={formStyles.textarea} />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heroTagline">Hero tagline</label>
          <textarea id="heroTagline" name="heroTagline" required defaultValue={page.heroTagline} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heroPhotoLabel">Hero photo placeholder label</label>
          <textarea id="heroPhotoLabel" name="heroPhotoLabel" required defaultValue={page.heroPhotoLabel} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="introHeading">Intro heading</label>
          <textarea id="introHeading" name="introHeading" required defaultValue={page.introHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Intro paragraphs</label>
          <StringListEditor
            items={introParagraphs}
            setItems={setIntroParagraphs}
            fieldName="introParagraph"
            placeholder="Paragraph"
            addLabel="+ Add paragraph"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sub-type cards</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="subTypesHeading">Section heading</label>
          <textarea id="subTypesHeading" name="subTypesHeading" required defaultValue={page.subTypesHeading} className={formStyles.textarea} />
        </div>

        {cards.map((card, i) => (
          <div key={i} style={{ border: "1px solid var(--color-line)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Project type</label>
                <select
                  name={`card_${i}_projectType`}
                  value={card.projectType}
                  onChange={(e) => updateCard(i, { projectType: e.target.value as ProjectType })}
                  className={formStyles.select}
                >
                  {Object.values(ProjectType).map((pt) => (
                    <option key={pt} value={pt}>{PROJECT_TYPE_LABELS[pt]}</option>
                  ))}
                </select>
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Title</label>
                <textarea
                  name={`card_${i}_title`}
                  defaultValue={card.title}
                  className={formStyles.textarea}
                />
              </div>
            </div>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Photo placeholder label</label>
                <textarea
                  name={`card_${i}_photoLabel`}
                  defaultValue={card.photoLabel}
                  className={formStyles.textarea}
                />
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Route tag (optional, short badge, e.g. &quot;CLASS Q&quot;)</label>
                <input
                  name={`card_${i}_routeTag`}
                  defaultValue={card.routeTag}
                  className={formStyles.input}
                />
              </div>
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Bullets</label>
              <StringListEditor
                items={card.bullets}
                setItems={(fn) => updateCardBullets(i, fn)}
                fieldName={`card_${i}_bullet`}
                placeholder="Bullet"
                addLabel="+ Add bullet"
              />
            </div>
            <button
              type="button"
              className={styles.smallBtn}
              onClick={() => setCards((prev) => prev.filter((_, idx) => idx !== i))}
            >
              Remove this card
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() =>
            setCards((prev) => [
              ...prev,
              { projectType: ProjectType.OTHER_PLANNING, title: "", photoLabel: "", routeTag: "", bullets: [] },
            ])
          }
        >
          + Add card
        </button>

        <div className={formStyles.field} style={{ marginTop: 16 }}>
          <label className={formStyles.label} htmlFor="subTypesFooterNote">Footer note</label>
          <textarea id="subTypesFooterNote" name="subTypesFooterNote" required defaultValue={page.subTypesFooterNote} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Planning route (optional section)</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Kind</label>
          <select
            name="planningRouteKind"
            value={planningRouteKind}
            onChange={(e) => setPlanningRouteKind(e.target.value)}
            className={formStyles.select}
          >
            <option value="">None — section hidden</option>
            <option value="text">Text paragraphs</option>
            <option value="grid">Lead + grid of items</option>
          </select>
        </div>
        {planningRouteKind === "text" && (
          <div className={formStyles.field}>
            <label className={formStyles.label}>Paragraphs</label>
            <StringListEditor
              items={planningRouteParagraphs}
              setItems={setPlanningRouteParagraphs}
              fieldName="planningRouteParagraph"
              placeholder="Paragraph"
              addLabel="+ Add paragraph"
            />
          </div>
        )}
        {planningRouteKind === "grid" && (
          <>
            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="planningRouteLead">Lead</label>
              <textarea id="planningRouteLead" name="planningRouteLead" defaultValue={page.planningRouteLead ?? ""} className={formStyles.textarea} />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>
                Items (Link to is optional — fill it in to make the title
                link through to that sub-type page, e.g.
                /new-builds-developments/barn-conversions)
              </label>
              {planningRouteItems.map((item, i) => (
                <div key={i} style={{ border: "1px solid var(--color-line)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <textarea
                    name="planningRouteItem_title"
                    defaultValue={item.title}
                    placeholder="Title"
                    className={formStyles.textarea}
                    style={{ marginBottom: 8 }}
                  />
                  <textarea
                    name="planningRouteItem_description"
                    defaultValue={item.description}
                    placeholder="Description"
                    className={formStyles.textarea}
                    style={{ marginBottom: 8 }}
                  />
                  <input
                    name="planningRouteItem_href"
                    defaultValue={item.href}
                    placeholder="Link to (optional), e.g. /new-builds-developments/barn-conversions"
                    className={formStyles.input}
                  />
                  <div style={{ marginTop: 8 }}>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      aria-label="Remove"
                      onClick={() => setPlanningRouteItems((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      × Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className={styles.smallBtn}
                onClick={() => setPlanningRouteItems((prev) => [...prev, { title: "", description: "", href: "" }])}
              >
                + Add item
              </button>
            </div>
          </>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pricing</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Kind</label>
          <select
            name="pricingKind"
            value={pricingKind}
            onChange={(e) => setPricingKind(e.target.value as "packages" | "quote")}
            className={formStyles.select}
          >
            <option value="packages">Packages (live from /admin/packages)</option>
            <option value="quote">Quote — custom lead text</option>
          </select>
        </div>
        {pricingKind === "quote" && (
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="pricingQuoteLead">Quote lead text</label>
            <textarea id="pricingQuoteLead" name="pricingQuoteLead" defaultValue={page.pricingQuoteLead ?? ""} className={formStyles.textarea} />
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Professional fees (optional section)</h2>
        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={hasFees} onChange={(e) => setHasFees(e.target.checked)} />
          Include a fees table on this page
        </label>
        {hasFees && (
          <>
            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="feesHeading">Heading</label>
              <textarea id="feesHeading" name="feesHeading" defaultValue={page.feesHeading ?? ""} className={formStyles.textarea} />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="feesIntro">Intro</label>
              <textarea id="feesIntro" name="feesIntro" defaultValue={page.feesIntro ?? ""} className={formStyles.textarea} />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>Rows</label>
              <PairListEditor
                items={feesRows}
                setItems={setFeesRows}
                fieldAName="feesRow_label"
                fieldBName="feesRow_amount"
                placeholderA="Label"
                placeholderB="Amount"
                addLabel="+ Add row"
                bFieldType="input"
              />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label} htmlFor="feesNote">Note</label>
              <textarea id="feesNote" name="feesNote" defaultValue={page.feesNote ?? ""} className={formStyles.textarea} />
            </div>
          </>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Additional considerations</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="considerationsHeading">Heading</label>
          <textarea id="considerationsHeading" name="considerationsHeading" required defaultValue={page.considerationsHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Items</label>
          <PairListEditor
            items={considerations}
            setItems={setConsiderations}
            fieldAName="consideration_title"
            fieldBName="consideration_description"
            placeholderA="Title"
            placeholderB="Description"
            addLabel="+ Add consideration"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Closing panel</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Kind</label>
          <select
            name="closingKind"
            value={closingKind}
            onChange={(e) => setClosingKind(e.target.value as "trust-and-services" | "more-than-drawings")}
            className={formStyles.select}
          >
            <option value="trust-and-services">The Architecture ONE Promise + Our Services</option>
            <option value="more-than-drawings">&quot;More than just drawings&quot; — custom items</option>
          </select>
        </div>
        {closingKind === "more-than-drawings" && (
          <div className={formStyles.field}>
            <label className={formStyles.label}>Items</label>
            {closingItems.map((item, i) => (
              <div key={i} className={styles.awardsRow}>
                <textarea
                  name="closingItem_label"
                  defaultValue={item.label}
                  placeholder="Label"
                  className={formStyles.textarea}
                />
                <input
                  name="closingItem_href"
                  defaultValue={item.href}
                  placeholder="Href"
                  className={formStyles.input}
                />
                <textarea
                  name="closingItem_description"
                  defaultValue={item.description}
                  placeholder="Description"
                  className={formStyles.textarea}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  aria-label="Remove"
                  onClick={() => setClosingItems((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.smallBtn}
              onClick={() => setClosingItems((prev) => [...prev, { label: "", href: "", description: "" }])}
            >
              + Add item
            </button>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Home page teaser card (leave blank to omit this category from
          &quot;Which project sounds like yours?&quot;)
        </h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="homeTeaserTitle">
            Card title (can differ from the hero title above)
          </label>
          <textarea id="homeTeaserTitle" name="homeTeaserTitle" defaultValue={page.homeTeaserTitle ?? ""} className={formStyles.textarea} />
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="homeTeaserTag">Tag (e.g. &quot;From £1,199&quot;)</label>
            <textarea id="homeTeaserTag" name="homeTeaserTag" defaultValue={page.homeTeaserTag ?? ""} className={formStyles.textarea} />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="homeTeaserLinkLabel">Link label</label>
            <textarea id="homeTeaserLinkLabel" name="homeTeaserLinkLabel" defaultValue={page.homeTeaserLinkLabel ?? ""} className={formStyles.textarea} />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="homeTeaserBlurb">Blurb</label>
          <textarea id="homeTeaserBlurb" name="homeTeaserBlurb" defaultValue={page.homeTeaserBlurb ?? ""} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="homeTeaserPhotoLabel">Photo placeholder label</label>
          <textarea id="homeTeaserPhotoLabel" name="homeTeaserPhotoLabel" defaultValue={page.homeTeaserPhotoLabel ?? ""} className={formStyles.textarea} />
        </div>
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <button type="submit" disabled={pending} className={formStyles.submitBtn}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button type="button" className={styles.smallBtn} onClick={() => router.push("/admin/category-pages")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
