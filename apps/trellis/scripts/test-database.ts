import "dotenv/config";

import { prisma } from "../src/server/db/prisma";
import { findLeadsForOrganization } from "../src/server/leads/lead-repository";
import { resolveCurrentOrganization } from "../src/server/organizations/organization-service";

async function main(): Promise<void> {
  try {
    const organization = await resolveCurrentOrganization(prisma.organization);
    const leads = await findLeadsForOrganization(prisma, organization.id);

    console.log("Database connection verified successfully.");
    console.log(`Leads found: ${leads.length}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown database error occurred.";
    console.error(`Database verification failed: ${message}`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
