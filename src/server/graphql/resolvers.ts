import type { Consultation, Customer, Lead, LeadNote, LeadStatus, Property } from "@prisma/client";
import { GraphQLError } from "graphql";

import type { CreateLeadInput } from "@/graphql/generated/graphql";
import {
  addLeadNoteSchema,
  leadListFiltersSchema,
  updateLeadStatusSchema,
} from "@/lib/validation/lead-management";
import { createLead, LeadValidationError } from "@/server/leads/lead-service";
import { customerIdSchema, convertLeadSchema } from "@/lib/validation/customer";
import {
  consultationIdSchema,
  scheduleConsultationSchema,
  scheduleLeadConsultationSchema,
  updateConsultationSchema,
} from "@/lib/validation/consultation";
import {
  findConsultationForOrganization,
  findConsultationsForOrganization,
  scheduleConsultation,
  scheduleConsultationForLead,
  updateConsultationForOrganization,
} from "@/server/consultations/consultation-repository";
import { sendConsultationConfirmation } from "@/server/email/consultation-confirmation";
import { findCustomerForOrganization } from "@/server/customers/customer-repository";
import {
  convertLeadToCustomer,
  LeadAlreadyConvertedWithoutCustomerError,
  undoLeadConversion,
} from "@/server/customers/lead-conversion";
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
    customer: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      const membership = requireAdminLeadAccess(context);
      const customerId = customerIdSchema.safeParse(id);
      if (!customerId.success) {
        throw new GraphQLError("Customer not found.", { extensions: { code: "NOT_FOUND" } });
      }
      return findCustomerForOrganization(
        context.prisma,
        membership.organizationId,
        customerId.data,
      );
    },
    consultations: (
      _parent: unknown,
      { scope }: { scope?: "UPCOMING" | "PAST" | "ALL" },
      context: GraphQLContext,
    ) => {
      const membership = requireAdminLeadAccess(context);
      return findConsultationsForOrganization(
        context.prisma,
        membership.organizationId,
        scope ?? "UPCOMING",
      );
    },
    consultation: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      const membership = requireAdminLeadAccess(context);
      const parsed = consultationIdSchema.safeParse(id);
      if (!parsed.success)
        throw new GraphQLError("Consultation not found.", { extensions: { code: "NOT_FOUND" } });
      return findConsultationForOrganization(
        context.prisma,
        membership.organizationId,
        parsed.data,
      );
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
      if (input.status === "CONVERTED") {
        throw new GraphQLError("Convert the lead through the conversion workflow.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
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
    convertLeadToCustomer: async (
      _parent: unknown,
      args: { leadId: string },
      context: GraphQLContext,
    ) => {
      const membership = requireLeadEditAccess(context);
      const parsed = convertLeadSchema.safeParse(args);
      if (!parsed.success) {
        throw new GraphQLError("Choose a valid lead.", { extensions: { code: "BAD_USER_INPUT" } });
      }
      try {
        const customer = await convertLeadToCustomer(
          context.prisma,
          membership.organizationId,
          parsed.data.leadId,
        );
        if (!customer) {
          throw new GraphQLError("Lead not found.", { extensions: { code: "NOT_FOUND" } });
        }
        return customer;
      } catch (error: unknown) {
        if (error instanceof LeadAlreadyConvertedWithoutCustomerError) {
          throw new GraphQLError(error.message, { extensions: { code: "CONFLICT" } });
        }
        throw error;
      }
    },
    undoLeadConversion: async (
      _parent: unknown,
      args: { leadId: string },
      context: GraphQLContext,
    ) => {
      const membership = requireLeadEditAccess(context);
      const parsed = convertLeadSchema.safeParse(args);
      if (!parsed.success) {
        throw new GraphQLError("Choose a valid lead.", { extensions: { code: "BAD_USER_INPUT" } });
      }
      const lead = await undoLeadConversion(
        context.prisma,
        membership.organizationId,
        parsed.data.leadId,
      );
      if (!lead) {
        throw new GraphQLError("Converted lead not found.", { extensions: { code: "NOT_FOUND" } });
      }
      return lead;
    },
    scheduleConsultation: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          customerId: string;
          propertyId: string;
          scheduledStart: string;
          scheduledEnd: string;
          notes?: string | null;
        };
      },
      context: GraphQLContext,
    ) => {
      const membership = requireLeadEditAccess(context);
      if (!context.authenticatedUserId)
        throw new GraphQLError("Authentication is required.", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      const parsed = scheduleConsultationSchema.safeParse({
        ...input,
        notes: input.notes ?? undefined,
      });
      if (!parsed.success)
        throw new GraphQLError(
          parsed.error.issues[0]?.message ?? "Enter valid consultation details.",
          { extensions: { code: "BAD_USER_INPUT" } },
        );
      const consultation = await scheduleConsultation(
        context.prisma,
        membership.organizationId,
        context.authenticatedUserId,
        parsed.data,
      );
      if (!consultation)
        throw new GraphQLError("Customer property not found.", {
          extensions: { code: "NOT_FOUND" },
        });
      return consultation;
    },
    updateConsultation: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          consultationId: string;
          status: "SCHEDULED" | "COMPLETED" | "CANCELED" | "NO_SHOW";
          scheduledStart: string;
          scheduledEnd: string;
          notes?: string | null;
        };
      },
      context: GraphQLContext,
    ) => {
      const membership = requireLeadEditAccess(context);
      const parsed = updateConsultationSchema.safeParse({
        ...input,
        notes: input.notes ?? undefined,
      });
      if (!parsed.success)
        throw new GraphQLError(
          parsed.error.issues[0]?.message ?? "Enter valid consultation details.",
          { extensions: { code: "BAD_USER_INPUT" } },
        );
      const consultation = await updateConsultationForOrganization(
        context.prisma,
        membership.organizationId,
        context.authenticatedUserId!,
        parsed.data,
      );
      if (!consultation)
        throw new GraphQLError("Consultation not found.", { extensions: { code: "NOT_FOUND" } });
      return consultation;
    },
    scheduleLeadConsultation: async (
      _parent: unknown,
      { input }: { input: Record<string, unknown> },
      context: GraphQLContext,
    ) => {
      const membership = requireLeadEditAccess(context);
      const userId = context.authenticatedUserId;
      if (!userId)
        throw new GraphQLError("Authentication is required.", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      const parsed = scheduleLeadConsultationSchema.safeParse(input);
      if (!parsed.success)
        throw new GraphQLError(parsed.error.issues[0]?.message ?? "Enter valid details.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      const result = await scheduleConsultationForLead(
        context.prisma,
        membership.organizationId,
        userId,
        parsed.data,
      );
      if (!result) throw new GraphQLError("Lead not found.", { extensions: { code: "NOT_FOUND" } });
      if (!result.duplicate) {
        void sendConsultationConfirmation({
          email: result.lead.email,
          firstName: result.lead.firstName,
          scheduledStart: parsed.data.scheduledStart,
          type: parsed.data.type,
        }).catch((error: unknown) =>
          console.error("Consultation confirmation email failed.", {
            consultationId: result.consultation.id,
            errorType: error instanceof Error ? error.name : "UnknownError",
          }),
        );
      }
      return result.consultation;
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
  Customer: {
    createdAt: (customer: Customer) => customer.createdAt.toISOString(),
    updatedAt: (customer: Customer) => customer.updatedAt.toISOString(),
  },
  Property: {
    createdAt: (property: Property) => property.createdAt.toISOString(),
    updatedAt: (property: Property) => property.updatedAt.toISOString(),
  },
  Consultation: {
    scheduledStart: (value: Consultation) => value.scheduledStart.toISOString(),
    scheduledEnd: (value: Consultation) => value.scheduledEnd.toISOString(),
    createdAt: (value: Consultation) => value.createdAt.toISOString(),
    updatedAt: (value: Consultation) => value.updatedAt.toISOString(),
  },
};
