-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- Seed the initial tenant. The fixed ID makes this deterministic while the slug
-- conflict guard keeps the migration safe if the organization already exists.
INSERT INTO "Organization" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES ('org_yard_to_table', 'Yard To Table', 'yard-to-table', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

-- Add the ownership column as nullable so databases with existing leads can be
-- backfilled before the required constraint is applied.
ALTER TABLE "Lead" ADD COLUMN "organizationId" TEXT;

UPDATE "Lead"
SET "organizationId" = (
    SELECT "id" FROM "Organization" WHERE "slug" = 'yard-to-table'
)
WHERE "organizationId" IS NULL;

ALTER TABLE "Lead" ALTER COLUMN "organizationId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Lead_organizationId_idx" ON "Lead"("organizationId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_fkey"
FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
