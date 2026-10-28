import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getCategoryPageConfig } from "@/lib/category-pages";
import { getSiteSettings } from "@/lib/site-settings";

export const instant = false;

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
