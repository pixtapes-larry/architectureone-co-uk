import AwardForm from "@/components/admin/AwardForm";
import { listProjectsForTestimonialPicker } from "@/lib/admin/testimonials";

export const instant = false;

export default async function NewAwardPage() {
  const projects = await listProjectsForTestimonialPicker();
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        New award
      </h1>
      <AwardForm projects={projects} />
    </>
  );
}
