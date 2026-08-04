import { ConsultationStatus } from "@prisma/client";
import { z } from "zod";

const id = z.string().trim().min(1).max(100);
const date = z
  .string()
  .datetime()
  .transform((value) => new Date(value));

export const consultationIdSchema = id;
export const scheduleConsultationSchema = z
  .object({
    customerId: id,
    propertyId: id,
    scheduledStart: date,
    scheduledEnd: date,
    notes: z.string().trim().max(4000).optional(),
  })
  .refine((value) => value.scheduledEnd > value.scheduledStart, {
    message: "End time must be after start time.",
    path: ["scheduledEnd"],
  });

export const scheduleLeadConsultationSchema = z
  .object({
    leadId: id,
    type: z.enum(["ON_SITE", "PHONE"]),
    scheduledStart: date,
    scheduledEnd: date,
    notes: z.string().trim().max(4000).optional(),
    addressLine1: z.string().trim().max(200).optional(),
    addressLine2: z.string().trim().max(200).optional(),
    city: z.string().trim().max(100).optional(),
    state: z.string().trim().max(50).optional(),
    postalCode: z.string().trim().max(20).optional(),
  })
  .refine((value) => value.scheduledEnd > value.scheduledStart, {
    message: "End time must be after start time.",
    path: ["scheduledEnd"],
  })
  .refine(
    (value) =>
      value.type === "PHONE" ||
      Boolean(value.addressLine1 && value.city && value.state && value.postalCode),
    {
      message: "Enter a complete address for an on-site consultation.",
      path: ["addressLine1"],
    },
  );

export const updateConsultationSchema = z
  .object({
    consultationId: id,
    status: z.enum(ConsultationStatus),
    scheduledStart: date,
    scheduledEnd: date,
    notes: z.string().trim().max(4000).optional(),
  })
  .refine((value) => value.scheduledEnd > value.scheduledStart, {
    message: "End time must be after start time.",
    path: ["scheduledEnd"],
  });
