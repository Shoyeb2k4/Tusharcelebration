'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { audit } from '@/lib/audit';
import { type ActionResult, ok, fail, parseInput } from '@/lib/action';
import { signInSchema } from './schema';

/**
 * Sign in with email + password via Supabase Auth. On success, records a login
 * audit entry and returns ok; the client redirects.
 */
export async function signIn(input: unknown): Promise<ActionResult> {
  const parsed = parseInput(signInSchema, input);
  if (!parsed.success) return parsed.result;

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return fail('Invalid email or password.');
  }

  // Record login against the app user (best-effort).
  const dbUser = await prisma.user.findUnique({
    where: { authUserId: data.user.id },
    select: { id: true, orgId: true },
  });
  if (dbUser) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { lastLoginAt: new Date() },
    });
    await audit({
      orgId: dbUser.orgId,
      actorId: dbUser.id,
      action: 'login',
      resource: 'User',
      resourceId: dbUser.id,
    });
  }

  return ok(undefined);
}

/** Sign out and redirect to the login page. */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
