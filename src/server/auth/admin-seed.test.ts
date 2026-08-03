import { describe, expect, it, vi } from "vitest";

import { readAdminSeedInput, seedInitialAdmin } from "./admin-seed";

describe("initial administrator seed", () => {
  it("requires both administrator credential variables", () => {
    expect(readAdminSeedInput({})).toBeNull();
    expect(() => readAdminSeedInput({ SEED_ADMIN_EMAIL: "admin@example.com" })).toThrow(
      "must be provided together",
    );
  });

  it("idempotently upserts one user and one organization membership", async () => {
    const userUpsert = vi.fn().mockResolvedValue({ id: "user-1" });
    const membershipUpsert = vi.fn().mockResolvedValue({ id: "membership-1" });
    const repositories = {
      user: { upsert: userUpsert },
      organizationMembership: { upsert: membershipUpsert },
    };
    const createHash = vi.fn().mockResolvedValue("hashed-password");
    const input = {
      email: "ADMIN@EXAMPLE.COM",
      password: "a-long-test-password",
      name: "Garden Admin",
    };

    await seedInitialAdmin(repositories, "organization-1", input, createHash);
    await seedInitialAdmin(repositories, "organization-1", input, createHash);

    expect(userUpsert).toHaveBeenCalledTimes(2);
    expect(userUpsert).toHaveBeenCalledWith({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        name: "Garden Admin",
        passwordHash: "hashed-password",
      },
      select: { id: true },
    });
    expect(membershipUpsert).toHaveBeenCalledTimes(2);
    expect(membershipUpsert).toHaveBeenCalledWith({
      where: {
        userId_organizationId: { userId: "user-1", organizationId: "organization-1" },
      },
      update: {},
      create: { userId: "user-1", organizationId: "organization-1", role: "OWNER" },
    });
    expect(JSON.stringify(userUpsert.mock.calls[0])).not.toContain("a-long-test-password");
  });
});
