import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "prisma", "migrations", "20260803000000_add_organizations", "migration.sql"),
  "utf8",
);

describe("organization migration", () => {
  it("seeds and backfills before making lead ownership required", () => {
    const insert = migration.indexOf('INSERT INTO "Organization"');
    const backfill = migration.indexOf('UPDATE "Lead"');
    const required = migration.indexOf('ALTER COLUMN "organizationId" SET NOT NULL');

    expect(insert).toBeGreaterThan(-1);
    expect(migration).toContain('ON CONFLICT ("slug") DO NOTHING');
    expect(backfill).toBeGreaterThan(insert);
    expect(required).toBeGreaterThan(backfill);
  });
});
