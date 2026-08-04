import type { PrismaClient } from "@prisma/client";

const include = {
  lead: {
    include: { requestedServices: true },
  },
  consultation: true,
  property: true,
  createdBy: { select: { name: true, email: true } },
};

export type AssessmentFields = {
  requestedWork?: string;
  generalNotes?: string;
  accessDifficulty?: string;
  estimatedLaborHours?: number;
  recommendedCrewSize?: number;
  materialsNeeded?: string;
  equipmentNeeded?: string;
  disposalNeeded?: string;
};

const dataFromFields = (fields: AssessmentFields) => ({
  requestedWork: fields.requestedWork || null,
  generalNotes: fields.generalNotes || null,
  accessDifficulty: fields.accessDifficulty || null,
  estimatedLaborHours: fields.estimatedLaborHours ?? null,
  recommendedCrewSize: fields.recommendedCrewSize ?? null,
  materialsNeeded: fields.materialsNeeded || null,
  equipmentNeeded: fields.equipmentNeeded || null,
  disposalNeeded: fields.disposalNeeded || null,
});

export function findAssessmentForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  id: string,
) {
  return prisma.propertyAssessment.findFirst({ where: { id, organizationId }, include });
}

export function findAssessmentContextForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  consultationId: string,
) {
  return prisma.consultation.findFirst({
    where: {
      id: consultationId,
      organizationId,
      status: "COMPLETED",
      outcome: "ASSESSMENT_NEEDED",
    },
    include: { lead: { include: { requestedServices: true } }, property: true, assessment: true },
  });
}

export async function createAssessmentForConsultation(
  prisma: PrismaClient,
  organizationId: string,
  userId: string,
  consultationId: string,
  fields: AssessmentFields,
) {
  return prisma.$transaction(async (tx) => {
    const membership = await tx.organizationMembership.findFirst({
      where: { organizationId, userId },
      select: { id: true },
    });
    if (!membership) return null;
    const consultation = await tx.consultation.findFirst({
      where: {
        id: consultationId,
        organizationId,
        status: "COMPLETED",
        outcome: "ASSESSMENT_NEEDED",
      },
      include: { assessment: true },
    });
    if (!consultation?.leadId || !consultation.propertyId) return null;
    if (consultation.assessment) return { assessment: consultation.assessment, duplicate: true };
    const assessment = await tx.propertyAssessment.create({
      data: {
        organizationId,
        leadId: consultation.leadId,
        consultationId: consultation.id,
        propertyId: consultation.propertyId,
        createdByUserId: userId,
        ...dataFromFields(fields),
      },
      include,
    });
    await tx.leadNote.create({
      data: {
        leadId: consultation.leadId,
        authorUserId: userId,
        content: "Property Assessment saved as draft",
      },
    });
    return { assessment, duplicate: false };
  });
}

export async function updateAssessmentForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  userId: string,
  assessmentId: string,
  fields: AssessmentFields,
) {
  return prisma.$transaction(async (tx) => {
    const membership = await tx.organizationMembership.findFirst({
      where: { organizationId, userId },
      select: { id: true },
    });
    if (!membership) return null;
    const existing = await tx.propertyAssessment.findFirst({
      where: {
        id: assessmentId,
        organizationId,
        status: { in: ["DRAFT", "IN_PROGRESS", "COMPLETED"] },
      },
      select: { id: true, leadId: true, status: true },
    });
    if (!existing) return null;
    const assessment = await tx.propertyAssessment.update({
      where: { id: existing.id },
      data: dataFromFields(fields),
      include,
    });
    await tx.leadNote.create({
      data: {
        leadId: existing.leadId,
        authorUserId: userId,
        content:
          existing.status === "COMPLETED"
            ? "Property Assessment Edited"
            : "Property Assessment saved as draft",
      },
    });
    return assessment;
  });
}

export async function completeAssessmentForOrganization(
  prisma: PrismaClient,
  organizationId: string,
  userId: string,
  assessmentId: string,
) {
  return prisma.$transaction(async (tx) => {
    const membership = await tx.organizationMembership.findFirst({
      where: { organizationId, userId },
      select: { id: true },
    });
    if (!membership) return null;
    const existing = await tx.propertyAssessment.findFirst({
      where: { id: assessmentId, organizationId },
      select: { id: true, leadId: true, status: true, requestedWork: true },
    });
    if (!existing || !existing.requestedWork?.trim()) return null;
    if (existing.status === "COMPLETED")
      return tx.propertyAssessment.findFirst({
        where: { id: existing.id, organizationId },
        include,
      });
    if (existing.status === "CANCELLED") return null;
    const assessment = await tx.propertyAssessment.update({
      where: { id: existing.id },
      data: { status: "COMPLETED", completedAt: new Date() },
      include,
    });
    await tx.lead.update({
      where: { id: existing.leadId },
      data: { status: "ASSESSMENT_COMPLETED" },
    });
    await tx.leadNote.create({
      data: {
        leadId: existing.leadId,
        authorUserId: userId,
        content: "Property Assessment Completed",
      },
    });
    return assessment;
  });
}
