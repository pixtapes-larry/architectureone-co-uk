"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { getTeamMemberAdmin } from "@/lib/admin/about-content";
import { saveTeamMemberAction, type TeamMemberFormState } from "@/app/admin/(protected)/team-members/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";

type TeamMemberRecord = NonNullable<Awaited<ReturnType<typeof getTeamMemberAdmin>>>;

const initialState: TeamMemberFormState = {};

export default function TeamMemberForm({ member }: { member?: TeamMemberRecord }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveTeamMemberAction,
    initialState,
  );

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={member?.id ?? ""} />

      <section className={styles.section}>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="name">Name</label>
            <input id="name" name="name" required defaultValue={member?.name} className={formStyles.input} />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="role">Role</label>
            <input id="role" name="role" required defaultValue={member?.role} className={formStyles.input} />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="photoLabel">Photo placeholder label</label>
          <input id="photoLabel" name="photoLabel" required defaultValue={member?.photoLabel} className={formStyles.input} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="bio">
            Bio (paragraphs separated by a blank line — the first team
            member renders as the large lead bio, with every paragraph
            shown; everyone else renders in the grid with just the first
            paragraph)
          </label>
          <textarea id="bio" name="bio" required defaultValue={member?.bio} className={formStyles.textarea} style={{ minHeight: 200 }} />
        </div>
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <button type="submit" disabled={pending} className={formStyles.submitBtn}>
          {pending ? "Saving…" : member ? "Save changes" : "Create team member"}
        </button>
        <button type="button" className={styles.smallBtn} onClick={() => router.push("/admin/team-members")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
