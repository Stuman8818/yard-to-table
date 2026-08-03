import { describe, expect, it } from "vitest";

import type { GraphQLContext } from "./context";
import { requireAdminLeadAccess } from "./authorization";

function context(overrides: Partial<GraphQLContext>): GraphQLContext {
  return {
    authenticatedUserId: null,
    membership: null,
    ...overrides,
  } as GraphQLContext;
}

describe("GraphQL lead authorization", () => {
  it("requires an authenticated session", () => {
    expect(() => requireAdminLeadAccess(context({}))).toThrowError(
      expect.objectContaining({ extensions: { code: "UNAUTHENTICATED" } }),
    );
  });

  it("rejects a disallowed organization role", () => {
    expect(() =>
      requireAdminLeadAccess(
        context({
          authenticatedUserId: "user-1",
          membership: {
            membershipId: "membership-1",
            organizationId: "organization-1",
            organizationName: "Yard To Table",
            role: "CREW",
          },
        }),
      ),
    ).toThrowError(expect.objectContaining({ extensions: { code: "FORBIDDEN" } }));
  });

  it("returns only the trusted membership scope for an administrator", () => {
    expect(
      requireAdminLeadAccess(
        context({
          authenticatedUserId: "user-1",
          membership: {
            membershipId: "membership-1",
            organizationId: "organization-1",
            organizationName: "Yard To Table",
            role: "ADMIN",
          },
        }),
      ),
    ).toMatchObject({ organizationId: "organization-1" });
  });
});
