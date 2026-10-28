import { getHomePageContentAdmin } from "@/lib/admin/home-content";
import HomeContentForm from "@/components/admin/HomeContentForm";

export const instant = false;

export default async function AdminHomeContentPage() {
  const content = await getHomePageContentAdmin();

  if (!content) {
    return <p>No home page content row found — run prisma/seed-home-about.ts.</p>;
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Home page content
      </h1>
      <HomeContentForm content={content} />
    </>
  );
}
