import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getCategoryPageConfig } from "@/lib/category-pages";
import { getPackageTiers, getPackageNote } from "@/lib/packages";
import { getSiteSettings } from "@/lib/site-settings";

export const instant = false;

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
