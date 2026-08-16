import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
const migration = readFileSync(
  join(process.cwd(), "prisma", "migrations", "20260803150000_add_consultations", "migration.sql"),
  "utf8",
);
const completionMigration = readFileSync(
  join(
    process.cwd(),
    "prisma",
    "migrations",
    "20260803170000_complete_consultations",
    "migration.sql",
  ),
  "utf8",
);
describe("consultation migration", () => {
  it("enforces time and tenant-consistent customer/property relations", () => {
    expect(migration).toContain('CONSTRAINT "Consultation_time_check"');
    expect(migration).toContain('FOREIGN KEY ("customerId", "organizationId")');
    expect(migration).toContain('FOREIGN KEY ("propertyId", "customerId", "organizationId")');
  });
  it("adds stable completion metadata and outcomes", () => {
    expect(completionMigration).toContain('CREATE TYPE "ConsultationOutcome"');
    expect(completionMigration).toContain('ADD COLUMN "completedAt"');
    expect(completionMigration).toContain('ADD COLUMN "completedByUserId"');
    expect(completionMigration).toContain('ADD COLUMN "completionNotes"');
    expect(completionMigration).toContain('ADD COLUMN "actualDuration"');
    expect(completionMigration).toContain('ADD COLUMN "outcome"');
  });
});
