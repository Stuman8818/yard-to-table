import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
const migration = readFileSync(
  join(process.cwd(), "prisma", "migrations", "20260803150000_add_consultations", "migration.sql"),
  "utf8",
);
describe("consultation migration", () => {
  it("enforces time and tenant-consistent customer/property relations", () => {
    expect(migration).toContain('CONSTRAINT "Consultation_time_check"');
    expect(migration).toContain('FOREIGN KEY ("customerId", "organizationId")');
    expect(migration).toContain('FOREIGN KEY ("propertyId", "customerId", "organizationId")');
  });
});
