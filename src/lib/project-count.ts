// The live project count, substituted into copy via the literal
// "{projectCount}" token (see HomePageContent/AboutPageContent/
// ProjectsMapContent in prisma/schema.prisma) — so marketing copy can
// state a real, current number instead of a stale hardcoded one.
import { prisma } from "./prisma";

export async function getProjectCount(): Promise<number> {
  return prisma.project.count();
}

export function withProjectCount(text: string, count: number): string {
  return text.replaceAll("{projectCount}", String(count));
}
