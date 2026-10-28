import SubTypePageTemplate from "@/components/subtype/SubTypePageTemplate";
import { getSubTypePageConfig } from "@/lib/sub-type-pages";
import { getProjectsByType } from "@/lib/projects";
import { ProjectType } from "@/generated/prisma/enums";

export const instant = false;

export default async function NewBuildsPage() {
  const [config, examples] = await Promise.all([
    getSubTypePageConfig(ProjectType.NEW_BUILDS),
    getProjectsByType(ProjectType.NEW_BUILDS, 4),
  ]);
  return <SubTypePageTemplate config={config} examples={examples} />;
}
