import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import type { PermissionMap } from '@/lib/rbac';

/**
 * The authenticated principal used across the app for authorization.
 * Built from the Supabase session + the app User/Role records.
 */
export interface SessionUser {
  userId: string;
  authUserId: string;
  orgId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  roleKey: string;
  roleName: string;
  permissions: PermissionMap;
}

/**
 * Resolve the current principal, or null if not authenticated / not provisioned.
 * `cache` dedupes the DB lookup within a single server request.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { authUserId: user.id },
    include: { role: true },
  });

  if (!dbUser || !dbUser.isActive) return null;

  return {
    userId: dbUser.id,
    authUserId: dbUser.authUserId,
    orgId: dbUser.orgId,
    email: dbUser.email,
    fullName: dbUser.fullName,
    avatarUrl: dbUser.avatarUrl,
    roleKey: dbUser.role.key,
    roleName: dbUser.role.name,
    permissions: (dbUser.role.permissions ?? {}) as PermissionMap,
  };
});

/**
 * Require an authenticated principal in a Server Component / Action.
 * Redirects to /login when absent.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  return user;
}
