import type { Lead } from "@prisma/client";

import type { GraphQLContext } from "./context";

export const resolvers = {
  Query: {
    health: () => ({
      status: "ok",
      timestamp: new Date().toISOString(),
    }),
    leads: (_parent: unknown, _args: Record<string, never>, context: GraphQLContext) =>
      context.prisma.lead.findMany({
        include: {
          requestedServices: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
  },
  Lead: {
    createdAt: (lead: Lead) => lead.createdAt.toISOString(),
    updatedAt: (lead: Lead) => lead.updatedAt.toISOString(),
  },
};
