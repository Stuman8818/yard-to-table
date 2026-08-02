import type { Lead } from "@prisma/client";
import { GraphQLError } from "graphql";

import type { CreateLeadInput } from "@/graphql/generated/graphql";
import { createLead, LeadValidationError } from "@/server/leads/lead-service";
import type { GraphQLContext } from "./context";

const genericLeadError = "We couldn’t submit your request. Please try again.";

export async function createLeadResolver(
  _parent: unknown,
  { input }: { input: CreateLeadInput },
  context: GraphQLContext,
) {
  try {
    const result = await createLead(input, {
      leadRepository: context.prisma.lead,
    });

    return {
      success: true,
      leadId: result.leadId,
      message: "Your request has been received.",
    };
  } catch (error: unknown) {
    if (error instanceof LeadValidationError) {
      throw new GraphQLError("Please correct the highlighted fields.", {
        extensions: {
          code: "BAD_USER_INPUT",
          fieldErrors: error.fieldErrors,
        },
      });
    }

    console.error("Lead creation failed.", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });

    throw new GraphQLError(genericLeadError, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
}

export const resolvers = {
  Query: {
    health: () => ({
      status: "ok",
      timestamp: new Date().toISOString(),
    }),
    leads: (_parent: unknown, _args: Record<string, never>, context: GraphQLContext) =>
      context.prisma.lead.findMany({
        include: {
          requestedServices: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
  },
  Mutation: {
    createLead: createLeadResolver,
  },
  Lead: {
    createdAt: (lead: Lead) => lead.createdAt.toISOString(),
    updatedAt: (lead: Lead) => lead.updatedAt.toISOString(),
  },
};
