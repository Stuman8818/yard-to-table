import type { OrganizationRole } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/server/db/prisma";
import {
  ADMIN_LEAD_ROLES,
  AuthenticationRequiredError,
  requireAllowedRole,
  resolveAuthenticatedMembership,
} from "./auth-service";

interface SessionIdentity {
  user?: { id?: string; email?: string | null; name?: string | null };
}

interface MembershipLookup {
  findMany(args: {
    where: { userId: string };
    select: {
      id: true;
      organizationId: true;
      role: true;
      organization: { select: { name: true } };
    };
    take: number;
  }): Promise<
    Array<{
      id: string;
      organizationId: string;
      role: OrganizationRole;
      organization: { name: string };
    }>
  >;
}

export async function authorizeAdminSession(
  session: SessionIdentity | null,
  membershipRepository: MembershipLookup,
) {
  const userId = session?.user?.id;
  if (!userId) throw new AuthenticationRequiredError("Authentication is required.");

  const membership = await resolveAuthenticatedMembership(userId, membershipRepository);
  requireAllowedRole(membership, ADMIN_LEAD_ROLES);

  return {
    user: {
      id: userId,
      email: session.user?.email ?? null,
      name: session.user?.name ?? null,
    },
    membership,
  };
}

export async function getAdminPageAccess() {
  return authorizeAdminSession(await auth(), prisma.organizationMembership);
}
