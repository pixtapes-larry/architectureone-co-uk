"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { getSubTypePageAdmin } from "@/lib/admin/sub-type-pages";
import { saveSubTypePageAction, type SubTypePageFormState } from "@/app/admin/(protected)/sub-type-pages/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";

type SubTypePageRecord = NonNullable<Awaited<ReturnType<typeof getSubTypePageAdmin>>>;

const initialState: SubTypePageFormState = {};

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
      <button type="button" className={styles.smallBtn} onClick={() => setItems((prev) => [...prev, ""])}>
        {addLabel}
      </button>
    </>
  );
}

function PairListEditor({
  items,
  setItems,
  fieldAName,
  fieldBName,
  placeholderA,
  placeholderB,
  addLabel,
}: {
  items: { a: string; b: string }[];
  setItems: (fn: (prev: { a: string; b: string }[]) => { a: string; b: string }[]) => void;
  fieldAName: string;
  fieldBName: string;
  placeholderA: string;
  placeholderB: string;
  addLabel: string;
}) {
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className={styles.awardsRow}>
          <textarea name={fieldAName} defaultValue={item.a} placeholder={placeholderA} className={formStyles.textarea} />
          <textarea name={fieldBName} defaultValue={item.b} placeholder={placeholderB} className={formStyles.textarea} />
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
      <button type="button" className={styles.smallBtn} onClick={() => setItems((prev) => [...prev, { a: "", b: "" }])}>
        {addLabel}
      </button>
    </>
  );
}

export default function SubTypePageForm({ page }: { page: SubTypePageRecord }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveSubTypePageAction,
    initialState,
  );

  const [aboutParagraphs, setAboutParagraphs] = useState<string[]>(
    page.aboutParagraphs as string[],
  );
  const [hasTypesSection, setHasTypesSection] = useState(Boolean(page.typesSectionHeading));
  const [typeItems, setTypeItems] = useState<{ title: string; photoLabel: string; description: string }[]>(
    page.typesSectionItems.map((item) => ({
      title: item.title,
      photoLabel: item.photoLabel,
      description: item.description,
    })),
  );
  const [planningCards, setPlanningCards] = useState<{ a: string; b: string }[]>(
    (page.planningCards as { title: string; description: string }[]).map((c) => ({
      a: c.title,
      b: c.description,
    })),
  );
  const [steps, setSteps] = useState<{ a: string; b: string }[]>(
    (page.steps as { title: string; description: string }[]).map((s) => ({
      a: s.title,
      b: s.description,
    })),
  );
  const [pricingKind, setPricingKind] = useState(page.pricingKind);

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={page.id} />
      <input type="hidden" name="projectType" value={page.projectType} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hero &amp; about</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heroTitle">Hero title</label>
          <textarea id="heroTitle" name="heroTitle" required defaultValue={page.heroTitle} className={formStyles.textarea} />
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
          <label className={formStyles.label}>About paragraphs</label>
          <StringListEditor
            items={aboutParagraphs}
            setItems={setAboutParagraphs}
            fieldName="aboutParagraph"
            placeholder="Paragraph"
            addLabel="+ Add paragraph"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Sub-variety breakdown (optional — only Loft Conversions uses this
          today)
        </h2>
        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={hasTypesSection} onChange={(e) => setHasTypesSection(e.target.checked)} />
          Include this section
        </label>
        {hasTypesSection && (
          <>
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label} htmlFor="typesSectionHeading">Heading</label>
                <textarea id="typesSectionHeading" name="typesSectionHeading" defaultValue={page.typesSectionHeading ?? ""} className={formStyles.textarea} />
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label} htmlFor="typesSectionLead">Lead</label>
                <textarea id="typesSectionLead" name="typesSectionLead" defaultValue={page.typesSectionLead ?? ""} className={formStyles.textarea} />
              </div>
            </div>
            {typeItems.map((item, i) => (
              <div key={i} style={{ border: "1px solid var(--color-line)", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <div className={formStyles.row}>
                  <div className={formStyles.field}>
                    <label className={formStyles.label}>Title</label>
                    <textarea
                      name="typeItem_title"
                      defaultValue={item.title}
                      className={formStyles.textarea}
                    />
                  </div>
                  <div className={formStyles.field}>
                    <label className={formStyles.label}>Photo placeholder label</label>
                    <textarea
                      name="typeItem_photoLabel"
                      defaultValue={item.photoLabel}
                      className={formStyles.textarea}
                    />
                  </div>
                </div>
                <div className={formStyles.field}>
                  <label className={formStyles.label}>Description</label>
                  <textarea
                    name="typeItem_description"
                    defaultValue={item.description}
                    className={formStyles.textarea}
                  />
                </div>
                <button
                  type="button"
                  className={styles.smallBtn}
                  onClick={() => setTypeItems((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  Remove this item
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.smallBtn}
              onClick={() => setTypeItems((prev) => [...prev, { title: "", photoLabel: "", description: "" }])}
            >
              + Add item
            </button>
          </>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What&apos;s achievable</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="planningHeading">Heading</label>
          <textarea id="planningHeading" name="planningHeading" required defaultValue={page.planningHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Cards</label>
          <PairListEditor
            items={planningCards}
            setItems={setPlanningCards}
            fieldAName="planningCard_title"
            fieldBName="planningCard_description"
            placeholderA="Title"
            placeholderB="Description"
            addLabel="+ Add card"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Process steps</h2>
        <PairListEditor
          items={steps}
          setItems={setSteps}
          fieldAName="step_title"
          fieldBName="step_description"
          placeholderA="Title"
          placeholderB="Description"
          addLabel="+ Add step"
        />
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
        <h2 className={styles.sectionTitle}>Closing CTA</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="ctaQuestion">Question</label>
          <textarea id="ctaQuestion" name="ctaQuestion" required defaultValue={page.ctaQuestion} className={formStyles.textarea} />
        </div>
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <button type="submit" disabled={pending} className={formStyles.submitBtn}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button type="button" className={styles.smallBtn} onClick={() => router.push("/admin/sub-type-pages")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
