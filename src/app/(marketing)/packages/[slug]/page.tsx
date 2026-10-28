import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PackageDetailTemplate from "@/components/package/PackageDetailTemplate";
import { getPackageTiers, findPackageTier, getPackageNote } from "@/lib/packages";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const tiers = await getPackageTiers();
  return tiers.map((t) => ({ slug: t.slug }));
}

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tier = await findPackageTier(slug);
  if (!tier) return {};

  return pageMetadata({
    metaTitle: tier.metaTitle,
    metaDescription: tier.metaDescription,
    fallbackTitle: `${tier.name} Package`,
    fallbackDescription: `${tier.name} package — a fixed-price permitted development service from ${tier.price}.`,
  });
}

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tier, allTiers, note] = await Promise.all([
    findPackageTier(slug),
    getPackageTiers(),
    getPackageNote(),
  ]);

  if (!tier) {
    notFound();
  }

  return <PackageDetailTemplate tier={tier} allTiers={allTiers} note={note} />;
}
