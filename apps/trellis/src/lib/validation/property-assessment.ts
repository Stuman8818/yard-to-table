import { z } from "zod";

const id = z.string().trim().min(1).max(100);
const optionalText = z.string().trim().max(5000).optional();

export const assessmentIdSchema = id;
export const assessmentFieldsSchema = z.object({
  requestedWork: optionalText,
  generalNotes: optionalText,
  accessDifficulty: optionalText,
  estimatedLaborHours: z.number().positive().max(10000).optional(),
  recommendedCrewSize: z.number().int().positive().max(1000).optional(),
  materialsNeeded: optionalText,
  equipmentNeeded: optionalText,
  disposalNeeded: optionalText,
});
export const createAssessmentSchema = assessmentFieldsSchema.extend({ consultationId: id });
export const updateAssessmentSchema = assessmentFieldsSchema.extend({ assessmentId: id });
export const completeAssessmentSchema = z.object({ assessmentId: id });
