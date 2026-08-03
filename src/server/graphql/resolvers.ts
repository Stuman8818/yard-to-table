import type { Lead, LeadNote, LeadStatus } from "@prisma/client";
import { GraphQLError } from "graphql";

import type { CreateLeadInput } from "@/graphql/generated/graphql";
import {
  addLeadNoteSchema,
  leadListFiltersSchema,
  updateLeadStatusSchema,
} from "@/lib/validation/lead-management";
import { createLead, LeadValidationError } from "@/server/leads/lead-service";
import {
  addLeadNoteForOrganization,
  findLeadForOrganization,
  findLeadsForOrganization,
  updateLeadStatusForOrganization,
} from "@/server/leads/lead-repository";
import { resolveCurrentOrganization } from "@/server/organizations/organization-service";
import { requireAdminLeadAccess, requireLeadEditAccess } from "./authorization";
import type { GraphQLContext } from "./context";

const genericLeadError = "We couldn’t submit your request. Please try again.";

export async function createLeadResolver(
  _parent: unknown,
  { input }: { input: CreateLeadInput },
  context: GraphQLContext,
) {
  try {
    const organization = await resolveCurrentOrganization(context.prisma.organization);
    const result = await createLead(input, {
      leadRepository: context.prisma.lead,
      organizationId: organization.id,
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
    leads: async (
      _parent: unknown,
      args: { search?: string | null; status?: LeadStatus | null; sort?: "NEWEST" | "OLDEST" },
      context: GraphQLContext,
    ) => {
      const membership = requireAdminLeadAccess(context);
      const filters = leadListFiltersSchema.parse({
        search: args.search ?? undefined,
        status: args.status ?? undefined,
        sort: args.sort?.toLowerCase(),
      });
      return findLeadsForOrganization(context.prisma, membership.organizationId, filters);
    },
    lead: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      const membership = requireAdminLeadAccess(context);
      return findLeadForOrganization(context.prisma, membership.organizationId, id);
    },
  },
  Mutation: {
    createLead: createLeadResolver,
    updateLeadStatus: async (
      _parent: unknown,
      args: { leadId: string; status: LeadStatus },
      context: GraphQLContext,
    ) => {
      const membership = requireLeadEditAccess(context);
      const parsed = updateLeadStatusSchema.safeParse(args);
      if (!parsed.success) {
        throw new GraphQLError("Choose a valid lead status.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const input = parsed.data;
      const lead = await updateLeadStatusForOrganization(
        context.prisma,
        membership.organizationId,
        input.leadId,
        input.status,
      );
      if (!lead) {
        throw new GraphQLError("Lead not found.", { extensions: { code: "NOT_FOUND" } });
      }
      return lead;
    },
    addLeadNote: async (
      _parent: unknown,
      args: { leadId: string; content: string },
      context: GraphQLContext,
    ) => {
      const membership = requireLeadEditAccess(context);
      const authorUserId = context.authenticatedUserId;
      if (!authorUserId) {
        throw new GraphQLError("Authentication is required.", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const parsed = addLeadNoteSchema.safeParse(args);
      if (!parsed.success) {
        throw new GraphQLError(parsed.error.issues[0]?.message ?? "Enter a valid note.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const input = parsed.data;
      const note = await addLeadNoteForOrganization(
        context.prisma,
        membership.organizationId,
        input.leadId,
        authorUserId,
        input.content,
      );
      if (!note) {
        throw new GraphQLError("Lead not found.", { extensions: { code: "NOT_FOUND" } });
      }
      return note;
    },
  },
  Lead: {
    createdAt: (lead: Lead) => lead.createdAt.toISOString(),
    updatedAt: (lead: Lead) => lead.updatedAt.toISOString(),
  },
  LeadNote: {
    createdAt: (note: LeadNote) => note.createdAt.toISOString(),
    updatedAt: (note: LeadNote) => note.updatedAt.toISOString(),
  },
};
