import { describe, expect, it, vi } from "vitest";

import { findCustomerForOrganization } from "./customer-repository";

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
});
