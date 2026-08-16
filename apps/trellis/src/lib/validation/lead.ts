import { z } from "zod";

import {
  desiredTimingOptions,
  getServiceDetailCategory,
  serviceDefinitions,
  serviceDetailTypes,
  type DesiredTiming,
  type ServiceDetailType,
  type ServiceType,
} from "@/lib/services";

const phoneMessage = "Enter a valid US phone number.";
const serviceTypes = Object.keys(serviceDefinitions) as [ServiceType, ...ServiceType[]];
const timingValues = desiredTimingOptions.map(({ value }) => value) as [
  DesiredTiming,
  ...DesiredTiming[],
];
const detailValues = serviceDetailTypes as [ServiceDetailType, ...ServiceDetailType[]];

export const leadSubmissionSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "Enter your first name.")
      .max(50, "First name is too long."),
    lastName: z.string().trim().min(1, "Enter your last name.").max(50, "Last name is too long."),
    email: z
      .string()
      .trim()
      .min(1, "Enter your email address.")
      .max(254, "Email address is too long.")
      .pipe(z.email({ error: "Enter a valid email address." })),
    phone: z
      .string()
      .trim()
      .min(1, "Enter your phone number.")
      .max(30, phoneMessage)
      .regex(/^[+()\d\s.-]+$/, phoneMessage)
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
      }, phoneMessage),
    address: z.string().trim().min(5, "Enter the street address.").max(200, "Address is too long."),
    city: z.string().trim().min(1, "Enter the city.").max(100, "City is too long."),
    state: z.literal("IN", { error: "Service is currently available in Indiana only." }),
    postalCode: z
      .string()
      .trim()
      .regex(/^\d{5}(?:-\d{4})?$/, "Enter a valid ZIP code."),
    serviceTypes: z
      .array(z.enum(serviceTypes))
      .min(1, "Select at least one type of work.")
      .max(6, "Select no more than six service categories.")
      .refine(
        (values) => new Set(values).size === values.length,
        "Select each category only once.",
      ),
    serviceDetails: z
      .array(z.enum(detailValues))
      .max(40, "Select no more than 40 specific services.")
      .refine((values) => new Set(values).size === values.length, "Select each service only once.")
      .default([]),
    desiredTiming: z.enum(timingValues).optional(),
    message: z
      .string()
      .trim()
      .min(10, "Tell us a little more about the service you need.")
      .max(2000, "Project description must be 2,000 characters or fewer."),
  })
  .superRefine((input, context) => {
    for (const detail of input.serviceDetails) {
      const category = getServiceDetailCategory(detail);

      if (!category || !input.serviceTypes.includes(category)) {
        context.addIssue({
          code: "custom",
          path: ["serviceDetails"],
          message: "Select specific services only for the chosen categories.",
        });
        return;
      }
    }
  });

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;
export type LeadSubmissionField = keyof LeadSubmissionInput;
export type LeadFieldErrors = Partial<Record<LeadSubmissionField, string>>;

export function getLeadFieldErrors(error: z.ZodError): LeadFieldErrors {
  const fieldErrors: LeadFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && field in leadSubmissionSchema.shape) {
      const leadField = field as LeadSubmissionField;
      fieldErrors[leadField] ??= issue.message;
    }
  }

  return fieldErrors;
}
