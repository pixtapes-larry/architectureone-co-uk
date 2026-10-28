import { notFound } from "next/navigation";
import PackageDetailTemplate from "@/components/package/PackageDetailTemplate";
import { getPackageTiers, findPackageTier, getPackageNote } from "@/lib/packages";

export async function generateStaticParams() {
  const tiers = await getPackageTiers();
  return tiers.map((t) => ({ slug: t.slug }));
}

export const instant = false;

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
