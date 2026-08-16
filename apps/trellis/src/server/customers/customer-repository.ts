import type { PrismaClient } from "@prisma/client";

export function findCustomerForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  customerId: string,
) {
  return prisma.customer.findFirst({
    where: { id: customerId, organizationId },
    include: {
      organization: { select: { name: true } },
      sourceLead: { select: { id: true } },
      properties: { orderBy: { createdAt: "asc" } },
      consultations: {
        include: {
          property: {
            select: { id: true, addressLine1: true, city: true, state: true, postalCode: true },
          },
        },
        orderBy: { scheduledStart: "desc" },
      },
    },
  });
}
