export function propertyAssessmentCardState(
  _outcome: string | null | undefined,
  assessment: { id: string; status: string } | null | undefined,
) {
  return assessment ? { kind: "VIEW" as const, assessment } : { kind: "START" as const };
}
