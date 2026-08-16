import type { LeadStatus } from "@/graphql/generated/graphql";

export interface LeadWorkflowRecord {
  status: LeadStatus;
  convertedCustomer?: { id: string } | null;
  estimate?: { status: string } | null;
  consultations?: Array<{
    status: string;
    assessment?: { status: string } | null;
  }>;
}

export function deriveLeadWorkflowStatus(lead: LeadWorkflowRecord): LeadStatus {
  if (lead.convertedCustomer) return "CONVERTED";
  if (lead.estimate?.status === "COMPLETED") return "ESTIMATE_COMPLETED";
  if (lead.consultations?.some(({ assessment }) => assessment?.status === "COMPLETED")) {
    return "ASSESSMENT_COMPLETED";
  }
  if (lead.consultations?.some(({ status }) => status === "SCHEDULED" || status === "COMPLETED")) {
    return "CONSULTATION_SCHEDULED";
  }
  return lead.status === "LOST" || lead.status === "CONTACTED" ? lead.status : "NEW";
}

export function leadWorkflowStatusLabel(status: LeadStatus): string {
  const labels: Partial<Record<LeadStatus, string>> = {
    NEW: "New lead",
    CONSULTATION_SCHEDULED: "Consultation scheduled",
    ASSESSMENT_COMPLETED: "Assessment complete",
    ESTIMATE_COMPLETED: "Estimate complete",
    CONVERTED: "Customer converted",
  };
  return (
    labels[status] ??
    status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/^./, (c) => c.toUpperCase())
  );
}
