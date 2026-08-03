import { GraphQLError } from "graphql";

import { ADMIN_LEAD_ROLES, requireAllowedRole } from "@/server/auth/auth-service";
import type { GraphQLContext } from "./context";

export function requireAdminLeadAccess(context: GraphQLContext) {
  if (!context.authenticatedUserId) {
    throw new GraphQLError("Authentication is required.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  if (!context.membership) {
    throw new GraphQLError("Organization access is required.", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  try {
    return requireAllowedRole(context.membership, ADMIN_LEAD_ROLES);
  } catch {
    throw new GraphQLError("You do not have permission to view leads.", {
      extensions: { code: "FORBIDDEN" },
    });
  }
}
