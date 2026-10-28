import TestimonialForm from "@/components/admin/TestimonialForm";
import { listProjectsForTestimonialPicker } from "@/lib/admin/testimonials";

export const instant = false;

export default async function NewTestimonialPage() {
  const projects = await listProjectsForTestimonialPicker();
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        New testimonial
      </h1>
      <TestimonialForm projects={projects} />
    </>
  );
}
