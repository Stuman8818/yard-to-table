CREATE TYPE "EstimateStatus" AS ENUM ('DRAFT', 'COMPLETED');

CREATE TABLE "Estimate" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "consultationId" TEXT,
  "assessmentId" TEXT,
  "createdByUserId" TEXT NOT NULL,
  "status" "EstimateStatus" NOT NULL DEFAULT 'DRAFT',
  "details" TEXT,
  "notes" TEXT,
  "totalCents" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "Estimate_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Estimate_totalCents_check" CHECK ("totalCents" >= 0)
);

CREATE TABLE "EstimateLineItem" (
  "id" TEXT NOT NULL,
  "estimateId" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unitPriceCents" INTEGER NOT NULL,
  "totalCents" INTEGER NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "EstimateLineItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EstimateLineItem_values_check" CHECK ("quantity" > 0 AND "unitPriceCents" >= 0 AND "totalCents" >= 0)
);

CREATE UNIQUE INDEX "Estimate_leadId_key" ON "Estimate"("leadId");
CREATE UNIQUE INDEX "Estimate_assessmentId_key" ON "Estimate"("assessmentId");
CREATE UNIQUE INDEX "Estimate_id_organizationId_key" ON "Estimate"("id", "organizationId");
CREATE UNIQUE INDEX "Estimate_leadId_organizationId_key" ON "Estimate"("leadId", "organizationId");
CREATE UNIQUE INDEX "Estimate_assessmentId_organizationId_key" ON "Estimate"("assessmentId", "organizationId");
CREATE INDEX "Estimate_organizationId_createdAt_idx" ON "Estimate"("organizationId", "createdAt");
CREATE INDEX "Estimate_consultationId_idx" ON "Estimate"("consultationId");
CREATE INDEX "Estimate_createdByUserId_idx" ON "Estimate"("createdByUserId");
CREATE INDEX "EstimateLineItem_estimateId_sortOrder_idx" ON "EstimateLineItem"("estimateId", "sortOrder");

ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_leadId_organizationId_fkey" FOREIGN KEY ("leadId", "organizationId") REFERENCES "Lead"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_consultationId_organizationId_fkey" FOREIGN KEY ("consultationId", "organizationId") REFERENCES "Consultation"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_assessmentId_organizationId_fkey" FOREIGN KEY ("assessmentId", "organizationId") REFERENCES "PropertyAssessment"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EstimateLineItem" ADD CONSTRAINT "EstimateLineItem_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
