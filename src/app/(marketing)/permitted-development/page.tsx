import type { Metadata } from "next";
import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getCategoryPageConfig } from "@/lib/category-pages";
import { getPackageTiers, getPackageNote } from "@/lib/packages";
import { getSiteSettings } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCategoryPageConfig("permitted-development");
  return pageMetadata({
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    fallbackTitle: config.heroTitle,
    fallbackDescription: config.heroTagline,
  });
}

export default async function PermittedDevelopmentPage() {
  const [config, packageTiers, packageNote, settings] = await Promise.all([
    getCategoryPageConfig("permitted-development"),
    getPackageTiers(),
    getPackageNote(),
    getSiteSettings(),
  ]);
  return (
    <CategoryPageTemplate
      config={config}
      packageTiers={packageTiers}
      packageNote={packageNote}
      promiseBullets={settings.promiseBullets}
    />
  );
}
