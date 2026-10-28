import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { getVisibleNavItems } from "@/lib/nav-items";

export const instant = false;

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = await getVisibleNavItems();
  return (
    <>
      <SiteHeader navItems={navItems} />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter />
    </>
  );
}
