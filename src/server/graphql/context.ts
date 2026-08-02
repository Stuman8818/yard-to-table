import type { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";

import { prisma } from "@/server/db/prisma";

export interface GraphQLContext {
  prisma: PrismaClient;
  request: NextRequest;
}

export function createGraphQLContext(request: NextRequest): GraphQLContext {
  return {
    prisma,
    request,
  };
}
