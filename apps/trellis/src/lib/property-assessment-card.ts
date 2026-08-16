export function propertyAssessmentCardState(
  outcome: string | null | undefined,
  assessment: { id: string; status: string } | null | undefined,
) {
  if (outcome !== "ASSESSMENT_NEEDED") return null;
  return assessment ? { kind: "VIEW" as const, assessment } : { kind: "START" as const };
}
