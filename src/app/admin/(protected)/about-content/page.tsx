import { getAboutPageContentAdmin } from "@/lib/admin/about-content";
import AboutContentForm from "@/components/admin/AboutContentForm";

export const instant = false;

export default async function AdminAboutContentPage() {
  const content = await getAboutPageContentAdmin();

  if (!content) {
    return <p>No about page content row found — run prisma/seed-home-about.ts.</p>;
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        About page content
      </h1>
      <AboutContentForm content={content} />
    </>
  );
}
