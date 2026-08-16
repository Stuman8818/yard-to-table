import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "prisma", "migrations", "20260804200000_add_estimates", "migration.sql"),
  "utf8",
);
describe("estimate migration", () => {
  it("enforces one estimate per lead and tenant-consistent relations", () => {
    expect(migration).toContain('"Estimate_leadId_key"');
    expect(migration).toContain('FOREIGN KEY ("leadId", "organizationId")');
    expect(migration).toContain('FOREIGN KEY ("assessmentId", "organizationId")');
    expect(migration).toContain("ON DELETE CASCADE");
  });
});
