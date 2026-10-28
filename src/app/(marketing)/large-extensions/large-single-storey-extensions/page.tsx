import type { Metadata } from "next";
import SubTypePageTemplate from "@/components/subtype/SubTypePageTemplate";
import { getSubTypePageConfig } from "@/lib/sub-type-pages";
import { getProjectsByType } from "@/lib/projects";
import { ProjectType } from "@/generated/prisma/enums";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSubTypePageConfig(ProjectType.LARGE_SINGLE_STOREY_EXTENSIONS);
  return pageMetadata({
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    fallbackTitle: config.heroTitle,
    fallbackDescription: config.heroTagline,
  });
}

export default async function LargeSingleStoreyExtensionsPage() {
  const [config, examples] = await Promise.all([
    getSubTypePageConfig(ProjectType.LARGE_SINGLE_STOREY_EXTENSIONS),
    getProjectsByType(ProjectType.LARGE_SINGLE_STOREY_EXTENSIONS, 4),
  ]);
  return <SubTypePageTemplate config={config} examples={examples} />;
}
