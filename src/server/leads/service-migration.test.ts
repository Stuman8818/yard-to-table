import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "prisma", "migrations", "20260802210000_bundle_lawn_care", "migration.sql"),
  "utf8",
);

describe("bundle lawn care migration", () => {
  it("deduplicates legacy services for each lead before replacing the enum", () => {
    expect(migration).toContain('DELETE FROM "LeadService" AS duplicate');
    expect(migration).toContain('duplicate."leadId" = retained."leadId"');
    expect(migration.indexOf("DELETE FROM")).toBeLessThan(migration.indexOf("ALTER TYPE"));
  });

  it.each(["LAWN_MOWING", "TRIMMING_EDGING", "YARD_CLEANUP"])(
    "maps %s to LAWN_CARE",
    (legacyValue) => {
      expect(migration).toContain(legacyValue);
      expect(migration).toContain("THEN 'LAWN_CARE'");
    },
  );
});
