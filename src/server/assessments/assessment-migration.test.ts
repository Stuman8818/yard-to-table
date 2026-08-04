import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "prisma",
    "migrations",
    "20260803180000_add_property_assessments",
    "migration.sql",
  ),
  "utf8",
);

describe("property assessment migration", () => {
  it("prevents duplicates and enforces tenant-consistent relations", () => {
    expect(migration).toContain('"PropertyAssessment_consultationId_key"');
    expect(migration).toContain('FOREIGN KEY ("leadId", "organizationId")');
    expect(migration).toContain('FOREIGN KEY ("consultationId", "organizationId")');
    expect(migration).toContain('FOREIGN KEY ("propertyId", "organizationId")');
  });
});
