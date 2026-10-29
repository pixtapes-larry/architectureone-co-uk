"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { PlanningType, ProjectType } from "@/generated/prisma/enums";
import { PLANNING_TYPE_LABELS, PROJECT_TYPE_LABELS } from "@/lib/project-labels";
import type { getProjectAdmin } from "@/lib/admin/projects";
import type { ServiceGroup } from "@/lib/services";
import { saveProjectAction, type ProjectFormState } from "@/app/admin/(protected)/projects/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import SeoFields from "./SeoFields";
import TemplateNote from "./TemplateNote";
import ImageUploadField from "./ImageUploadField";

type ProjectWithRelations = NonNullable<Awaited<ReturnType<typeof getProjectAdmin>>>;

const initialState: ProjectFormState = {};

function toDateInputValue(date: Date | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default function ProjectForm({
  project,
  serviceGroups,
}: {
  project?: ProjectWithRelations;
  serviceGroups: ServiceGroup[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveProjectAction,
    initialState,
  );
  const [selectedServices, setSelectedServices] = useState<Set<number>>(
    new Set(project?.services.map((s) => s.serviceId) ?? []),
  );

  function toggleService(serviceId: number) {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  }

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={project?.id ?? ""} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Core details</h2>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              required
              defaultValue={project?.address}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="place">
              Place (town, county)
            </label>
            <input
              id="place"
              name="place"
              required
              defaultValue={project?.place}
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="postcode">
              Postcode
            </label>
            <input
              id="postcode"
              name="postcode"
              required
              defaultValue={project?.postcode}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="localAuthority">
              Local authority
            </label>
            <input
              id="localAuthority"
              name="localAuthority"
              required
              defaultValue={project?.localAuthority}
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="planningType">
              Planning type
            </label>
            <select
              id="planningType"
              name="planningType"
              required
              defaultValue={project?.planningType ?? ""}
              className={formStyles.select}
            >
              <option value="" disabled>
                Select…
              </option>
              {Object.values(PlanningType).map((v) => (
                <option key={v} value={v}>
                  {PLANNING_TYPE_LABELS[v]}
                </option>
              ))}
            </select>
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="projectType">
              Project type
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              defaultValue={project?.projectType ?? ""}
              className={formStyles.select}
            >
              <option value="" disabled>
                Select…
              </option>
              {Object.values(ProjectType).map((v) => (
                <option key={v} value={v}>
                  {PROJECT_TYPE_LABELS[v]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="instructionDate">
            Instruction date
          </label>
          <input
            id="instructionDate"
            name="instructionDate"
            type="date"
            required
            defaultValue={toDateInputValue(project?.instructionDate)}
            className={formStyles.input}
          />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="description">
            Description (short — map pin / card summary)
          </label>
          <textarea
            id="description"
            name="description"
            required
            defaultValue={project?.description}
            className={formStyles.textarea}
          />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="notes">
            Internal notes (never shown publicly)
          </label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={project?.notes ?? ""}
            className={formStyles.textarea}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cover photo</h2>
        <ImageUploadField
          name="coverPhoto"
          label={project ? "Replace cover photo" : "Cover photo"}
          existingUrl={project?.coverPhotoUrl}
          aspectRatio={4 / 3}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured case study</h2>
        <TemplateNote templateName="Featured Project" />
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured}
          />
          Featured (gets its own case-study page at /work/&lt;slug&gt;)
        </label>

        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="slug">
            Slug (case-study URL — only used if featured)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={project?.slug ?? ""}
            placeholder="e.g. ip7-hadleigh-loft-conversion"
            className={formStyles.input}
          />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="fullDescription">
            Full description (long-form brief / outcome — paragraphs
            separated by a blank line)
          </label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            defaultValue={project?.fullDescription ?? ""}
            className={formStyles.textarea}
            style={{ minHeight: 200 }}
          />
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="constructionCompany">
              Builder
            </label>
            <input
              id="constructionCompany"
              name="constructionCompany"
              defaultValue={project?.constructionCompany ?? ""}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="year">
              Year completed
            </label>
            <input
              id="year"
              name="year"
              type="number"
              defaultValue={project?.year ?? ""}
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="status">
            Status
          </label>
          <input
            id="status"
            name="status"
            defaultValue={project?.status ?? "Completed"}
            className={formStyles.input}
          />
        </div>
      </section>

      <SeoFields metaTitle={project?.metaTitle} metaDescription={project?.metaDescription} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Plan images</h2>
        <div className={formStyles.row}>
          <ImageUploadField
            name="floorplanBefore"
            label="Floor plan — before"
            existingUrl={project?.floorplanBeforeImage}
          />
          <ImageUploadField
            name="floorplanAfter"
            label="Floor plan — after"
            existingUrl={project?.floorplanAfterImage}
          />
        </div>
        <div className={formStyles.row}>
          <ImageUploadField
            name="elevationBefore"
            label="Elevation — before"
            existingUrl={project?.elevationBeforeImage}
          />
          <ImageUploadField
            name="elevationAfter"
            label="Elevation — after"
            existingUrl={project?.elevationAfterImage}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Before / after gallery</h2>
        {project && project.photos.length > 0 && (
          <div className={styles.galleryGrid}>
            {project.photos.map((photo) => (
              <div key={photo.id} className={styles.galleryItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption ?? ""} />
                <label className={styles.galleryDeleteLabel}>
                  <input type="checkbox" name="deletePhotoIds" value={photo.id} />
                  {photo.isBefore ? "Before" : "After"} — delete
                </label>
              </div>
            ))}
          </div>
        )}
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="galleryBeforePhotos">
              Add "before" photos
            </label>
            <input
              id="galleryBeforePhotos"
              name="galleryBeforePhotos"
              type="file"
              accept="image/*"
              multiple
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="galleryAfterPhotos">
              Add "after" photos
            </label>
            <input
              id="galleryAfterPhotos"
              name="galleryAfterPhotos"
              type="file"
              accept="image/*"
              multiple
              className={formStyles.input}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Awards</h2>
        <p style={{ fontSize: 13, color: "var(--color-muted)" }}>
          Awards are managed on their own page now, not here — add or edit
          one under{" "}
          <a href="/admin/awards" style={{ color: "var(--color-coral)" }}>
            Content Library → Awards
          </a>{" "}
          and attach it to this project there.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Customer</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="testimonial">
            Testimonial
          </label>
          <textarea
            id="testimonial"
            name="testimonial"
            defaultValue={project?.testimonial ?? ""}
            className={formStyles.textarea}
          />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="customerName">
            Customer name
          </label>
          <input
            id="customerName"
            name="customerName"
            defaultValue={project?.customerName ?? ""}
            className={formStyles.input}
          />
        </div>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            name="customerConsent"
            defaultChecked={project?.customerConsent ?? false}
          />
          Customer has given consent to be named/quoted publicly
        </label>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="otherTags">
            Other tags (comma-separated)
          </label>
          <input
            id="otherTags"
            name="otherTags"
            defaultValue={(project?.otherTags as string[] | null)?.join(", ") ?? ""}
            placeholder="Heritage, Class Q, Change of Use"
            className={formStyles.input}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Services delivered</h2>
        {serviceGroups.map((group) => (
          <div key={group.heading} className={styles.servicesGroup}>
            <div className={styles.servicesGroupTitle}>{group.heading}</div>
            {group.services.map((service) => (
              <label key={service.id} className={styles.serviceCheckbox}>
                <input
                  type="checkbox"
                  name="services"
                  value={service.id}
                  checked={selectedServices.has(service.id)}
                  onChange={() => toggleService(service.id)}
                />
                {service.title}
              </label>
            ))}
          </div>
        ))}
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={pending}
          className={formStyles.submitBtn}
        >
          {pending ? "Saving…" : project ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
