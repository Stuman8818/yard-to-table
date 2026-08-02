import type { Prisma } from "@prisma/client";

import {
  getLeadFieldErrors,
  leadSubmissionSchema,
  type LeadFieldErrors,
  type LeadSubmissionInput,
} from "@/lib/validation/lead";
import { sendLeadNotification } from "@/server/email/lead-notification";

interface LeadRepository {
  create(args: { data: Prisma.LeadCreateInput; select: { id: true } }): Promise<{ id: string }>;
}

interface LeadServiceLogger {
  error(message: string, context: { leadId: string; errorType: string }): void;
}

interface LeadServiceDependencies {
  leadRepository: LeadRepository;
  sendNotification?: (input: LeadSubmissionInput) => Promise<void>;
  logger?: LeadServiceLogger;
}

export class LeadValidationError extends Error {
  constructor(public readonly fieldErrors: LeadFieldErrors) {
    super("Lead submission validation failed.");
    this.name = "LeadValidationError";
  }
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export async function createLead(
  input: unknown,
  dependencies: LeadServiceDependencies,
): Promise<{ leadId: string }> {
  const parsed = leadSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    throw new LeadValidationError(getLeadFieldErrors(parsed.error));
  }

  const normalized: LeadSubmissionInput = {
    ...parsed.data,
    firstName: normalizeWhitespace(parsed.data.firstName),
    lastName: normalizeWhitespace(parsed.data.lastName),
    email: parsed.data.email.toLowerCase(),
    city: normalizeWhitespace(parsed.data.city),
  };
  const lead = await dependencies.leadRepository.create({
    data: {
      firstName: normalized.firstName,
      lastName: normalized.lastName,
      email: normalized.email,
      phone: normalized.phone,
      addressLine1: normalized.address,
      city: normalized.city,
      state: "IN",
      postalCode: normalized.postalCode,
      notes: normalized.message,
      requestedServices: {
        create: normalized.serviceTypes.map((serviceType) => ({ serviceType })),
      },
    },
    select: {
      id: true,
    },
  });

  try {
    await (dependencies.sendNotification ?? sendLeadNotification)(normalized);
  } catch (error: unknown) {
    (dependencies.logger ?? console).error("Lead notification email failed.", {
      leadId: lead.id,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
  }

  return { leadId: lead.id };
}
