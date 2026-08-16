-- DropForeignKey
ALTER TABLE "LeadNote" DROP CONSTRAINT "LeadNote_organizationId_fkey";

-- AlterTable
ALTER TABLE "LeadNote" DROP COLUMN "organizationId";
