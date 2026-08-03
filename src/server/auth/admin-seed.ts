import type { OrganizationRole, Prisma } from "@prisma/client";

import { hashPassword } from "./password";

interface AdminSeedRepositories {
  user: {
    upsert(args: {
      where: { email: string };
      update: Record<string, never>;
      create: Prisma.UserCreateInput;
      select: { id: true };
    }): Promise<{ id: string }>;
  };
  organizationMembership: {
    upsert(args: {
      where: { userId_organizationId: { userId: string; organizationId: string } };
      update: Record<string, never>;
      create: {
        userId: string;
        organizationId: string;
        role: OrganizationRole;
      };
    }): Promise<unknown>;
  };
}

export interface AdminSeedInput {
  email: string;
  password: string;
  name?: string;
}

export function readAdminSeedInput(
  environment: Record<string, string | undefined>,
): AdminSeedInput | null {
  const email = environment.SEED_ADMIN_EMAIL?.trim();
  const password = environment.SEED_ADMIN_PASSWORD;
  const name = environment.SEED_ADMIN_NAME?.trim();

  if (!email && !password) return null;
  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be provided together.");
  }
  if (password.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must contain at least 12 characters.");
  }

  return { email: email.toLowerCase(), password, ...(name ? { name } : {}) };
}

export async function seedInitialAdmin(
  repositories: AdminSeedRepositories,
  organizationId: string,
  input: AdminSeedInput,
  createHash: (password: string) => Promise<string> = hashPassword,
): Promise<void> {
  const passwordHash = await createHash(input.password);
  const user = await repositories.user.upsert({
    where: { email: input.email.trim().toLowerCase() },
    update: {},
    create: {
      email: input.email.trim().toLowerCase(),
      name: input.name,
      passwordHash,
    },
    select: { id: true },
  });

  await repositories.organizationMembership.upsert({
    where: {
      userId_organizationId: { userId: user.id, organizationId },
    },
    update: {},
    create: {
      userId: user.id,
      organizationId,
      role: "OWNER",
    },
  });
}
