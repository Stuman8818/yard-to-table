import type { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";
import {
  resolveAuthenticatedMembership,
  type AuthenticatedMembership,
} from "@/server/auth/auth-service";
import { prisma } from "@/server/db/prisma";

export interface GraphQLContext {
  prisma: PrismaClient;
  request: NextRequest;
  authenticatedUserId: string | null;
  membership: AuthenticatedMembership | null;
}

export async function createGraphQLContext(request: NextRequest): Promise<GraphQLContext> {
  const session = await auth();
  const authenticatedUserId = session?.user.id ?? null;
  let membership: AuthenticatedMembership | null = null;

  if (authenticatedUserId) {
    try {
      membership = await resolveAuthenticatedMembership(
        authenticatedUserId,
        prisma.organizationMembership,
      );
    } catch {
      membership = null;
    }
  }

  return {
    prisma,
    request,
    authenticatedUserId,
    membership,
  };
}
