import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "prisma",
    "migrations",
    "20260803010000_add_users_and_memberships",
    "migration.sql",
  ),
  "utf8",
);

describe("user membership migration", () => {
  it("creates roles, unique email identity, and one membership per organization", () => {
    expect(migration).toContain("'OWNER', 'ADMIN', 'MANAGER', 'CREW'");
    expect(migration).toContain('UNIQUE INDEX "User_email_key"');
    expect(migration).toContain('"OrganizationMembership_userId_organizationId_key"');
  });
});
