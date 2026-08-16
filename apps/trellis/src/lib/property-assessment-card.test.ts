import { describe, expect, it } from "vitest";
import { propertyAssessmentCardState } from "./property-assessment-card";

describe("property assessment lead card", () => {
  it("starts an assessment only for assessment-needed outcomes", () => {
    expect(propertyAssessmentCardState("ASSESSMENT_NEEDED", null)).toEqual({ kind: "START" });
    expect(propertyAssessmentCardState("READY_FOR_ESTIMATE", null)).toBeNull();
  });

  it("shows an existing assessment instead of the start action", () => {
    const assessment = { id: "assessment-1", status: "DRAFT" };
    expect(propertyAssessmentCardState("ASSESSMENT_NEEDED", assessment)).toEqual({
      kind: "VIEW",
      assessment,
    });
  });
});
