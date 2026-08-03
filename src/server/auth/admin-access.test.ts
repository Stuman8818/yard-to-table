import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/server/db/prisma", () => ({ prisma: {} }));

import { authorizeAdminSession } from "./admin-access";
import { AuthenticationRequiredError, OrganizationAccessError } from "./auth-service";

function membershipRepository(role: "OWNER" | "ADMIN" | "MANAGER" | "CREW") {
  return {
    findMany: vi.fn().mockResolvedValue([
      {
        id: "membership-1",
        organizationId: "organization-1",
        role,
        organization: { name: "Yard To Table" },
      },
    ]),
  };
}

describe("admin route authorization", () => {
  it("denies unauthenticated access", async () => {
    await expect(authorizeAdminSession(null, membershipRepository("OWNER"))).rejects.toBeInstanceOf(
      AuthenticationRequiredError,
    );
  });

  it("denies a membership without an allowed role", async () => {
    await expect(
      authorizeAdminSession({ user: { id: "user-1" } }, membershipRepository("CREW")),
    ).rejects.toBeInstanceOf(OrganizationAccessError);
  });

  it.each(["OWNER", "ADMIN", "MANAGER"] as const)("allows an authenticated %s", async (role) => {
    await expect(
      authorizeAdminSession(
        { user: { id: "user-1", email: "admin@example.com" } },
        membershipRepository(role),
      ),
    ).resolves.toMatchObject({
      user: { id: "user-1" },
      membership: { organizationId: "organization-1", role },
    });
  });
});
