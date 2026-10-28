"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { getTestimonialAdmin } from "@/lib/admin/testimonials";
import { saveTestimonialAction, type TestimonialFormState } from "@/app/admin/(protected)/testimonials/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import ProjectPicker from "./ProjectPicker";

type TestimonialRecord = NonNullable<Awaited<ReturnType<typeof getTestimonialAdmin>>>;
type ProjectOption = { id: number; address: string; place: string; postcode: string };

const initialState: TestimonialFormState = {};

export default function TestimonialForm({
  testimonial,
  projects,
}: {
  testimonial?: TestimonialRecord;
  projects: ProjectOption[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveTestimonialAction,
    initialState,
  );
  const defaultProject = testimonial?.projectId
    ? projects.find((p) => p.id === testimonial.projectId) ?? null
    : null;

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={testimonial?.id ?? ""} />

      <section className={styles.section}>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="quote">Quote</label>
          <textarea id="quote" name="quote" required defaultValue={testimonial?.quote} className={formStyles.textarea} />
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="authorName">
              Author name (optional — leave blank to show anonymously)
            </label>
            <input id="authorName" name="authorName" defaultValue={testimonial?.authorName ?? ""} className={formStyles.input} />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="stars">Stars (1–5)</label>
            <input id="stars" name="stars" type="number" min={1} max={5} required defaultValue={testimonial?.stars ?? 5} className={formStyles.input} />
          </div>
        </div>
        <label className={styles.checkboxRow}>
          <input type="checkbox" name="featured" defaultChecked={testimonial?.featured} />
          Featured — eligible to show in the home page&apos;s quote bubble
          (the first featured one, in list order, is the one that shows)
        </label>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="source">
              Source (optional — e.g. &quot;Google&quot; or &quot;Facebook&quot;)
            </label>
            <input id="source" name="source" defaultValue={testimonial?.source ?? ""} className={formStyles.input} />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="sourceUrl">
              Link to the original review (optional)
            </label>
            <input id="sourceUrl" name="sourceUrl" type="url" defaultValue={testimonial?.sourceUrl ?? ""} className={formStyles.input} />
          </div>
        </div>
        <ProjectPicker
          projects={projects}
          defaultProject={defaultProject}
          label="Attached project (optional — which job this review was actually about)"
        />
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <button type="submit" disabled={pending} className={formStyles.submitBtn}>
          {pending ? "Saving…" : testimonial ? "Save changes" : "Create testimonial"}
        </button>
        <button type="button" className={styles.smallBtn} onClick={() => router.push("/admin/testimonials")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
