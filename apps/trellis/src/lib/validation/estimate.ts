import { z } from "zod";

const id = z.string().trim().min(1).max(100);
const lineItem = z.object({
  description: z.string().trim().min(1).max(500),
  quantity: z.number().positive().max(100000),
  unitPriceCents: z.number().int().min(0).max(1000000000),
});
const fieldsShape = {
  details: z.string().trim().max(5000).optional(),
  notes: z.string().trim().max(5000).optional(),
  lineItems: z.array(lineItem).max(50),
};
const validTotal = <T extends { lineItems: { quantity: number; unitPriceCents: number }[] }>(
  schema: z.ZodType<T>,
) =>
  schema.refine(
    (value) =>
      value.lineItems.reduce(
        (sum, item) => sum + Math.round(item.quantity * item.unitPriceCents),
        0,
      ) <= 2_000_000_000,
    { message: "Estimate total is too large.", path: ["lineItems"] },
  );
export const estimateFieldsSchema = validTotal(z.object(fieldsShape));
export const createEstimateSchema = validTotal(z.object({ leadId: id, ...fieldsShape }));
export const updateEstimateSchema = validTotal(z.object({ estimateId: id, ...fieldsShape }));
export const estimateIdSchema = id;
