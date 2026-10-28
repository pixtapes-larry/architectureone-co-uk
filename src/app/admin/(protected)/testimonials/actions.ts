"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createTestimonialAdmin,
  updateTestimonialAdmin,
  deleteTestimonialAdmin,
  toggleTestimonialFeaturedAdmin,
  reorderTestimonialsAdmin,
  type TestimonialAdminInput,
} from "@/lib/admin/testimonials";

export type TestimonialFormState = { error?: string };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseCoreFields(formData: FormData): TestimonialAdminInput {
  const projectIdRaw = str(formData, "projectId");
  return {
    quote: str(formData, "quote"),
    authorName: str(formData, "authorName") || null,
    stars: Number(str(formData, "stars") || "5"),
    featured: formData.get("featured") === "on",
    source: str(formData, "source") || null,
    sourceUrl: str(formData, "sourceUrl") || null,
    projectId: projectIdRaw ? Number(projectIdRaw) : null,
  };
}

function revalidateTestimonials() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/about");
}

export async function saveTestimonialAction(
  _prevState: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  const idRaw = str(formData, "id");
  const isEdit = idRaw.length > 0;

  const core = parseCoreFields(formData);
  if (!core.quote) {
    return { error: "Quote is required." };
  }

  if (isEdit) {
    await updateTestimonialAdmin(Number(idRaw), core);
  } else {
    await createTestimonialAdmin(core);
  }

  revalidateTestimonials();
  redirect("/admin/testimonials");
}

export async function deleteTestimonialFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    await deleteTestimonialAdmin(id);
  }
  revalidateTestimonials();
  redirect("/admin/testimonials");
}

export async function toggleTestimonialFeaturedFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    await toggleTestimonialFeaturedAdmin(id);
  }
  revalidateTestimonials();
  redirect("/admin/testimonials");
}

// Called directly (not as a form action) from the drag-to-reorder table —
// `orderedIds` is the full testimonial id list in its new order.
export async function reorderTestimonialsAction(orderedIds: number[]) {
  await reorderTestimonialsAdmin(orderedIds);
  revalidateTestimonials();
}
