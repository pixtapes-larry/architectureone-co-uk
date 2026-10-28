import { notFound } from "next/navigation";
import { getServicesPageContentAdmin } from "@/lib/admin/services-page-content";
import ServicesPageContentForm from "@/components/admin/ServicesPageContentForm";

export const instant = false;

export default async function ServicesPageContentAdminPage() {
  const content = await getServicesPageContentAdmin();

  if (!content) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Services page
      </h1>
      <ServicesPageContentForm content={content} />
    </>
  );
}
