"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { getServiceAdmin } from "@/lib/admin/services";
import { saveServiceAction, type ServiceFormState } from "@/app/admin/(protected)/services/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";

type ServiceRecord = NonNullable<Awaited<ReturnType<typeof getServiceAdmin>>>;

const initialState: ServiceFormState = {};

export default function ServiceForm({
  service,
  existingGroups,
}: {
  service?: ServiceRecord;
  existingGroups: string[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveServiceAction,
    initialState,
  );

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={service?.id ?? ""} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Core details</h2>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={service?.title}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              required
              defaultValue={service?.slug}
              placeholder="e.g. measured-survey"
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="description">
            Description (2 sentences — shown on the public Services page)
          </label>
          <textarea
            id="description"
            name="description"
            required
            defaultValue={service?.description}
            className={formStyles.textarea}
          />
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="group">
              Group (pick an existing one to keep them consistent, or type a
              new one)
            </label>
            <input
              id="group"
              name="group"
              required
              list="group-options"
              defaultValue={service?.group}
              className={formStyles.input}
            />
            <datalist id="group-options">
              {existingGroups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="sortOrder">
              Sort order (lower shows first; also orders groups, by their
              lowest member)
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={service?.sortOrder ?? 0}
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="groupNote">
            Group note (optional — shown once per group, e.g. &quot;Coordinated
            on your behalf via trusted partners.&quot;)
          </label>
          <input
            id="groupNote"
            name="groupNote"
            defaultValue={service?.groupNote ?? ""}
            className={formStyles.input}
          />
        </div>
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={pending}
          className={formStyles.submitBtn}
        >
          {pending ? "Saving…" : service ? "Save changes" : "Create service"}
        </button>
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() => router.push("/admin/services")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
