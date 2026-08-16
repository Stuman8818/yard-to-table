ALTER TYPE "LeadStatus" ADD VALUE 'CONSULTATION_COMPLETED';

CREATE TYPE "ConsultationOutcome" AS ENUM (
  'ASSESSMENT_NEEDED',
  'READY_FOR_ESTIMATE',
  'FOLLOW_UP_NEEDED',
  'NOT_A_GOOD_FIT',
  'CUSTOMER_NOT_INTERESTED'
);

ALTER TABLE "Consultation"
  ADD COLUMN "completedAt" TIMESTAMP(3),
  ADD COLUMN "completedByUserId" TEXT,
  ADD COLUMN "completionNotes" TEXT,
  ADD COLUMN "actualDuration" INTEGER,
  ADD COLUMN "outcome" "ConsultationOutcome";

ALTER TABLE "Consultation"
  ADD CONSTRAINT "Consultation_actualDuration_check"
  CHECK ("actualDuration" IS NULL OR ("actualDuration" >= 1 AND "actualDuration" <= 1440));

CREATE INDEX "Consultation_completedByUserId_idx" ON "Consultation"("completedByUserId");

ALTER TABLE "Consultation"
  ADD CONSTRAINT "Consultation_completedByUserId_fkey"
  FOREIGN KEY ("completedByUserId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
