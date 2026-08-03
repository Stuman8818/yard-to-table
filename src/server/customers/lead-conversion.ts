import { LeadStatus, Prisma, type PrismaClient } from "@prisma/client";

export class LeadAlreadyConvertedWithoutCustomerError extends Error {}

const customerInclude = {
  organization: { select: { name: true } },
  sourceLead: { select: { id: true } },
  properties: { orderBy: { createdAt: "asc" as const } },
};

export async function convertLeadToCustomer(
  prisma: PrismaClient,
  organizationId: string,
  leadId: string,
) {
  try {
    return await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findFirst({
        where: { id: leadId, organizationId },
        include: { convertedCustomer: { include: customerInclude } },
      });
      if (!lead) return null;
      if (lead.convertedCustomer) return lead.convertedCustomer;
      if (lead.status === LeadStatus.CONVERTED) {
        throw new LeadAlreadyConvertedWithoutCustomerError(
          "This lead is marked converted but has no customer record.",
        );
      }

      const customer = await tx.customer.create({
        data: {
          organizationId,
          sourceLeadId: lead.id,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          properties: {
            create: {
              organization: { connect: { id: organizationId } },
              addressLine1: lead.addressLine1,
              addressLine2: lead.addressLine2,
              city: lead.city,
              state: lead.state,
              postalCode: lead.postalCode,
            },
          },
        },
        include: customerInclude,
      });

      await tx.lead.update({
        where: { id: lead.id },
        data: { status: LeadStatus.CONVERTED, statusBeforeConversion: lead.status },
      });
      return customer;
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existingCustomer = await prisma.customer.findFirst({
        where: { sourceLeadId: leadId, organizationId },
        include: customerInclude,
      });
      if (existingCustomer) return existingCustomer;
    }
    throw error;
  }
}

export async function undoLeadConversion(
  prisma: PrismaClient,
  organizationId: string,
  leadId: string,
) {
  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findFirst({
      where: { id: leadId, organizationId },
      select: {
        id: true,
        statusBeforeConversion: true,
        convertedCustomer: { select: { id: true } },
      },
    });
    if (!lead?.convertedCustomer) return null;

    const deleted = await tx.customer.deleteMany({
      where: {
        id: lead.convertedCustomer.id,
        sourceLeadId: lead.id,
        organizationId,
      },
    });
    if (deleted.count !== 1) return null;

    return tx.lead.update({
      where: { id: lead.id },
      data: {
        status: lead.statusBeforeConversion ?? LeadStatus.CONTACTED,
        statusBeforeConversion: null,
      },
      include: {
        requestedServices: true,
        convertedCustomer: { select: { id: true } },
        internalNotes: {
          include: { author: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  });
}
