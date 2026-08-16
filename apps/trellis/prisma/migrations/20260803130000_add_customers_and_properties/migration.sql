-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sourceLeadId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "accessNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Lead_id_organizationId_key" ON "Lead"("id", "organizationId");
CREATE UNIQUE INDEX "Customer_sourceLeadId_key" ON "Customer"("sourceLeadId");
CREATE UNIQUE INDEX "Customer_id_organizationId_key" ON "Customer"("id", "organizationId");
CREATE UNIQUE INDEX "Customer_sourceLeadId_organizationId_key" ON "Customer"("sourceLeadId", "organizationId");
CREATE INDEX "Customer_organizationId_createdAt_idx" ON "Customer"("organizationId", "createdAt");
CREATE INDEX "Customer_organizationId_email_idx" ON "Customer"("organizationId", "email");
CREATE INDEX "Property_organizationId_createdAt_idx" ON "Property"("organizationId", "createdAt");
CREATE INDEX "Property_customerId_idx" ON "Property"("customerId");

ALTER TABLE "Customer" ADD CONSTRAINT "Customer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_sourceLeadId_organizationId_fkey" FOREIGN KEY ("sourceLeadId", "organizationId") REFERENCES "Lead"("id", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_customerId_organizationId_fkey" FOREIGN KEY ("customerId", "organizationId") REFERENCES "Customer"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
