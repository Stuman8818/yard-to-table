import "dotenv/config";

import { prisma } from "../src/server/db/prisma";
import { readAdminSeedInput, seedInitialAdmin } from "../src/server/auth/admin-seed";
import { seedCurrentOrganization } from "../src/server/organizations/organization-service";

async function main(): Promise<void> {
  const organization = await seedCurrentOrganization(prisma.organization);
  const admin = readAdminSeedInput(process.env);

  if (admin) {
    await seedInitialAdmin(prisma, organization.id, admin);
  }
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed.", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
