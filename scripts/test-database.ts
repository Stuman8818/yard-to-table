import "dotenv/config";

import { prisma } from "../src/server/db/prisma";

async function main(): Promise<void> {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        requestedServices: true,
      },
    });

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
