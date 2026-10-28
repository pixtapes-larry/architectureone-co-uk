import type { Metadata } from "next";
import SubTypePageTemplate from "@/components/subtype/SubTypePageTemplate";
import { getSubTypePageConfig } from "@/lib/sub-type-pages";
import { getProjectsByType } from "@/lib/projects";
import { getPackageTiers, getPackageNote } from "@/lib/packages";
import { ProjectType } from "@/generated/prisma/enums";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSubTypePageConfig(ProjectType.LOFT_CONVERSIONS);
  return pageMetadata({
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    fallbackTitle: config.heroTitle,
    fallbackDescription: config.heroTagline,
  });
}

export default async function LoftConversionsPage() {
  const [config, examples, packageTiers, packageNote] = await Promise.all([
    getSubTypePageConfig(ProjectType.LOFT_CONVERSIONS),
    getProjectsByType(ProjectType.LOFT_CONVERSIONS, 4),
    getPackageTiers(),
    getPackageNote(),
  ]);
  return (
    <SubTypePageTemplate
      config={config}
      examples={examples}
      packageTiers={packageTiers}
      packageNote={packageNote}
    />
  );
}
