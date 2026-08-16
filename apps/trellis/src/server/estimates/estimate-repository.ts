import type { EstimateStatus, PrismaClient } from "@prisma/client";

export type EstimateFields = {
  details?: string;
  notes?: string;
  lineItems: { description: string; quantity: number; unitPriceCents: number }[];
};

const include = {
  lead: { include: { requestedServices: true } },
  consultation: true,
  assessment: true,
  lineItems: { orderBy: { sortOrder: "asc" as const } },
  createdBy: { select: { name: true, email: true } },
};

const calculatedItems = (items: EstimateFields["lineItems"]) =>
  items.map((item, sortOrder) => ({
    description: item.description,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    totalCents: Math.round(item.quantity * item.unitPriceCents),
    sortOrder,
  }));

export function findEstimatesForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  filters: { search?: string; status?: EstimateStatus },
) {
  return prisma.estimate.findMany({
    where: {
      organizationId,
      status: filters.status,
      ...(filters.search
        ? {
            OR: [
              { details: { contains: filters.search, mode: "insensitive" } },
              { lead: { firstName: { contains: filters.search, mode: "insensitive" } } },
              { lead: { lastName: { contains: filters.search, mode: "insensitive" } } },
              { lead: { email: { contains: filters.search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include,
    orderBy: { updatedAt: "desc" },
  });
}

export function findEstimateForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  id: string,
) {
  return prisma.estimate.findFirst({ where: { id, organizationId }, include });
}

export function findEstimateContextForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  leadId: string,
) {
  return prisma.lead.findFirst({
    where: { id: leadId, organizationId },
    include: {
      requestedServices: true,
      estimate: { include: { lineItems: { orderBy: { sortOrder: "asc" } } } },
      consultations: {
        where: { status: "COMPLETED" },
        orderBy: { scheduledStart: "desc" },
        take: 1,
      },
      assessments: { where: { status: "COMPLETED" }, orderBy: { completedAt: "desc" }, take: 1 },
    },
  });
}

export async function createEstimateForLead(
  prisma: PrismaClient,
  organizationId: string,
  userId: string,
  leadId: string,
  fields: EstimateFields,
) {
  return prisma.$transaction(async (tx) => {
    const membership = await tx.organizationMembership.findFirst({
      where: { organizationId, userId },
      select: { id: true },
    });
    if (!membership) return null;
    const lead = await tx.lead.findFirst({
      where: { id: leadId, organizationId },
      include: {
        estimate: true,
        consultations: {
          where: { status: "COMPLETED" },
          orderBy: { scheduledStart: "desc" },
          take: 1,
        },
        assessments: { where: { status: "COMPLETED" }, orderBy: { completedAt: "desc" }, take: 1 },
      },
    });
    if (!lead) return null;
    if (lead.estimate) return { estimate: lead.estimate, duplicate: true };
    const consultation = lead.consultations[0];
    const assessment = lead.assessments[0];
    const items = calculatedItems(fields.lineItems);
    const estimate = await tx.estimate.create({
      data: {
        organizationId,
        leadId: lead.id,
        consultationId: consultation?.id,
        assessmentId: assessment?.id,
        createdByUserId: userId,
        details: fields.details || null,
        notes: fields.notes || null,
        totalCents: items.reduce((sum, item) => sum + item.totalCents, 0),
        lineItems: { create: items },
      },
      include,
    });
    await tx.leadNote.create({
      data: { leadId: lead.id, authorUserId: userId, content: "Estimate saved as draft" },
    });
    return { estimate, duplicate: false };
  });
}

export async function updateEstimateForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  userId: string,
  estimateId: string,
  fields: EstimateFields,
) {
  return prisma.$transaction(async (tx) => {
    const membership = await tx.organizationMembership.findFirst({
      where: { organizationId, userId },
      select: { id: true },
    });
    if (!membership) return null;
    const existing = await tx.estimate.findFirst({
      where: { id: estimateId, organizationId, status: "DRAFT" },
      select: { id: true, leadId: true },
    });
    if (!existing) return null;
    const items = calculatedItems(fields.lineItems);
    await tx.estimateLineItem.deleteMany({ where: { estimateId: existing.id } });
    const estimate = await tx.estimate.update({
      where: { id: existing.id },
      data: {
        details: fields.details || null,
        notes: fields.notes || null,
        totalCents: items.reduce((sum, item) => sum + item.totalCents, 0),
        lineItems: { create: items },
      },
      include,
    });
    await tx.leadNote.create({
      data: { leadId: existing.leadId, authorUserId: userId, content: "Estimate saved as draft" },
    });
    return estimate;
  });
}

export async function completeEstimateForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  userId: string,
  estimateId: string,
) {
  return prisma.$transaction(async (tx) => {
    const membership = await tx.organizationMembership.findFirst({
      where: { organizationId, userId },
      select: { id: true },
    });
    if (!membership) return null;
    const existing = await tx.estimate.findFirst({
      where: { id: estimateId, organizationId },
      include: { lineItems: true },
    });
    if (!existing || !existing.lineItems.length) return null;
    if (existing.status === "COMPLETED") {
      await tx.lead.updateMany({
        where: { id: existing.leadId, organizationId, status: { not: "ESTIMATE_COMPLETED" } },
        data: { status: "ESTIMATE_COMPLETED" },
      });
      return tx.estimate.findFirst({ where: { id: existing.id, organizationId }, include });
    }
    const estimate = await tx.estimate.update({
      where: { id: existing.id },
      data: { status: "COMPLETED", completedAt: new Date() },
      include,
    });
    await tx.lead.update({
      where: { id: existing.leadId },
      data: { status: "ESTIMATE_COMPLETED" },
    });
    await tx.leadNote.create({
      data: { leadId: existing.leadId, authorUserId: userId, content: "Estimate Completed" },
    });
    return estimate;
  });
}
