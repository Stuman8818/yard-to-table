-- Consolidate multiple legacy lawn-service selections for the same lead before
-- mapping all three legacy values to the bundled LAWN_CARE service.
DELETE FROM "LeadService" AS duplicate
USING "LeadService" AS retained
WHERE duplicate."leadId" = retained."leadId"
  AND duplicate."serviceType" IN ('LAWN_MOWING', 'TRIMMING_EDGING', 'YARD_CLEANUP')
  AND retained."serviceType" IN ('LAWN_MOWING', 'TRIMMING_EDGING', 'YARD_CLEANUP')
  AND duplicate."id" > retained."id";

ALTER TYPE "ServiceType" RENAME TO "ServiceType_old";

CREATE TYPE "ServiceType" AS ENUM (
  'LAWN_CARE',
  'GARDEN_CONSULTATION',
  'GARDEN_DESIGN',
  'GARDEN_INSTALLATION',
  'RAISED_BED_INSTALLATION',
  'GARDEN_MAINTENANCE'
);

ALTER TABLE "LeadService"
ALTER COLUMN "serviceType" TYPE "ServiceType"
USING (
  CASE
    WHEN "serviceType"::text IN ('LAWN_MOWING', 'TRIMMING_EDGING', 'YARD_CLEANUP')
      THEN 'LAWN_CARE'
    ELSE "serviceType"::text
  END
)::"ServiceType";

DROP TYPE "ServiceType_old";

