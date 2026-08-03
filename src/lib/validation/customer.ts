import { z } from "zod";

export const convertLeadSchema = z.object({
  leadId: z.string().trim().min(1).max(100),
});

export const customerIdSchema = z.string().trim().min(1).max(100);
