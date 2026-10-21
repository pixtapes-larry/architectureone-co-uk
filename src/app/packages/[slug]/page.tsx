import { notFound } from "next/navigation";
import PackageDetailTemplate from "@/components/package/PackageDetailTemplate";
import { PD_PACKAGE_TIERS, findPackageTier } from "@/lib/packages";

export async function generateStaticParams() {
  return PD_PACKAGE_TIERS.map((t) => ({ slug: t.slug }));
}

export const instant = false;

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tier = findPackageTier(slug);

  if (!tier) {
    notFound();
  }

  return <PackageDetailTemplate tier={tier} />;
}
