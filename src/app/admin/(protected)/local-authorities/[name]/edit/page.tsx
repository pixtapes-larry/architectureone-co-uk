import { notFound } from "next/navigation";
import { getLocalAuthorityBlurbAdmin } from "@/lib/admin/local-authorities";
import { allLocalAuthorityNames } from "@/lib/local-authorities";
import { saveLocalAuthorityBlurbAction } from "../../actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "@/components/admin/ProjectForm.module.css";

export const instant = false;

export default async function EditLocalAuthorityPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: encodedName } = await params;
  const name = decodeURIComponent(encodedName);

  const [names, info] = await Promise.all([
    allLocalAuthorityNames(),
    getLocalAuthorityBlurbAdmin(name),
  ]);

  if (!names.includes(name)) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit blurb — {name}
      </h1>
      <form action={saveLocalAuthorityBlurbAction} className={styles.form}>
        <input type="hidden" name="name" value={name} />
        <section className={styles.section}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="blurb">
              Intro blurb (leave blank to use the computed &quot;X projects
              and counting&quot; line instead)
            </label>
            <textarea
              id="blurb"
              name="blurb"
              defaultValue={info?.blurb ?? ""}
              className={formStyles.textarea}
              style={{ minHeight: 120 }}
            />
          </div>
        </section>
        <div className={styles.actions}>
          <button type="submit" className={formStyles.submitBtn}>
            Save
          </button>
        </div>
      </form>
    </>
  );
}
