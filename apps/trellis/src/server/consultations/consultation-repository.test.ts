import { describe, expect, it, vi } from "vitest";
import {
  completeConsultationForOrganization,
  findConsultationForOrganization,
  findConsultationsForOrganization,
  markConsultationLeadLost,
  scheduleConsultation,
  scheduleConsultationForLead,
  updateConsultationForOrganization,
} from "./consultation-repository";

describe("tenant-scoped consultations", () => {
  it("scopes detail reads to the organization", async () => {
    const findFirst = vi.fn();
    await findConsultationForOrganization({ consultation: { findFirst } } as never, "org-1", "c-1");
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "c-1", organizationId: "org-1" } }),
    );
  });
  it("sorts upcoming consultations nearest first", async () => {
    const findMany = vi.fn();
    const now = new Date();
    await findConsultationsForOrganization(
      { consultation: { findMany } } as never,
      "org-1",
      "UPCOMING",
      now,
    );
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: "org-1", scheduledEnd: { gte: now } },
        orderBy: { scheduledStart: "asc" },
      }),
    );
  });
  it("only schedules a property belonging to the scoped customer", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const create = vi.fn();
    const tx = { property: { findFirst }, consultation: { create } };
    const prisma = { $transaction: vi.fn((fn) => fn(tx)) };
    await expect(
      scheduleConsultation(prisma as never, "org-1", "user-1", {
        customerId: "customer-1",
        propertyId: "other-property",
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 3600000),
      }),
    ).resolves.toBeNull();
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "other-property", customerId: "customer-1", organizationId: "org-1" },
      }),
    );
    expect(create).not.toHaveBeenCalled();
  });
  it("schedules an on-site consultation and advances the lead", async () => {
    const lead = {
      id: "lead-1",
      email: "lead@example.com",
      consultations: [],
      convertedCustomer: null,
    };
    const property = { id: "property-1" };
    const consultation = { id: "consultation-1" };
    const tx = {
      lead: {
        findFirst: vi.fn().mockResolvedValue(lead),
        update: vi.fn(),
      },
      property: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(property),
        update: vi.fn(),
      },
      consultation: { create: vi.fn().mockResolvedValue(consultation) },
      leadNote: { create: vi.fn() },
    };
    const prisma = { $transaction: vi.fn((fn) => fn(tx)) };
    const start = new Date("2026-08-04T17:00:00.000Z");
    const result = await scheduleConsultationForLead(prisma as never, "org-1", "user-1", {
      leadId: lead.id,
      type: "ON_SITE",
      scheduledStart: start,
      scheduledEnd: new Date("2026-08-04T18:00:00.000Z"),
      addressLine1: "123 Main St",
      city: "Spokane",
      state: "WA",
      postalCode: "99201",
    });

    expect(result).toEqual({ consultation, duplicate: false, lead });
    expect(tx.property.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ leadId: lead.id }) }),
    );
    expect(tx.consultation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ leadId: lead.id, propertyId: property.id }),
      }),
    );
    expect(tx.lead.update).toHaveBeenCalledWith({
      where: { id: lead.id },
      data: { status: "CONSULTATION_SCHEDULED" },
    });
    expect(tx.leadNote.create).toHaveBeenCalled();
  });
  it("does not create a property for a phone consultation", async () => {
    const lead = { id: "lead-1", consultations: [], convertedCustomer: null };
    const tx = {
      lead: { findFirst: vi.fn().mockResolvedValue(lead), update: vi.fn() },
      property: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
      consultation: { create: vi.fn().mockResolvedValue({ id: "consultation-1" }) },
      leadNote: { create: vi.fn() },
    };
    const prisma = { $transaction: vi.fn((fn) => fn(tx)) };
    await scheduleConsultationForLead(prisma as never, "org-1", "user-1", {
      leadId: lead.id,
      type: "PHONE",
      scheduledStart: new Date("2026-08-04T17:00:00.000Z"),
      scheduledEnd: new Date("2026-08-04T17:30:00.000Z"),
    });

    expect(tx.property.findFirst).not.toHaveBeenCalled();
    expect(tx.property.create).not.toHaveBeenCalled();
    expect(tx.consultation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ propertyId: null, type: "PHONE" }),
      }),
    );
  });
  it("updates only a consultation in the organization", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const update = vi.fn();
    const tx = { consultation: { findFirst, update } };
    const result = await updateConsultationForOrganization(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      {
        consultationId: "other",
        status: "COMPLETED",
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 3600000),
      },
    );
    expect(result).toBeNull();
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "other", organizationId: "org-1" } }),
    );
    expect(update).not.toHaveBeenCalled();
  });
  it("returns a cancelled lead consultation to contacted and records activity", async () => {
    const consultation = { id: "consultation-1", leadId: "lead-1", status: "SCHEDULED" };
    const tx = {
      consultation: {
        findFirst: vi.fn().mockResolvedValue(consultation),
        update: vi.fn().mockResolvedValue({ ...consultation, status: "CANCELED" }),
      },
      lead: { update: vi.fn() },
      leadNote: { create: vi.fn() },
    };
    const prisma = { $transaction: vi.fn((fn) => fn(tx)) };
    await updateConsultationForOrganization(prisma as never, "org-1", "user-1", {
      consultationId: consultation.id,
      status: "CANCELED",
      scheduledStart: new Date("2026-08-04T17:00:00.000Z"),
      scheduledEnd: new Date("2026-08-04T18:00:00.000Z"),
    });

    expect(tx.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: { status: "CONTACTED" },
    });
    expect(tx.leadNote.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-1",
        authorUserId: "user-1",
        content: "Consultation cancelled.",
      },
    });
  });
  it("completes a consultation, updates its lead, and records activity atomically", async () => {
    const completed = {
      id: "consultation-1",
      status: "COMPLETED",
      completedAt: new Date(),
      outcome: "READY_FOR_ESTIMATE",
      completionNotes: "Measurements captured.",
      actualDuration: 75,
    };
    const tx = {
      consultation: {
        findFirst: vi
          .fn()
          .mockResolvedValueOnce({ id: "consultation-1", leadId: "lead-1", status: "SCHEDULED" })
          .mockResolvedValueOnce(completed),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      lead: {
        findFirst: vi.fn().mockResolvedValue({ id: "lead-1" }),
        update: vi.fn(),
      },
      leadNote: { create: vi.fn() },
      customer: { create: vi.fn() },
    };
    const prisma = { $transaction: vi.fn((fn) => fn(tx)) };
    const result = await completeConsultationForOrganization(prisma as never, "org-1", "user-1", {
      consultationId: "consultation-1",
      outcome: "READY_FOR_ESTIMATE",
      completionNotes: "Measurements captured.",
      actualDuration: 75,
    });

    expect(result).toEqual({ consultation: completed, duplicate: false });
    expect(tx.consultation.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: "org-1", status: "SCHEDULED" }),
        data: expect.objectContaining({
          status: "COMPLETED",
          completedAt: expect.any(Date),
          completedByUserId: "user-1",
          outcome: "READY_FOR_ESTIMATE",
          completionNotes: "Measurements captured.",
          actualDuration: 75,
        }),
      }),
    );
    expect(tx.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: { status: "CONSULTATION_COMPLETED" },
    });
    expect(tx.leadNote.create).toHaveBeenCalledTimes(1);
    expect(tx.leadNote.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-1",
        authorUserId: "user-1",
        content:
          "Consultation Completed\nOutcome: Ready for estimate\nCompletion Notes: Measurements captured.",
      },
    });
    expect(tx.customer.create).not.toHaveBeenCalled();
  });
  it("rejects cross-organization completion without writing", async () => {
    const tx = {
      consultation: { findFirst: vi.fn().mockResolvedValue(null), updateMany: vi.fn() },
      lead: { findFirst: vi.fn(), update: vi.fn() },
      leadNote: { create: vi.fn() },
    };
    const prisma = { $transaction: vi.fn((fn) => fn(tx)) };
    const result = await completeConsultationForOrganization(prisma as never, "org-1", "user-1", {
      consultationId: "other-org",
      outcome: "FOLLOW_UP_NEEDED",
    });

    expect(result).toBeNull();
    expect(tx.consultation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "other-org", organizationId: "org-1" } }),
    );
    expect(tx.consultation.updateMany).not.toHaveBeenCalled();
    expect(tx.leadNote.create).not.toHaveBeenCalled();
  });
  it("does not duplicate activity when completion is submitted again", async () => {
    const completed = { id: "consultation-1", leadId: "lead-1", status: "COMPLETED" };
    const tx = {
      consultation: { findFirst: vi.fn().mockResolvedValue(completed), updateMany: vi.fn() },
      lead: { findFirst: vi.fn(), update: vi.fn() },
      leadNote: { create: vi.fn() },
    };
    const prisma = { $transaction: vi.fn((fn) => fn(tx)) };
    const result = await completeConsultationForOrganization(prisma as never, "org-1", "user-1", {
      consultationId: "consultation-1",
      outcome: "FOLLOW_UP_NEEDED",
    });

    expect(result).toEqual({ consultation: completed, duplicate: true });
    expect(tx.lead.update).not.toHaveBeenCalled();
    expect(tx.leadNote.create).not.toHaveBeenCalled();
  });
  it("marks the lead lost without changing the completed consultation", async () => {
    const tx = {
      consultation: { findFirst: vi.fn().mockResolvedValue({ leadId: "lead-1" }), update: vi.fn() },
      lead: {
        findFirst: vi.fn().mockResolvedValue({ id: "lead-1" }),
        update: vi.fn().mockResolvedValue({ id: "lead-1", status: "LOST" }),
      },
      leadNote: { create: vi.fn() },
    };
    const prisma = { $transaction: vi.fn((fn) => fn(tx)) };
    await markConsultationLeadLost(
      prisma as never,
      "org-1",
      "user-1",
      "consultation-1",
      "Customer declined",
    );

    expect(tx.consultation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "consultation-1", organizationId: "org-1", status: "COMPLETED" },
      }),
    );
    expect(tx.consultation.update).not.toHaveBeenCalled();
    expect(tx.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: { status: "LOST" },
    });
    expect(tx.leadNote.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ content: "Lead marked lost: Customer declined" }),
      }),
    );
  });
});
