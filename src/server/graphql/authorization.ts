import { GraphQLError } from "graphql";

import { LEAD_EDIT_ROLES, LEAD_VIEW_ROLES, requireAllowedRole } from "@/server/auth/auth-service";
import type { GraphQLContext } from "./context";

export function requireAdminLeadAccess(context: GraphQLContext) {
  return requireLeadRole(context, LEAD_VIEW_ROLES, "view leads");
}

export function requireLeadEditAccess(context: GraphQLContext) {
  return requireLeadRole(context, LEAD_EDIT_ROLES, "modify leads");
}

function requireLeadRole(
  context: GraphQLContext,
  roles: Parameters<typeof requireAllowedRole>[1],
  action: string,
) {
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
    return requireAllowedRole(context.membership, roles);
  } catch {
    throw new GraphQLError(`You do not have permission to ${action}.`, {
      extensions: { code: "FORBIDDEN" },
    });
  }
}
