import type { Metadata } from "next";
import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getCategoryPageConfig } from "@/lib/category-pages";
import { getSiteSettings } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCategoryPageConfig("new-builds-developments");
  return pageMetadata({
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    fallbackTitle: config.heroTitle,
    fallbackDescription: config.heroTagline,
  });
}

export default async function NewBuildsDevelopmentsPage() {
  const [config, settings] = await Promise.all([
    getCategoryPageConfig("new-builds-developments"),
    getSiteSettings(),
  ]);
  return (
    <CategoryPageTemplate
      config={config}
      promiseBullets={settings.promiseBullets}
    />
  );
}
