import { describe, expect, it, vi } from "vitest";
import {
  completeAssessmentForOrganization,
  createAssessmentForConsultation,
  findAssessmentForOrganization,
  updateAssessmentForOrganization,
} from "./assessment-repository";

const membership = { id: "membership-1" };

describe("tenant-scoped property assessments", () => {
  it("scopes assessment reads to the organization", async () => {
    const findFirst = vi.fn();
    await findAssessmentForOrganization(
      { propertyAssessment: { findFirst } } as never,
      "org-1",
      "a-1",
    );
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "a-1", organizationId: "org-1" } }),
    );
  });

  it("creates a draft from the completed consultation context and records activity", async () => {
    const assessment = { id: "assessment-1", status: "DRAFT" };
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      consultation: {
        findFirst: vi.fn().mockResolvedValue({
          id: "c-1",
          leadId: "lead-1",
          propertyId: "property-1",
          assessment: null,
        }),
      },
      propertyAssessment: { create: vi.fn().mockResolvedValue(assessment) },
      leadNote: { create: vi.fn() },
      customer: { create: vi.fn() },
    };
    const result = await createAssessmentForConsultation(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "c-1",
      { requestedWork: "Replace beds" },
    );
    expect(result).toEqual({ assessment, duplicate: false });
    expect(tx.consultation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          organizationId: "org-1",
          status: "COMPLETED",
        }),
      }),
    );
    expect(tx.propertyAssessment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          organizationId: "org-1",
          leadId: "lead-1",
          consultationId: "c-1",
          propertyId: "property-1",
          createdByUserId: "user-1",
        }),
      }),
    );
    expect(tx.leadNote.create).toHaveBeenCalledTimes(1);
    expect(tx.leadNote.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-1",
        authorUserId: "user-1",
        content: "Property Assessment saved as draft",
      },
    });
    expect(tx.customer.create).not.toHaveBeenCalled();
  });

  it("returns the existing assessment instead of creating a duplicate", async () => {
    const existing = { id: "assessment-1", status: "DRAFT" };
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      consultation: {
        findFirst: vi.fn().mockResolvedValue({
          id: "c-1",
          leadId: "lead-1",
          propertyId: "property-1",
          assessment: existing,
        }),
      },
      propertyAssessment: { create: vi.fn() },
      leadNote: { create: vi.fn() },
    };
    const result = await createAssessmentForConsultation(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "c-1",
      {},
    );
    expect(result).toEqual({ assessment: existing, duplicate: true });
    expect(tx.propertyAssessment.create).not.toHaveBeenCalled();
    expect(tx.leadNote.create).not.toHaveBeenCalled();
  });

  it("updates a draft and records activity", async () => {
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      propertyAssessment: {
        findFirst: vi.fn().mockResolvedValue({ id: "a-1", leadId: "lead-1" }),
        update: vi.fn().mockResolvedValue({ id: "a-1", status: "DRAFT" }),
      },
      leadNote: { create: vi.fn() },
    };
    await updateAssessmentForOrganization(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "a-1",
      { generalNotes: "Gate is narrow" },
    );
    expect(tx.propertyAssessment.update).toHaveBeenCalled();
    expect(tx.leadNote.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ content: "Property Assessment saved as draft" }),
      }),
    );
  });

  it("allows a completed assessment to be edited and records the requested history note", async () => {
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      propertyAssessment: {
        findFirst: vi.fn().mockResolvedValue({
          id: "a-1",
          leadId: "lead-1",
          status: "COMPLETED",
        }),
        update: vi.fn().mockResolvedValue({ id: "a-1", status: "COMPLETED" }),
      },
      leadNote: { create: vi.fn() },
    };
    await updateAssessmentForOrganization(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "a-1",
      { generalNotes: "Updated measurements" },
    );

    expect(tx.propertyAssessment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { in: ["DRAFT", "IN_PROGRESS", "COMPLETED"] },
        }),
      }),
    );
    expect(tx.leadNote.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-1",
        authorUserId: "user-1",
        content: "Property Assessment Edited",
      },
    });
  });

  it("completes an assessment, sets completedAt, and creates no downstream records", async () => {
    const completed = { id: "a-1", status: "COMPLETED", completedAt: new Date() };
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      propertyAssessment: {
        findFirst: vi.fn().mockResolvedValue({
          id: "a-1",
          leadId: "lead-1",
          status: "DRAFT",
          requestedWork: "Replace beds",
        }),
        update: vi.fn().mockResolvedValue(completed),
      },
      lead: { update: vi.fn() },
      consultation: { update: vi.fn() },
      leadNote: { create: vi.fn() },
      customer: { create: vi.fn() },
    };
    const result = await completeAssessmentForOrganization(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "a-1",
    );
    expect(result).toBe(completed);
    expect(tx.propertyAssessment.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "COMPLETED", completedAt: expect.any(Date) } }),
    );
    expect(tx.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: { status: "ASSESSMENT_COMPLETED" },
    });
    expect(tx.consultation.update).not.toHaveBeenCalled();
    expect(tx.leadNote.create).toHaveBeenCalledTimes(1);
    expect(tx.leadNote.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-1",
        authorUserId: "user-1",
        content: "Property Assessment Completed",
      },
    });
    expect(tx.customer.create).not.toHaveBeenCalled();
  });

  it("rejects cross-organization creation before reading consultation context", async () => {
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(null) },
      consultation: { findFirst: vi.fn() },
      propertyAssessment: { create: vi.fn() },
      leadNote: { create: vi.fn() },
    };
    const result = await createAssessmentForConsultation(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "other-user",
      "c-1",
      {},
    );
    expect(result).toBeNull();
    expect(tx.consultation.findFirst).not.toHaveBeenCalled();
    expect(tx.propertyAssessment.create).not.toHaveBeenCalled();
  });
});
