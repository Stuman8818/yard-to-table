import type { ConsultationStatus, PrismaClient } from "@prisma/client";

const include = {
  customer: { select: { id: true, firstName: true, lastName: true } },
  property: {
    select: {
      id: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      state: true,
      postalCode: true,
    },
  },
  createdBy: { select: { name: true, email: true } },
  assignedUser: { select: { name: true, email: true } },
  lead: { select: { id: true, firstName: true, lastName: true } },
};

const readableDateTime = (value: Date) =>
  `${new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(value)} UTC`;

export async function scheduleConsultationForLead(
  prisma: PrismaClient,
  organizationId: string,
  userId: string,
  input: {
    leadId: string;
    type: "ON_SITE" | "PHONE";
    scheduledStart: Date;
    scheduledEnd: Date;
    notes?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findFirst({
      where: { id: input.leadId, organizationId },
      include: {
        consultations: {
          where: { status: "SCHEDULED", scheduledEnd: { gte: new Date() } },
          take: 1,
        },
        convertedCustomer: { include: { properties: { take: 1 } } },
      },
    });
    if (!lead) return null;
    if (lead.consultations.length)
      return { consultation: lead.consultations[0]!, duplicate: true, lead };

    let propertyId: string | null = null;
    if (input.type === "ON_SITE") {
      const existing =
        lead.convertedCustomer?.properties[0] ??
        (await tx.property.findFirst({ where: { leadId: lead.id, organizationId } }));
      const property = existing
        ? await tx.property.update({
            where: { id: existing.id },
            data: {
              addressLine1: input.addressLine1!,
              addressLine2: input.addressLine2 || null,
              city: input.city!,
              state: input.state!,
              postalCode: input.postalCode!,
            },
          })
        : await tx.property.create({
            data: {
              organizationId,
              leadId: lead.id,
              customerId: lead.convertedCustomer?.id,
              addressLine1: input.addressLine1!,
              addressLine2: input.addressLine2 || null,
              city: input.city!,
              state: input.state!,
              postalCode: input.postalCode!,
            },
          });
      propertyId = property.id;
    }
    const consultation = await tx.consultation.create({
      data: {
        organizationId,
        leadId: lead.id,
        customerId: lead.convertedCustomer?.id ?? null,
        propertyId,
        createdByUserId: userId,
        assignedUserId: userId,
        type: input.type,
        scheduledStart: input.scheduledStart,
        scheduledEnd: input.scheduledEnd,
        notes: input.notes || null,
      },
      include,
    });
    await tx.lead.update({ where: { id: lead.id }, data: { status: "CONSULTATION_SCHEDULED" } });
    await tx.leadNote.create({
      data: {
        leadId: lead.id,
        authorUserId: userId,
        content: `Consultation scheduled for ${readableDateTime(input.scheduledStart)}.`,
      },
    });
    return { consultation, duplicate: false, lead };
  });
}

export function findConsultationsForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  scope: "UPCOMING" | "PAST" | "ALL",
  now = new Date(),
) {
  return prisma.consultation.findMany({
    where: {
      organizationId,
      ...(scope === "UPCOMING"
        ? { scheduledEnd: { gte: now } }
        : scope === "PAST"
          ? { scheduledEnd: { lt: now } }
          : {}),
    },
    include,
    orderBy: { scheduledStart: scope === "PAST" ? "desc" : "asc" },
  });
}

export function findConsultationForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  id: string,
) {
  return prisma.consultation.findFirst({ where: { id, organizationId }, include });
}

export async function scheduleConsultation(
  prisma: PrismaClient,
  organizationId: string,
  createdByUserId: string,
  input: {
    customerId: string;
    propertyId: string;
    scheduledStart: Date;
    scheduledEnd: Date;
    notes?: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    const property = await tx.property.findFirst({
      where: { id: input.propertyId, customerId: input.customerId, organizationId },
      select: { id: true },
    });
    if (!property) return null;
    return tx.consultation.create({
      data: {
        organizationId,
        customerId: input.customerId,
        propertyId: property.id,
        createdByUserId,
        scheduledStart: input.scheduledStart,
        scheduledEnd: input.scheduledEnd,
        notes: input.notes || null,
      },
      include,
    });
  });
}

export async function updateConsultationForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  userId: string,
  input: {
    consultationId: string;
    status: ConsultationStatus;
    scheduledStart: Date;
    scheduledEnd: Date;
    notes?: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.consultation.findFirst({
      where: { id: input.consultationId, organizationId },
      select: { id: true, leadId: true, status: true },
    });
    if (!existing) return null;
    const consultation = await tx.consultation.update({
      where: { id: existing.id },
      data: {
        status: input.status,
        scheduledStart: input.scheduledStart,
        scheduledEnd: input.scheduledEnd,
        notes: input.notes || null,
      },
      include,
    });
    if (input.status === "CANCELED" && existing.status !== "CANCELED" && existing.leadId) {
      await tx.lead.update({
        where: { id: existing.leadId },
        data: { status: "CONTACTED" },
      });
      await tx.leadNote.create({
        data: {
          leadId: existing.leadId,
          authorUserId: userId,
          content: "Consultation cancelled.",
        },
      });
    }
    return consultation;
  });
}
