"use client";

import type { getProjectsMapContentAdmin } from "@/lib/admin/projects-map-content";
import { saveProjectsMapContentAction } from "@/app/admin/(protected)/projects-map-content/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";

type ProjectsMapContentRecord = NonNullable<Awaited<ReturnType<typeof getProjectsMapContentAdmin>>>;

export default function ProjectsMapContentForm({ content }: { content: ProjectsMapContentRecord }) {
  return (
    <form action={saveProjectsMapContentAction} className={styles.form}>
      <section className={styles.section}>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="searchHeading">
            Search-card heading (can use the &quot;{"{projectCount}"}&quot;
            token — the part up to the first &quot;. &quot; is shown
            highlighted, on its own line)
          </label>
          <textarea id="searchHeading" name="searchHeading" required defaultValue={content.searchHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="searchLead">Lead</label>
          <textarea id="searchLead" name="searchLead" required defaultValue={content.searchLead} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="startingNote">Starting-point note</label>
          <textarea id="startingNote" name="startingNote" required defaultValue={content.startingNote} className={formStyles.textarea} />
        </div>
      </section>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submitBtn}>
          Save changes
        </button>
      </div>
    </form>
  );
}
