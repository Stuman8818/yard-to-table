import { describe, expect, it, vi } from "vitest";

import { hashPassword } from "./password";
import {
  authenticateCredentials,
  OrganizationAccessError,
  resolveAuthenticatedMembership,
} from "./auth-service";

describe("authentication service", () => {
  it("accepts valid normalized credentials without returning the password hash", async () => {
    const passwordHash = await hashPassword("a-long-test-password");
    const findUnique = vi.fn().mockResolvedValue({
      id: "user-1",
      email: "admin@example.com",
      name: "Garden Admin",
      passwordHash,
    });

    await expect(
      authenticateCredentials(" ADMIN@EXAMPLE.COM ", "a-long-test-password", { findUnique }),
    ).resolves.toEqual({ id: "user-1", email: "admin@example.com", name: "Garden Admin" });
  });

  it("rejects invalid credentials", async () => {
    const passwordHash = await hashPassword("a-long-test-password");
    const findUnique = vi.fn().mockResolvedValue({
      id: "user-1",
      email: "admin@example.com",
      name: null,
      passwordHash,
    });

    await expect(
      authenticateCredentials("admin@example.com", "wrong-password", { findUnique }),
    ).resolves.toBeNull();
  });

  it("fails safely when organization selection would be ambiguous", async () => {
    const findMany = vi.fn().mockResolvedValue([
      { id: "m1", organizationId: "o1", role: "OWNER", organization: { name: "One" } },
      { id: "m2", organizationId: "o2", role: "OWNER", organization: { name: "Two" } },
    ]);

    await expect(resolveAuthenticatedMembership("user-1", { findMany })).rejects.toBeInstanceOf(
      OrganizationAccessError,
    );
  });
});
