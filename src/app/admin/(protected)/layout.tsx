import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const instant = false;

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminShell user={{ name: session.name, email: session.email }}>
      {children}
    </AdminShell>
  );
}
