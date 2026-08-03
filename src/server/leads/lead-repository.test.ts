import { describe, expect, it, vi } from "vitest";

import { findLeadsForOrganization } from "./lead-repository";

describe("tenant-scoped lead repository", () => {
  it("only requests leads belonging to the resolved organization", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const prisma = { lead: { findMany } };

    await findLeadsForOrganization(prisma as never, "organization-1");

    expect(findMany).toHaveBeenCalledWith({
      where: { organizationId: "organization-1" },
      include: { requestedServices: true },
      orderBy: { createdAt: "desc" },
    });
    expect(findMany).not.toHaveBeenCalledWith(
      expect.objectContaining({ where: { organizationId: "organization-2" } }),
    );
  });
});
