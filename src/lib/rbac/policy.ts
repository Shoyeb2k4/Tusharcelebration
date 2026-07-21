/**
 * RBAC policy engine.
 *
 * `can()` is the single decision point used by:
 *   - the API guard (server) before any handler runs, and
 *   - the UI (client) to hide/disable actions.
 *
 * It reads the caller's effective PermissionMap (from their Role, which may be
 * a customized clone of a system template) — never trusts client-sent claims.
 */

import { Action, PermissionMap, Resource } from './permissions';

export interface Principal {
  userId: string;
  orgId: string;
  roleKey: string;
  permissions: PermissionMap;
}

/** Core check: does the principal have `action` on `resource`? */
export function can(
  principal: Pick<Principal, 'permissions'>,
  action: Action,
  resource: Resource,
): boolean {
  const allowed = principal.permissions[resource];
  return Array.isArray(allowed) && allowed.includes(action);
}

/** True if the principal has any access to a resource (drives nav visibility). */
export function canAccess(
  principal: Pick<Principal, 'permissions'>,
  resource: Resource,
): boolean {
  const allowed = principal.permissions[resource];
  return Array.isArray(allowed) && allowed.length > 0;
}

/**
 * Assert a permission or throw a typed authorization error.
 * The API guard maps ForbiddenError -> HTTP 403.
 */
export class ForbiddenError extends Error {
  readonly code = 'FORBIDDEN';
  constructor(action: Action, resource: Resource) {
    super(`Not permitted to ${action} ${resource}`);
    this.name = 'ForbiddenError';
  }
}

export function assertCan(
  principal: Pick<Principal, 'permissions'>,
  action: Action,
  resource: Resource,
): void {
  if (!can(principal, action, resource)) {
    throw new ForbiddenError(action, resource);
  }
}

/**
 * Filter a set of nav resources down to those the principal can see.
 * Used to build the sidebar per role.
 */
export function visibleResources(
  principal: Pick<Principal, 'permissions'>,
  resources: Resource[],
): Resource[] {
  return resources.filter((r) => canAccess(principal, r));
}
