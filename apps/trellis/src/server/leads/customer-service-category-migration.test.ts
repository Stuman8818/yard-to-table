import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "prisma",
    "migrations",
    "20260815120000_expand_customer_service_categories",
    "migration.sql",
  ),
  "utf8",
);

describe("customer service category migration", () => {
  it.each([
    "LAWN_MAINTENANCE",
    "LANDSCAPE_MAINTENANCE",
    "LANDSCAPE_INSTALLATION",
    "PROPERTY_CLEANUP_REFRESH",
    "NOT_SURE",
  ])("adds %s without removing legacy service values", (serviceType) => {
    expect(migration).toContain(`ADD VALUE IF NOT EXISTS '${serviceType}'`);
  });

  it("only extends the existing enum", () => {
    expect(migration).not.toContain("DROP TYPE");
    expect(migration).not.toContain("DELETE FROM");
  });
});
