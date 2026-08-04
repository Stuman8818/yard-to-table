CREATE TYPE "ConsultationType" AS ENUM ('ON_SITE', 'PHONE');

ALTER TABLE "Consultation" DROP CONSTRAINT "Consultation_propertyId_customerId_organizationId_fkey";
ALTER TABLE "Consultation" DROP CONSTRAINT "Consultation_customerId_organizationId_fkey";
ALTER TABLE "Property" DROP CONSTRAINT "Property_customerId_organizationId_fkey";
DROP INDEX "Property_id_customerId_organizationId_key";

ALTER TABLE "Consultation" ADD COLUMN "leadId" TEXT,
ADD COLUMN "assignedUserId" TEXT,
ADD COLUMN "type" "ConsultationType" NOT NULL DEFAULT 'ON_SITE',
ALTER COLUMN "customerId" DROP NOT NULL,
ALTER COLUMN "propertyId" DROP NOT NULL;
ALTER TABLE "Property" ADD COLUMN "leadId" TEXT, ALTER COLUMN "customerId" DROP NOT NULL;

UPDATE "Consultation" c SET "leadId" = cu."sourceLeadId" FROM "Customer" cu WHERE c."customerId" = cu."id" AND c."organizationId" = cu."organizationId";

CREATE UNIQUE INDEX "Property_id_organizationId_key" ON "Property"("id", "organizationId");
CREATE INDEX "Consultation_leadId_scheduledStart_idx" ON "Consultation"("leadId", "scheduledStart");
CREATE INDEX "Consultation_assignedUserId_idx" ON "Consultation"("assignedUserId");
ALTER TABLE "Property" ADD CONSTRAINT "Property_customerId_organizationId_fkey" FOREIGN KEY ("customerId", "organizationId") REFERENCES "Customer"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_leadId_organizationId_fkey" FOREIGN KEY ("leadId", "organizationId") REFERENCES "Lead"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_leadId_organizationId_fkey" FOREIGN KEY ("leadId", "organizationId") REFERENCES "Lead"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_customerId_organizationId_fkey" FOREIGN KEY ("customerId", "organizationId") REFERENCES "Customer"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_propertyId_organizationId_fkey" FOREIGN KEY ("propertyId", "organizationId") REFERENCES "Property"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
