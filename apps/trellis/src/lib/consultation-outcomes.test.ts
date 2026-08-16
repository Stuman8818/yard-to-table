import { describe, expect, it } from "vitest";
import { consultationOutcomeGuidance, type CompletionOutcome } from "./consultation-outcomes";

describe("completed consultation outcome guidance", () => {
  it.each<[CompletionOutcome, string]>([
    ["ASSESSMENT_NEEDED", "property assessment"],
    ["READY_FOR_ESTIMATE", "estimate"],
    ["FOLLOW_UP_NEEDED", "follow-up"],
    ["NOT_A_GOOD_FIT", "mark this lead lost"],
    ["CUSTOMER_NOT_INTERESTED", "mark this lead lost"],
  ])("guides %s to a supported next step", (outcome, expected) => {
    expect(consultationOutcomeGuidance(outcome)).toContain(expected);
  });
});
