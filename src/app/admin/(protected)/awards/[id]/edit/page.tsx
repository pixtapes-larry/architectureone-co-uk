import { notFound } from "next/navigation";
import { getAwardAdmin } from "@/lib/admin/awards";
import { listProjectsForTestimonialPicker } from "@/lib/admin/testimonials";
import AwardForm from "@/components/admin/AwardForm";

export const instant = false;

export default async function EditAwardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [award, projects] = await Promise.all([
    getAwardAdmin(Number(id)),
    listProjectsForTestimonialPicker(),
  ]);

  if (!award) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit award
      </h1>
      <AwardForm award={award} projects={projects} />
    </>
  );
}
