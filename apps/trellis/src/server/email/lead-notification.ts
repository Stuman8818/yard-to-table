import { Resend } from "resend";

import type { LeadSubmissionInput } from "@/lib/validation/lead";
import { getDesiredTimingLabel, getServiceDetailLabel, serviceDefinitions } from "@/lib/services";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendLeadNotification(input: LeadSubmissionInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Resend is not configured.");
  }

  const resend = new Resend(apiKey);
  const toAddress = process.env.CONTACT_RECIPIENT || "dave.stewart.8823@gmail.com";
  const fromAddress = process.env.FROM_ADDRESS || "Yard To Table <onboarding@resend.dev>";
  const email = buildLeadNotification(input);

  const result = await resend.emails.send({
    from: fromAddress,
    to: [toAddress],
    replyTo: input.email,
    ...email,
  });

  if (result.error) {
    throw new Error("Resend rejected the notification.");
  }
}

export function buildLeadNotification(input: LeadSubmissionInput) {
  const fullName = `${input.firstName} ${input.lastName}`.trim();
  const services = input.serviceTypes.map((type) => serviceDefinitions[type].label).join(", ");
  const serviceDetails = input.serviceDetails
    .map((detail) => getServiceDetailLabel(detail))
    .filter((label): label is string => Boolean(label))
    .join(", ");
  const desiredTiming = getDesiredTimingLabel(input.desiredTiming) ?? "Not specified";
  const safeMessage = escapeHtml(input.message).replaceAll("\n", "<br />");

  return {
    subject: `New estimate request from ${fullName}`,
    text: `Name: ${fullName}\nPhone: ${input.phone}\nAddress: ${input.address}\nCity: ${input.city}\nState: IN\nPostal Code: ${input.postalCode}\nEmail: ${input.email}\nService categories: ${services}\nSpecific services: ${serviceDetails || "Not specified"}\nDesired timing: ${desiredTiming}\n\nProject description:\n${input.message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
           <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
           <p><strong>Address:</strong> ${escapeHtml(input.address)}</p>
           <p><strong>City:</strong> ${escapeHtml(input.city)}</p>
           <p><strong>State:</strong> IN</p>
           <p><strong>Postal Code:</strong> ${escapeHtml(input.postalCode)}</p>
           <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
           <p><strong>Service categories:</strong> ${escapeHtml(services)}</p>
           <p><strong>Specific services:</strong> ${escapeHtml(serviceDetails || "Not specified")}</p>
           <p><strong>Desired timing:</strong> ${escapeHtml(desiredTiming)}</p>
           <hr/>
           <p><strong>Project description:</strong></p>
           <p>${safeMessage}</p>`,
  };
}
