import { z } from "zod";

const phoneMessage = "Enter a valid US phone number.";

export const leadSubmissionSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name.").max(50, "First name is too long."),
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
    .array(z.literal("LAWN_CARE"))
    .length(1, "Lawn Care is the only service currently available."),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more about the service you need.")
    .max(2000, "Message must be 2,000 characters or fewer."),
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
