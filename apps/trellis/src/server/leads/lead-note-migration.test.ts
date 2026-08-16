import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "prisma", "migrations", "20260803020000_add_lead_notes", "migration.sql"),
  "utf8",
);

describe("lead note migration", () => {
  it("requires a valid lead and author without duplicating organization ownership", () => {
    expect(migration).toContain('REFERENCES "Lead"("id") ON DELETE CASCADE');
    expect(migration).toContain('REFERENCES "User"("id") ON DELETE RESTRICT');
    expect(migration).not.toContain('"organizationId"');
  });
});
