CREATE TYPE "ConsultationStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW');

CREATE UNIQUE INDEX "Property_id_customerId_organizationId_key" ON "Property"("id", "customerId", "organizationId");

CREATE TABLE "Consultation" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "scheduledStart" TIMESTAMP(3) NOT NULL,
  "scheduledEnd" TIMESTAMP(3) NOT NULL,
  "status" "ConsultationStatus" NOT NULL DEFAULT 'SCHEDULED',
  "notes" TEXT,
  "createdByUserId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Consultation_time_check" CHECK ("scheduledEnd" > "scheduledStart")
);

CREATE INDEX "Consultation_organizationId_scheduledStart_idx" ON "Consultation"("organizationId", "scheduledStart");
CREATE INDEX "Consultation_customerId_scheduledStart_idx" ON "Consultation"("customerId", "scheduledStart");
CREATE INDEX "Consultation_propertyId_scheduledStart_idx" ON "Consultation"("propertyId", "scheduledStart");
CREATE INDEX "Consultation_createdByUserId_idx" ON "Consultation"("createdByUserId");

ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_customerId_organizationId_fkey" FOREIGN KEY ("customerId", "organizationId") REFERENCES "Customer"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_propertyId_customerId_organizationId_fkey" FOREIGN KEY ("propertyId", "customerId", "organizationId") REFERENCES "Property"("id", "customerId", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
