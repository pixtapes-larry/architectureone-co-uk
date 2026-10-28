import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getCategoryPageConfig } from "@/lib/category-pages";
import { getSiteSettings } from "@/lib/site-settings";

export const instant = false;

export default async function LargeExtensionsPage() {
  const [config, settings] = await Promise.all([
    getCategoryPageConfig("large-extensions"),
    getSiteSettings(),
  ]);
  return (
    <CategoryPageTemplate
      config={config}
      promiseBullets={settings.promiseBullets}
    />
  );
}
