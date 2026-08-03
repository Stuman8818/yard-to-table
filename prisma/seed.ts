import "dotenv/config";

import { prisma } from "../src/server/db/prisma";
import { seedCurrentOrganization } from "../src/server/organizations/organization-service";

async function main(): Promise<void> {
  await seedCurrentOrganization(prisma.organization);
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
