import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import type { GraphQLContext } from "./context";
import { createLeadResolver, resolvers } from "./resolvers";

describe("createLeadResolver", () => {
  it("returns a safe GraphQL error when Prisma fails", async () => {
    const context = {
      prisma: {
        organization: {
          findUnique: vi.fn().mockResolvedValue({ id: "organization-1" }),
        },
        lead: {
          create: vi.fn().mockRejectedValue(new Error("postgresql://secret@database")),
        },
      },
      request: new NextRequest("http://localhost/api/graphql"),
    } as unknown as GraphQLContext;
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(
      createLeadResolver(
        undefined,
        {
          input: {
            firstName: "Jane",
            lastName: "Gardner",
            email: "jane@example.com",
            phone: "555-123-4567",
            address: "123 Garden Lane",
            city: "Indianapolis",
            state: "IN",
            postalCode: "46204",
            serviceTypes: ["LAWN_CARE"],
            message: "Please help with my garden beds.",
          },
        },
        context,
      ),
    ).rejects.toMatchObject({
      message: "We couldn’t submit your request. Please try again.",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
    expect(consoleError).toHaveBeenCalledWith("Lead creation failed.", {
      errorType: "Error",
    });
    expect(consoleError.mock.calls.flat().join(" ")).not.toContain("postgresql://secret");

    consoleError.mockRestore();
  });

  it("assigns a submitted lead to the server-resolved organization", async () => {
    const create = vi.fn().mockResolvedValue({ id: "lead-1" });
    const context = {
      prisma: {
        organization: {
          findUnique: vi.fn().mockResolvedValue({ id: "organization-1" }),
        },
        lead: { create },
      },
      request: new NextRequest("http://localhost/api/graphql"),
    } as unknown as GraphQLContext;

    await createLeadResolver(
      undefined,
      {
        input: {
          firstName: "Jane",
          lastName: "Gardner",
          email: "jane@example.com",
          phone: "555-123-4567",
          address: "123 Garden Lane",
          city: "Indianapolis",
          state: "IN",
          postalCode: "46204",
          serviceTypes: ["LAWN_CARE"],
          message: "Please help with my garden beds.",
        },
      },
      context,
    );

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          organization: { connect: { id: "organization-1" } },
        }),
      }),
    );
  });
});

describe("authenticated leads resolver", () => {
  it("uses only the trusted membership organization scope", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const context = {
      prisma: { lead: { findMany } },
      authenticatedUserId: "user-1",
      membership: {
        membershipId: "membership-1",
        organizationId: "organization-1",
        organizationName: "Yard To Table",
        role: "ADMIN",
      },
      request: new NextRequest("http://localhost/api/graphql"),
    } as unknown as GraphQLContext;

    await resolvers.Query.leads(undefined, {}, context);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { organizationId: "organization-1" } }),
    );
  });
});
