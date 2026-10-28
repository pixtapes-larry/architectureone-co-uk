import { notFound } from "next/navigation";
import { getCategoryPageAdmin } from "@/lib/admin/category-pages";
import CategoryPageForm from "@/components/admin/CategoryPageForm";

export const instant = false;

export default async function EditCategoryPagePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const page = await getCategoryPageAdmin(category);

  if (!page) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit category page — {page.heroTitle}
      </h1>
      <CategoryPageForm page={page} />
    </>
  );
}
