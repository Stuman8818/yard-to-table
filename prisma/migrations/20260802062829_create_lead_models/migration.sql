-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'CONSULTATION_SCHEDULED', 'ESTIMATE_SENT', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('LAWN_MOWING', 'TRIMMING_EDGING', 'YARD_CLEANUP', 'GARDEN_CONSULTATION', 'GARDEN_DESIGN', 'GARDEN_INSTALLATION', 'RAISED_BED_INSTALLATION', 'GARDEN_MAINTENANCE');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "preferredContactMethod" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadService" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,

    CONSTRAINT "LeadService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "LeadService_leadId_idx" ON "LeadService"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadService_leadId_serviceType_key" ON "LeadService"("leadId", "serviceType");

-- AddForeignKey
ALTER TABLE "LeadService" ADD CONSTRAINT "LeadService_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
