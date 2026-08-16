import { describe, expect, it } from "vitest";
import { propertyAssessmentCardState } from "./property-assessment-card";

describe("property assessment lead card", () => {
  it("allows an assessment regardless of consultation outcome", () => {
    expect(propertyAssessmentCardState("ASSESSMENT_NEEDED", null)).toEqual({ kind: "START" });
    expect(propertyAssessmentCardState("READY_FOR_ESTIMATE", null)).toEqual({ kind: "START" });
  });

  it("shows an existing assessment instead of the start action", () => {
    const assessment = { id: "assessment-1", status: "DRAFT" };
    expect(propertyAssessmentCardState("ASSESSMENT_NEEDED", assessment)).toEqual({
      kind: "VIEW",
      assessment,
    });
  });
});
