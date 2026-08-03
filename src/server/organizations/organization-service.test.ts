import { describe, expect, it, vi } from "vitest";

import {
  CURRENT_ORGANIZATION_NAME,
  CURRENT_ORGANIZATION_SLUG,
  resolveCurrentOrganization,
  seedCurrentOrganization,
} from "./organization-service";

describe("organization service", () => {
  it("resolves the current organization by its centralized slug", async () => {
    const findUnique = vi.fn().mockResolvedValue({ id: "organization-1" });

    await expect(resolveCurrentOrganization({ findUnique })).resolves.toEqual({
      id: "organization-1",
    });
    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: CURRENT_ORGANIZATION_SLUG },
      select: { id: true },
    });
  });

  it("seeds idempotently with an upsert on the unique slug", async () => {
    const upsert = vi.fn().mockResolvedValue({ id: "organization-1" });

    await seedCurrentOrganization({ upsert });
    await seedCurrentOrganization({ upsert });

    expect(upsert).toHaveBeenCalledTimes(2);
    expect(upsert).toHaveBeenCalledWith({
      where: { slug: CURRENT_ORGANIZATION_SLUG },
      update: { name: CURRENT_ORGANIZATION_NAME },
      create: {
        name: CURRENT_ORGANIZATION_NAME,
        slug: CURRENT_ORGANIZATION_SLUG,
      },
      select: { id: true },
    });
  });
});
