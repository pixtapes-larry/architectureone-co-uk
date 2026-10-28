import { notFound } from "next/navigation";
import { getBookConsultationPageContentAdmin } from "@/lib/admin/book-consultation-content";
import BookConsultationPageContentForm from "@/components/admin/BookConsultationPageContentForm";

export const instant = false;

export default async function BookConsultationPageContentAdminPage() {
  const content = await getBookConsultationPageContentAdmin();

  if (!content) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Book a Consultation page
      </h1>
      <BookConsultationPageContentForm content={content} />
    </>
  );
}
