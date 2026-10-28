"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { getPackageAdmin } from "@/lib/admin/packages";
import type { ServiceGroup } from "@/lib/services";
import { savePackageAction, type PackageFormState } from "@/app/admin/(protected)/packages/actions";
import type { ExpectationItem } from "@/lib/packages";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";

type PackageRecord = NonNullable<Awaited<ReturnType<typeof getPackageAdmin>>>;

const initialState: PackageFormState = {};

export default function PackageForm({
  pkg,
  serviceGroups,
}: {
  pkg?: PackageRecord;
  serviceGroups: ServiceGroup[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    savePackageAction,
    initialState,
  );
  const [expectations, setExpectations] = useState<
    { label: string; count: string }[]
  >(
    ((pkg?.expectations as ExpectationItem[] | null) ?? []).map((e) => ({
      label: e.label,
      count: e.count === null ? "" : String(e.count),
    })),
  );
  // serviceId -> constraint note ("" if none). Presence in the map = included.
  const [selectedServices, setSelectedServices] = useState<Map<number, string>>(
    new Map(pkg?.services.map((s) => [s.serviceId, s.constraintNote ?? ""]) ?? []),
  );

  function toggleService(serviceId: number) {
    setSelectedServices((prev) => {
      const next = new Map(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.set(serviceId, "");
      return next;
    });
  }

  function setConstraint(serviceId: number, value: string) {
    setSelectedServices((prev) => {
      const next = new Map(prev);
      next.set(serviceId, value);
      return next;
    });
  }

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={pkg?.id ?? ""} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Core details</h2>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={pkg?.name}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="slug">
              Slug (URL — /packages/&lt;slug&gt;)
            </label>
            <input
              id="slug"
              name="slug"
              required
              defaultValue={pkg?.slug}
              placeholder="e.g. starter"
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="price">
              Price (display string)
            </label>
            <input
              id="price"
              name="price"
              required
              defaultValue={pkg?.price}
              placeholder="e.g. £1,199"
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="sortOrder">
              Sort order (lower shows first)
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={pkg?.sortOrder ?? 0}
              className={formStyles.input}
            />
          </div>
        </div>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={pkg?.featured}
          />
          Featured (highlighted tier on category/sub-type pages)
        </label>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What&apos;s included</h2>
        <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 12 }}>
          Pick from the shared Service catalog. Add a constraining line to
          narrow a service for this package specifically (e.g. &quot;up to 2
          rounds of amendments&quot;).
        </p>
        {serviceGroups.map((group) => (
          <div key={group.heading} className={styles.servicesGroup}>
            <div className={styles.servicesGroupTitle}>{group.heading}</div>
            {group.services.map((service) => {
              const checked = selectedServices.has(service.id);
              return (
                <div key={service.id} style={{ marginBottom: 8 }}>
                  <label className={styles.serviceCheckbox}>
                    <input
                      type="checkbox"
                      name="service_included"
                      value={service.id}
                      checked={checked}
                      onChange={() => toggleService(service.id)}
                    />
                    {service.title}
                  </label>
                  {checked && (
                    <input
                      name={`constraint_${service.id}`}
                      defaultValue={selectedServices.get(service.id)}
                      onChange={(e) => setConstraint(service.id, e.target.value)}
                      placeholder="Constrain for this package (optional)"
                      className={formStyles.input}
                      style={{ marginTop: 4, marginLeft: 24, maxWidth: 360 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          What you can expect (leave count blank for &quot;TBC&quot;)
        </h2>
        {expectations.map((item, i) => (
          <div key={i} className={styles.awardsRow}>
            <input
              name="expect_label"
              defaultValue={item.label}
              placeholder="Label, e.g. Meetings"
              className={formStyles.input}
            />
            <input
              name="expect_count"
              defaultValue={item.count}
              placeholder="Count (blank = TBC)"
              type="number"
              className={formStyles.input}
            />
            <button
              type="button"
              className={styles.removeBtn}
              aria-label="Remove expectation"
              onClick={() =>
                setExpectations((prev) => prev.filter((_, idx) => idx !== i))
              }
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() =>
            setExpectations((prev) => [...prev, { label: "", count: "" }])
          }
        >
          + Add expectation
        </button>
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={pending}
          className={formStyles.submitBtn}
        >
          {pending ? "Saving…" : pkg ? "Save changes" : "Create package"}
        </button>
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() => router.push("/admin/packages")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
