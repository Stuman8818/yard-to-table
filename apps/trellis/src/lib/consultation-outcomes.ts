export type CompletionOutcome =
  | "ASSESSMENT_NEEDED"
  | "READY_FOR_ESTIMATE"
  | "FOLLOW_UP_NEEDED"
  | "NOT_A_GOOD_FIT"
  | "CUSTOMER_NOT_INTERESTED";

export function consultationOutcomeGuidance(outcome: CompletionOutcome | null | undefined) {
  if (outcome === "FOLLOW_UP_NEEDED") return "Recommended: schedule a follow-up consultation.";
  if (outcome === "NOT_A_GOOD_FIT" || outcome === "CUSTOMER_NOT_INTERESTED")
    return "Recommended: mark this lead lost and record the reason.";
  if (outcome === "ASSESSMENT_NEEDED")
    return "A property assessment is the recommended next step when that workflow is available.";
  if (outcome === "READY_FOR_ESTIMATE")
    return "Creating an estimate is the recommended next step when that workflow is available.";
  return "Choose the appropriate working next action below.";
}
