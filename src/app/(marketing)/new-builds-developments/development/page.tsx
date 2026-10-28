import SubTypePageTemplate from "@/components/subtype/SubTypePageTemplate";
import { getSubTypePageConfig } from "@/lib/sub-type-pages";
import { getProjectsByType } from "@/lib/projects";
import { ProjectType } from "@/generated/prisma/enums";

export const instant = false;

export default async function DevelopmentPage() {
  const [config, examples] = await Promise.all([
    getSubTypePageConfig(ProjectType.DEVELOPMENT),
    getProjectsByType(ProjectType.DEVELOPMENT, 4),
  ]);
  return <SubTypePageTemplate config={config} examples={examples} />;
}
