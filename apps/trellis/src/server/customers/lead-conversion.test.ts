import { describe, expect, it, vi } from "vitest";

import { convertLeadToCustomer, undoLeadConversion } from "./lead-conversion";

const lead = {
  id: "lead-1",
  organizationId: "organization-1",
  firstName: "Jane",
  lastName: "Gardner",
  email: "jane@example.com",
  phone: "555-1234",
  addressLine1: "123 Garden Lane",
  addressLine2: null,
  city: "Indianapolis",
  state: "IN",
  postalCode: "46204",
  status: "CONTACTED",
  convertedCustomer: null,
};

function prismaMock(overrides?: { foundLead?: unknown; createError?: Error }) {
  const findFirst = vi
    .fn()
    .mockResolvedValue(overrides?.foundLead === undefined ? lead : overrides.foundLead);
  const create = overrides?.createError
    ? vi.fn().mockRejectedValue(overrides.createError)
    : vi.fn().mockResolvedValue({ id: "customer-1", properties: [{ id: "property-1" }] });
  const update = vi.fn().mockResolvedValue({ id: "lead-1", status: "CONVERTED" });
  const deleteMany = vi.fn().mockResolvedValue({ count: 1 });
  const tx = { lead: { findFirst, update }, customer: { create, deleteMany } };
  return {
    prisma: {
      $transaction: vi.fn(async (operation: (client: typeof tx) => unknown) => operation(tx)),
      customer: { findFirst: vi.fn() },
    },
    findFirst,
    create,
    update,
    deleteMany,
  };
}

describe("lead conversion", () => {
  it("creates one tenant-owned customer and property, then marks the lead converted", async () => {
    const mock = prismaMock();
    await expect(
      convertLeadToCustomer(mock.prisma as never, "organization-1", "lead-1"),
    ).resolves.toMatchObject({ id: "customer-1" });

    expect(mock.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "lead-1", organizationId: "organization-1" } }),
    );
    expect(mock.create).toHaveBeenCalledTimes(1);
    expect(mock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          organizationId: "organization-1",
          sourceLeadId: "lead-1",
          firstName: "Jane",
          properties: {
            create: expect.objectContaining({
              organization: { connect: { id: "organization-1" } },
              addressLine1: "123 Garden Lane",
            }),
          },
        }),
      }),
    );
    expect(mock.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: { status: "CONVERTED", statusBeforeConversion: "CONTACTED" },
    });
  });

  it("undoes conversion in one transaction and restores the previous status", async () => {
    const mock = prismaMock({
      foundLead: {
        id: "lead-1",
        statusBeforeConversion: "ESTIMATE_SENT",
        convertedCustomer: { id: "customer-1" },
      },
    });
    await undoLeadConversion(mock.prisma as never, "organization-1", "lead-1");
    expect(mock.deleteMany).toHaveBeenCalledWith({
      where: {
        id: "customer-1",
        sourceLeadId: "lead-1",
        organizationId: "organization-1",
      },
    });
    expect(mock.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "lead-1" },
        data: { status: "ESTIMATE_SENT", statusBeforeConversion: null },
      }),
    );
  });

  it("does not convert a lead outside the authenticated organization", async () => {
    const mock = prismaMock({ foundLead: null });
    await expect(
      convertLeadToCustomer(mock.prisma as never, "organization-1", "lead-2"),
    ).resolves.toBeNull();
    expect(mock.create).not.toHaveBeenCalled();
    expect(mock.update).not.toHaveBeenCalled();
  });

  it("returns the existing customer without creating duplicates", async () => {
    const existing = { id: "customer-1", properties: [{ id: "property-1" }] };
    const mock = prismaMock({
      foundLead: { ...lead, status: "CONVERTED", convertedCustomer: existing },
    });
    await expect(
      convertLeadToCustomer(mock.prisma as never, "organization-1", "lead-1"),
    ).resolves.toBe(existing);
    expect(mock.create).not.toHaveBeenCalled();
    expect(mock.update).not.toHaveBeenCalled();
  });

  it("does not update the lead when customer/property creation fails", async () => {
    const mock = prismaMock({ createError: new Error("property creation failed") });
    await expect(
      convertLeadToCustomer(mock.prisma as never, "organization-1", "lead-1"),
    ).rejects.toThrow("property creation failed");
    expect(mock.update).not.toHaveBeenCalled();
  });
});
