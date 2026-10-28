import { notFound } from "next/navigation";
import { getTestimonialAdmin, listProjectsForTestimonialPicker } from "@/lib/admin/testimonials";
import TestimonialForm from "@/components/admin/TestimonialForm";

export const instant = false;

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [testimonial, projects] = await Promise.all([
    getTestimonialAdmin(Number(id)),
    listProjectsForTestimonialPicker(),
  ]);

  if (!testimonial) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit testimonial
      </h1>
      <TestimonialForm testimonial={testimonial} projects={projects} />
    </>
  );
}
