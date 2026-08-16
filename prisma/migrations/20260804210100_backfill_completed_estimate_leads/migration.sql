UPDATE "Lead" AS lead
SET "status" = 'ESTIMATE_COMPLETED'
WHERE EXISTS (
  SELECT 1
  FROM "Estimate" AS estimate
  WHERE estimate."leadId" = lead."id"
    AND estimate."organizationId" = lead."organizationId"
    AND estimate."status" = 'COMPLETED'
);
