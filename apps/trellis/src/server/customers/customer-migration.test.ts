import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "prisma",
    "migrations",
    "20260803130000_add_customers_and_properties",
    "migration.sql",
  ),
  "utf8",
);

describe("customer/property migration", () => {
  it("enforces one conversion and same-organization relations", () => {
    expect(migration).toContain('UNIQUE INDEX "Customer_sourceLeadId_key"');
    expect(migration).toContain('FOREIGN KEY ("sourceLeadId", "organizationId")');
    expect(migration).toContain('FOREIGN KEY ("customerId", "organizationId")');
  });
});
