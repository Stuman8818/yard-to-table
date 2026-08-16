import type { LeadStatus, PrismaClient } from "@prisma/client";

import type { LeadListFilters } from "@/lib/validation/lead-management";
import { deriveLeadWorkflowStatus } from "@/lib/lead-workflow";

export async function findLeadsForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  filters: LeadListFilters = { sort: "newest" },
) {
  const search = filters.search?.trim();
  const leads = await prisma.lead.findMany({
    where: {
      organizationId,
      ...(search
        ? {
            OR: ["firstName", "lastName", "email", "phone"].map((field) => ({
              [field]: { contains: search, mode: "insensitive" as const },
            })),
          }
        : {}),
    },
    include: {
      requestedServices: true,
      convertedCustomer: { select: { id: true } },
      estimate: { select: { status: true } },
      consultations: {
        select: { status: true, assessment: { select: { status: true } } },
      },
    },
    orderBy: { createdAt: filters.sort === "oldest" ? "asc" : "desc" },
  });
  return filters.status
    ? leads.filter((lead) => deriveLeadWorkflowStatus(lead) === filters.status)
    : leads;
}

export function findLeadForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  leadId: string,
) {
  return prisma.lead.findFirst({
    where: { id: leadId, organizationId },
    include: {
      requestedServices: true,
      convertedCustomer: { select: { id: true } },
      estimate: { select: { id: true, status: true, totalCents: true } },
      consultations: {
        where: { status: { in: ["SCHEDULED", "COMPLETED"] } },
        include: {
          assignedUser: { select: { name: true, email: true } },
          assessment: { select: { id: true, status: true } },
        },
        orderBy: { scheduledStart: "desc" },
      },
      internalNotes: {
        include: { author: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function updateLeadStatusForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  leadId: string,
  status: LeadStatus,
) {
  const result = await prisma.lead.updateMany({
    where: { id: leadId, organizationId },
    data: { status },
  });
  if (result.count !== 1) return null;
  return findLeadForOrganization(prisma, organizationId, leadId);
}

export async function addLeadNoteForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  leadId: string,
  authorUserId: string,
  content: string,
) {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, organizationId },
    select: { id: true },
  });
  if (!lead) return null;

  return prisma.leadNote.create({
    data: { leadId: lead.id, authorUserId, content },
    include: { author: { select: { name: true, email: true } } },
  });
}
