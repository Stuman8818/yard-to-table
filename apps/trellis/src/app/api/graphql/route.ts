import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import type { NextRequest } from "next/server";

import { createGraphQLContext, type GraphQLContext } from "@/server/graphql/context";
import { resolvers } from "@/server/graphql/resolvers";
import { typeDefs } from "@/server/graphql/schema";

export const runtime = "nodejs";

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(server, {
  context: async (request) => createGraphQLContext(request),
});

export function GET(request: NextRequest): Promise<Response> {
  return handler(request);
}

export function POST(request: NextRequest): Promise<Response> {
  return handler(request);
}
