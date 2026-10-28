import { getPrivacyPageContentAdmin } from "@/lib/admin/privacy-content";
import PrivacyContentForm from "@/components/admin/PrivacyContentForm";

export const instant = false;

export default async function AdminPrivacyContentPage() {
  const content = await getPrivacyPageContentAdmin();

  if (!content) {
    return <p>No privacy page content row found — run prisma/seed-contact-privacy.ts.</p>;
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Privacy page content
      </h1>
      <PrivacyContentForm content={content} />
    </>
  );
}
