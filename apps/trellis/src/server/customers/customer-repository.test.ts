import { describe, expect, it, vi } from "vitest";

import { findCustomerForOrganization, findCustomersForOrganization } from "./customer-repository";

describe("tenant-scoped customer repository", () => {
  it("looks up a customer by both customer and organization IDs", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    await findCustomerForOrganization(
      { customer: { findFirst } } as never,
      "organization-1",
      "customer-1",
    );
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "customer-1", organizationId: "organization-1" } }),
    );
  });

  it("lists customers only within the active organization", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    await findCustomersForOrganization(
      { customer: { findMany } } as never,
      "organization-1",
      "Jamie",
    );
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: "organization-1" }),
      }),
    );
  });
});
