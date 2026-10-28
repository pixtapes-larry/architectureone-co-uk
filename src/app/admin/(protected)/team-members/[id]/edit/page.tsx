import { notFound } from "next/navigation";
import { getTeamMemberAdmin } from "@/lib/admin/about-content";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export const instant = false;

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMemberAdmin(Number(id));

  if (!member) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit team member — {member.name}
      </h1>
      <TeamMemberForm member={member} />
    </>
  );
}
