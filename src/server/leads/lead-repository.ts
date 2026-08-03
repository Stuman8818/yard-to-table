import type { PrismaClient } from "@prisma/client";

export function findLeadsForOrganization(prisma: PrismaClient, organizationId: string) {
  return prisma.lead.findMany({
    where: { organizationId },
    include: {
      requestedServices: true,
    },
    orderBy: {
      createdAt: "desc" as const,
    },
  });
}
