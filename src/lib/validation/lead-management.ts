import { LeadStatus } from "@prisma/client";
import { z } from "zod";

export const leadSortValues = ["newest", "oldest"] as const;

export const leadListFiltersSchema = z.object({
  search: z.string().trim().max(100).optional().catch(undefined),
  status: z.enum(LeadStatus).optional().catch(undefined),
  sort: z.enum(leadSortValues).default("newest").catch("newest"),
});

export const updateLeadStatusSchema = z.object({
  leadId: z.string().trim().min(1),
  status: z.enum(LeadStatus),
});

export const addLeadNoteSchema = z.object({
  leadId: z.string().trim().min(1),
  content: z
    .string()
    .trim()
    .min(1, "Enter a note.")
    .max(2000, "Notes must be 2,000 characters or fewer."),
});

export type LeadListFilters = z.infer<typeof leadListFiltersSchema>;
