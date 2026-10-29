"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { getAwardAdmin } from "@/lib/admin/awards";
import { saveAwardAction, type AwardFormState } from "@/app/admin/(protected)/awards/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import ProjectPicker from "./ProjectPicker";

type AwardRecord = NonNullable<Awaited<ReturnType<typeof getAwardAdmin>>>;
type ProjectOption = { id: number; address: string; place: string; postcode: string };

const initialState: AwardFormState = {};

export default function AwardForm({
  award,
  projects,
}: {
  award?: AwardRecord;
  projects: ProjectOption[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveAwardAction, initialState);
  const defaultProject = award?.projectId
    ? projects.find((p) => p.id === award.projectId) ?? null
    : null;

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={award?.id ?? ""} />

      <section className={styles.section}>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="name">Award name</label>
            <input
              id="name"
              name="name"
              required
              defaultValue={award?.name}
              placeholder="e.g. LABC Regional Winner"
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="year">Year</label>
            <input
              id="year"
              name="year"
              type="number"
              required
              defaultValue={award?.year ?? new Date().getFullYear()}
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="sourceUrl">
            Link to the official announcement (optional)
          </label>
          <input
            id="sourceUrl"
            name="sourceUrl"
            type="url"
            defaultValue={award?.sourceUrl ?? ""}
            className={formStyles.input}
          />
        </div>
        <ProjectPicker
          projects={projects}
          defaultProject={defaultProject}
          label="Attached project (optional — which job this award was won for)"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Badge image</h2>
        {award?.imageUrl && (
          <div className={styles.photoPreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={award.imageUrl} alt="Current badge" />
            <span className={styles.photoPreviewUrl}>{award.imageUrl}</span>
          </div>
        )}
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="image">
            {award?.imageUrl ? "Replace badge image" : "Badge image (optional)"}
          </label>
          <input id="image" name="image" type="file" accept="image/*" className={formStyles.input} />
        </div>
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <button type="submit" disabled={pending} className={formStyles.submitBtn}>
          {pending ? "Saving…" : award ? "Save changes" : "Create award"}
        </button>
        <button type="button" className={styles.smallBtn} onClick={() => router.push("/admin/awards")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
