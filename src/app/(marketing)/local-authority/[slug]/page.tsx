import { notFound } from "next/navigation";
import LocalAuthorityTemplate from "@/components/local-authority/LocalAuthorityTemplate";
import {
  allLocalAuthoritySlugs,
  findLocalAuthorityBySlug,
  localAuthorityStats,
} from "@/lib/local-authorities";

export async function generateStaticParams() {
  const slugs = await allLocalAuthoritySlugs();
  return slugs.map((slug) => ({ slug }));
}

export const instant = false;

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
