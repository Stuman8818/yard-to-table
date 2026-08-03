import type { OrganizationRole } from "@prisma/client";

import { verifyPassword } from "./password";

export const ADMIN_LEAD_ROLES = ["OWNER", "ADMIN"] as const satisfies readonly OrganizationRole[];

interface CredentialUserRepository {
  findUnique(args: {
    where: { email: string };
    select: { id: true; email: true; name: true; passwordHash: true };
  }): Promise<{ id: string; email: string; name: string | null; passwordHash: string } | null>;
}

interface MembershipRepository {
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

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthenticatedMembership {
  membershipId: string;
  organizationId: string;
  organizationName: string;
  role: OrganizationRole;
}

export class AuthenticationRequiredError extends Error {}
export class OrganizationAccessError extends Error {}

export async function authenticateCredentials(
  email: string,
  password: string,
  repository: CredentialUserRepository,
): Promise<AuthenticatedUser | null> {
  const user = await repository.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, email: true, name: true, passwordHash: true },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return null;
  }

  return { id: user.id, email: user.email, name: user.name };
}

export async function resolveAuthenticatedMembership(
  userId: string,
  repository: MembershipRepository,
): Promise<AuthenticatedMembership> {
  const memberships = await repository.findMany({
    where: { userId },
    select: {
      id: true,
      organizationId: true,
      role: true,
      organization: { select: { name: true } },
    },
    take: 2,
  });

  const [membership] = memberships;
  if (memberships.length !== 1 || !membership) {
    throw new OrganizationAccessError(
      memberships.length === 0
        ? "No organization membership is available."
        : "Organization selection is required.",
    );
  }

  return {
    membershipId: membership.id,
    organizationId: membership.organizationId,
    organizationName: membership.organization.name,
    role: membership.role,
  };
}

export function requireAllowedRole(
  membership: AuthenticatedMembership,
  allowedRoles: readonly OrganizationRole[],
): AuthenticatedMembership {
  if (!allowedRoles.includes(membership.role)) {
    throw new OrganizationAccessError("This account does not have access to this resource.");
  }

  return membership;
}
