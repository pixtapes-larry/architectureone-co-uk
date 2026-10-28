import SubTypePageTemplate from "@/components/subtype/SubTypePageTemplate";
import { getSubTypePageConfig } from "@/lib/sub-type-pages";
import { getProjectsByType } from "@/lib/projects";
import { getPackageTiers, getPackageNote } from "@/lib/packages";
import { ProjectType } from "@/generated/prisma/enums";

export const instant = false;

export default async function GarageConversionsPage() {
  const [config, examples, packageTiers, packageNote] = await Promise.all([
    getSubTypePageConfig(ProjectType.GARAGE_CONVERSIONS),
    getProjectsByType(ProjectType.GARAGE_CONVERSIONS, 4),
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
