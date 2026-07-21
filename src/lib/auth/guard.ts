import { assertCan, type Action, type Resource } from '@/lib/rbac';
import { requireUser, type SessionUser } from './session';

/**
 * Server-side authorization guard for Server Actions and Route Handlers.
 * Resolves the principal, enforces the permission, and returns the principal.
 * Throws ForbiddenError (mapped to a friendly action error) when denied.
 */
export async function authorize(
  action: Action,
  resource: Resource,
): Promise<SessionUser> {
  const user = await requireUser();
  assertCan(user, action, resource);
  return user;
}
