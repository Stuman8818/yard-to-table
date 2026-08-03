import type { Prisma } from "@prisma/client";

export const CURRENT_ORGANIZATION_SLUG = "yard-to-table";
export const CURRENT_ORGANIZATION_NAME = "Yard To Table";

interface OrganizationLookupRepository {
  findUnique(args: {
    where: { slug: string };
    select: { id: true };
  }): Promise<{ id: string } | null>;
}

interface OrganizationSeedRepository {
  upsert(args: {
    where: { slug: string };
    update: { name: string };
    create: Prisma.OrganizationCreateInput;
    select: { id: true };
  }): Promise<{ id: string }>;
}

export async function resolveCurrentOrganization(
  repository: OrganizationLookupRepository,
): Promise<{ id: string }> {
  const organization = await repository.findUnique({
    where: { slug: CURRENT_ORGANIZATION_SLUG },
    select: { id: true },
  });

  if (!organization) {
    throw new Error(`Current organization '${CURRENT_ORGANIZATION_SLUG}' is not configured.`);
  }

  return organization;
}

export async function seedCurrentOrganization(
  repository: OrganizationSeedRepository,
): Promise<{ id: string }> {
  return repository.upsert({
    where: { slug: CURRENT_ORGANIZATION_SLUG },
    update: { name: CURRENT_ORGANIZATION_NAME },
    create: {
      name: CURRENT_ORGANIZATION_NAME,
      slug: CURRENT_ORGANIZATION_SLUG,
    },
    select: { id: true },
  });
}
