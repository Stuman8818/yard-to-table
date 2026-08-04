"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import type { PropsWithChildren } from "react";

function getGraphQLUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/graphql";
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return new URL("/api/graphql", appUrl).toString();
}

function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Lead: {
          fields: {
            consultations: {
              merge: false,
            },
          },
        },
      },
    }),
    link: new HttpLink({
      uri: getGraphQLUrl(),
    }),
  });
}

export function ApolloProvider({ children }: PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
