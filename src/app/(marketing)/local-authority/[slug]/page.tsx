import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocalAuthorityTemplate from "@/components/local-authority/LocalAuthorityTemplate";
import {
  allLocalAuthoritySlugs,
  findLocalAuthorityBySlug,
  localAuthorityStats,
} from "@/lib/local-authorities";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await allLocalAuthoritySlugs();
  return slugs.map((slug) => ({ slug }));
}

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = await findLocalAuthorityBySlug(slug);
  if (!name) return {};

  const stats = await localAuthorityStats(name);
  return pageMetadata({
    metaTitle: stats.metaTitle,
    metaDescription: stats.metaDescription,
    fallbackTitle: `Architects in ${name}`,
    fallbackDescription:
      stats.blurb ??
      `${stats.total} project${stats.total === 1 ? "" : "s"} delivered in ${name} — extensions, loft conversions and new builds from Architecture ONE.`,
  });
}

export default async function LocalAuthorityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = await findLocalAuthorityBySlug(slug);

  if (!name) {
    notFound();
  }

  return <LocalAuthorityTemplate stats={await localAuthorityStats(name)} />;
}
