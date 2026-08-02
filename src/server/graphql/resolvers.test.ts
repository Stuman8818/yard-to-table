import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import type { GraphQLContext } from "./context";
import { createLeadResolver } from "./resolvers";

describe("createLeadResolver", () => {
  it("returns a safe GraphQL error when Prisma fails", async () => {
    const context = {
      prisma: {
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
});
