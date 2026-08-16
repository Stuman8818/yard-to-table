import { describe, expect, it } from "vitest";

import { deriveLeadWorkflowStatus } from "./lead-workflow";

describe("lead workflow status", () => {
  const lead = { status: "NEW" as const, consultations: [] };

  it("uses the furthest completed milestone even when earlier steps were skipped", () => {
    expect(deriveLeadWorkflowStatus({ ...lead, estimate: { status: "COMPLETED" } })).toBe(
      "ESTIMATE_COMPLETED",
    );
    expect(
      deriveLeadWorkflowStatus({
        ...lead,
        estimate: { status: "COMPLETED" },
        convertedCustomer: { id: "customer-1" },
      }),
    ).toBe("CONVERTED");
  });

  it("recognizes consultation and assessment milestones independently", () => {
    expect(deriveLeadWorkflowStatus({ ...lead, consultations: [{ status: "COMPLETED" }] })).toBe(
      "CONSULTATION_SCHEDULED",
    );
    expect(
      deriveLeadWorkflowStatus({
        ...lead,
        consultations: [{ status: "COMPLETED", assessment: { status: "COMPLETED" } }],
      }),
    ).toBe("ASSESSMENT_COMPLETED");
  });
});
