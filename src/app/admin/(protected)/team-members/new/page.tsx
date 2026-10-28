import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default function NewTeamMemberPage() {
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        New team member
      </h1>
      <TeamMemberForm />
    </>
  );
}
