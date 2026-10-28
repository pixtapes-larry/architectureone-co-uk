import { prisma } from "../prisma";
import { allLocalAuthorityNames } from "../local-authorities";

export type LocalAuthorityBlurbRow = { name: string; blurb: string | null };

// Every local authority that actually has projects, each paired with its
// blurb if one's been written (most won't have one yet — that's fine, the
// public page falls back to the computed project-count line).
export async function listLocalAuthorityBlurbsAdmin(): Promise<LocalAuthorityBlurbRow[]> {
  const [names, infos] = await Promise.all([
    allLocalAuthorityNames(),
    prisma.localAuthorityInfo.findMany(),
  ]);
  const blurbByName = new Map(infos.map((i) => [i.localAuthority, i.blurb]));
  return names
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, blurb: blurbByName.get(name) ?? null }));
}

export async function getLocalAuthorityBlurbAdmin(name: string) {
  return prisma.localAuthorityInfo.findUnique({ where: { localAuthority: name } });
}

export async function updateLocalAuthorityBlurbAdmin(name: string, blurb: string) {
  return prisma.localAuthorityInfo.upsert({
    where: { localAuthority: name },
    update: { blurb: blurb || null },
    create: { localAuthority: name, blurb: blurb || null },
  });
}
