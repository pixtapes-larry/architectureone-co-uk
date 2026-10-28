"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { getNavItemAdmin, listTopLevelNavItemsAdmin } from "@/lib/admin/nav-items";
import { saveNavItemAction, type NavItemFormState } from "@/app/admin/(protected)/nav/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";

type NavItemRecord = NonNullable<Awaited<ReturnType<typeof getNavItemAdmin>>>;
type TopLevelOption = Awaited<ReturnType<typeof listTopLevelNavItemsAdmin>>[number];

const initialState: NavItemFormState = {};

export default function NavItemForm({
  item,
  topLevelOptions,
}: {
  item?: NavItemRecord;
  topLevelOptions: TopLevelOption[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveNavItemAction,
    initialState,
  );

  // A top-level item can't be nested under itself (or under one of its own
  // children, but that case doesn't arise — only one level of nesting
  // exists).
  const parentChoices = topLevelOptions.filter((o) => o.id !== item?.id);

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={item?.id ?? ""} />

      <section className={styles.section}>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="label">
              Label
            </label>
            <input
              id="label"
              name="label"
              required
              defaultValue={item?.label}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="href">
              Href
            </label>
            <input
              id="href"
              name="href"
              required
              defaultValue={item?.href}
              placeholder="/some-page"
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="parentId">
            Parent (nests this under another top-level item, as a dropdown
            item)
          </label>
          <select
            id="parentId"
            name="parentId"
            defaultValue={item?.parentId ?? ""}
            className={formStyles.select}
          >
            <option value="">None — top-level item</option>
            {parentChoices.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            name="visible"
            defaultChecked={item?.visible ?? true}
          />
          Visible in the header
        </label>
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={pending}
          className={formStyles.submitBtn}
        >
          {pending ? "Saving…" : item ? "Save changes" : "Create nav item"}
        </button>
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() => router.push("/admin/nav")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
