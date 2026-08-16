CREATE TYPE "PropertyAssessmentStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_id_organizationId_key" UNIQUE ("id", "organizationId");

CREATE TABLE "PropertyAssessment" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "consultationId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "createdByUserId" TEXT NOT NULL,
  "status" "PropertyAssessmentStatus" NOT NULL DEFAULT 'DRAFT',
  "requestedWork" TEXT,
  "generalNotes" TEXT,
  "accessDifficulty" TEXT,
  "estimatedLaborHours" DOUBLE PRECISION,
  "recommendedCrewSize" INTEGER,
  "materialsNeeded" TEXT,
  "equipmentNeeded" TEXT,
  "disposalNeeded" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "PropertyAssessment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PropertyAssessment_labor_check" CHECK ("estimatedLaborHours" IS NULL OR "estimatedLaborHours" > 0),
  CONSTRAINT "PropertyAssessment_crew_check" CHECK ("recommendedCrewSize" IS NULL OR "recommendedCrewSize" > 0)
);

CREATE UNIQUE INDEX "PropertyAssessment_consultationId_key" ON "PropertyAssessment"("consultationId");
CREATE UNIQUE INDEX "PropertyAssessment_id_organizationId_key" ON "PropertyAssessment"("id", "organizationId");
CREATE UNIQUE INDEX "PropertyAssessment_consultationId_organizationId_key" ON "PropertyAssessment"("consultationId", "organizationId");
CREATE INDEX "PropertyAssessment_organizationId_createdAt_idx" ON "PropertyAssessment"("organizationId", "createdAt");
CREATE INDEX "PropertyAssessment_leadId_idx" ON "PropertyAssessment"("leadId");
CREATE INDEX "PropertyAssessment_propertyId_idx" ON "PropertyAssessment"("propertyId");
CREATE INDEX "PropertyAssessment_createdByUserId_idx" ON "PropertyAssessment"("createdByUserId");

ALTER TABLE "PropertyAssessment" ADD CONSTRAINT "PropertyAssessment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertyAssessment" ADD CONSTRAINT "PropertyAssessment_leadId_organizationId_fkey" FOREIGN KEY ("leadId", "organizationId") REFERENCES "Lead"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertyAssessment" ADD CONSTRAINT "PropertyAssessment_consultationId_organizationId_fkey" FOREIGN KEY ("consultationId", "organizationId") REFERENCES "Consultation"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertyAssessment" ADD CONSTRAINT "PropertyAssessment_propertyId_organizationId_fkey" FOREIGN KEY ("propertyId", "organizationId") REFERENCES "Property"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertyAssessment" ADD CONSTRAINT "PropertyAssessment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
