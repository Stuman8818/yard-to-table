import { describe, expect, it, vi } from "vitest";
import {
  completeEstimateForOrganization,
  createEstimateForLead,
  updateEstimateForOrganization,
} from "./estimate-repository";

const membership = { id: "membership-1" };

describe("tenant-scoped estimates", () => {
  it("creates a draft and calculates line totals on the server", async () => {
    const estimate = { id: "estimate-1", status: "DRAFT", totalCents: 25000 };
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      lead: {
        findFirst: vi.fn().mockResolvedValue({
          id: "lead-1",
          estimate: null,
          consultations: [],
          assessments: [{ id: "assessment-1" }],
        }),
      },
      estimate: { create: vi.fn().mockResolvedValue(estimate) },
      leadNote: { create: vi.fn() },
    };
    const result = await createEstimateForLead(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "lead-1",
      { lineItems: [{ description: "Garden cleanup", quantity: 2, unitPriceCents: 12500 }] },
    );
    expect(result).toEqual({ estimate, duplicate: false });
    expect(tx.estimate.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          totalCents: 25000,
          lineItems: { create: [expect.objectContaining({ totalCents: 25000 })] },
        }),
      }),
    );
    expect(tx.leadNote.create).toHaveBeenCalledTimes(1);
  });

  it("prevents duplicate estimates for a lead", async () => {
    const existing = { id: "estimate-1", status: "DRAFT" };
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      lead: {
        findFirst: vi.fn().mockResolvedValue({
          id: "lead-1",
          estimate: existing,
          consultations: [],
          assessments: [],
        }),
      },
      estimate: { create: vi.fn() },
      leadNote: { create: vi.fn() },
    };
    const result = await createEstimateForLead(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "lead-1",
      { lineItems: [] },
    );
    expect(result).toEqual({ estimate: existing, duplicate: true });
    expect(tx.estimate.create).not.toHaveBeenCalled();
  });

  it("replaces draft line items when saving", async () => {
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      estimate: {
        findFirst: vi.fn().mockResolvedValue({ id: "estimate-1", leadId: "lead-1" }),
        update: vi.fn().mockResolvedValue({ id: "estimate-1" }),
      },
      estimateLineItem: { deleteMany: vi.fn() },
      leadNote: { create: vi.fn() },
    };
    await updateEstimateForOrganization(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "estimate-1",
      { lineItems: [{ description: "Mulch", quantity: 3, unitPriceCents: 5000 }] },
    );
    expect(tx.estimateLineItem.deleteMany).toHaveBeenCalledWith({
      where: { estimateId: "estimate-1" },
    });
    expect(tx.estimate.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ totalCents: 15000 }) }),
    );
  });

  it("completes a priced estimate without converting the lead", async () => {
    const completed = { id: "estimate-1", status: "COMPLETED" };
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      estimate: {
        findFirst: vi.fn().mockResolvedValue({
          id: "estimate-1",
          leadId: "lead-1",
          status: "DRAFT",
          lineItems: [{ id: "item-1" }],
        }),
        update: vi.fn().mockResolvedValue(completed),
      },
      lead: { update: vi.fn() },
      leadNote: { create: vi.fn() },
      customer: { create: vi.fn() },
    };
    const result = await completeEstimateForOrganization(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "estimate-1",
    );
    expect(result).toBe(completed);
    expect(tx.estimate.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "COMPLETED", completedAt: expect.any(Date) } }),
    );
    expect(tx.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: { status: "ESTIMATE_COMPLETED" },
    });
    expect(tx.customer.create).not.toHaveBeenCalled();
  });

  it("repairs the lead status for an estimate that was already completed", async () => {
    const completed = {
      id: "estimate-1",
      leadId: "lead-1",
      status: "COMPLETED",
      lineItems: [{ id: "item-1" }],
    };
    const tx = {
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(membership) },
      estimate: { findFirst: vi.fn().mockResolvedValue(completed), update: vi.fn() },
      lead: { updateMany: vi.fn() },
      leadNote: { create: vi.fn() },
    };
    await completeEstimateForOrganization(
      { $transaction: vi.fn((fn) => fn(tx)) } as never,
      "org-1",
      "user-1",
      "estimate-1",
    );

    expect(tx.lead.updateMany).toHaveBeenCalledWith({
      where: {
        id: "lead-1",
        organizationId: "org-1",
        status: { not: "ESTIMATE_COMPLETED" },
      },
      data: { status: "ESTIMATE_COMPLETED" },
    });
    expect(tx.estimate.update).not.toHaveBeenCalled();
    expect(tx.leadNote.create).not.toHaveBeenCalled();
  });
});
