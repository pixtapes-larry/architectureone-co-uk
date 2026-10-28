import { getSiteSettingsAdmin } from "@/lib/admin/site-settings";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export const instant = false;

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsAdmin();

  if (!settings) {
    return <p>No site settings row found — run prisma/seed-site-settings.ts.</p>;
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Site settings
      </h1>
      <SiteSettingsForm settings={settings} />
    </>
  );
}
