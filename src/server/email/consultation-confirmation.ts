import { Resend } from "resend";

export async function sendConsultationConfirmation(input: {
  email: string;
  firstName: string;
  scheduledStart: Date;
  type: "ON_SITE" | "PHONE";
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) throw new Error("Resend is not configured.");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: process.env.FROM_ADDRESS || "Yard To Table <onboarding@resend.dev>",
    to: [input.email],
    subject: "Your Yard To Table consultation",
    text: `Hi ${input.firstName}, your ${input.type === "PHONE" ? "phone" : "on-site"} consultation is scheduled for ${input.scheduledStart.toLocaleString()}.`,
  });
  if (result.error) throw new Error("Resend rejected the consultation confirmation.");
}
