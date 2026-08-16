import type { PrismaClient } from "@prisma/client";

export function findCustomersForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  search?: string,
) {
  return prisma.customer.findMany({
    where: {
      organizationId,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { properties: { orderBy: { createdAt: "asc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });
}

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
