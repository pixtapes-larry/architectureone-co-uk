import { notFound } from "next/navigation";
import { getTestimonialsPageContentAdmin } from "@/lib/admin/testimonials-page-content";
import TestimonialsPageContentForm from "@/components/admin/TestimonialsPageContentForm";

export const instant = false;

export default async function TestimonialsPageContentAdminPage() {
  const content = await getTestimonialsPageContentAdmin();

  if (!content) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Testimonials page
      </h1>
      <TestimonialsPageContentForm content={content} />
    </>
  );
}
