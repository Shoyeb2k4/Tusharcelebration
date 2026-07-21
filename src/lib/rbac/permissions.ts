/**
 * RBAC — resources & actions.
 *
 * A permission is a (resource, action) pair. Roles are maps of
 * resource -> allowed actions. The policy engine (`can`) evaluates them.
 * This is the single source of truth consumed by the API guard and the UI.
 */

export const RESOURCES = [
  'dashboard',
  'enquiry',
  'customer',
  'venue',
  'quotation',
  'booking',
  'event',
  'payment',
  'invoice',
  'expense',
  'catering',
  'decoration',
  'room',
  'inventory',
  'vendor',
  'staff',
  'attendance',
  'task',
  'approval',
  'document',
  'report',
  'message',
  'settings',
  'role',
  'auditLog',
] as const;

export type Resource = (typeof RESOURCES)[number];

export const ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'approve',
  'export',
] as const;

export type Action = (typeof ACTIONS)[number];

/** Wildcard grant helper — all actions on a resource. */
export const ALL: Action[] = [...ACTIONS];

/** Read-only helper. */
export const READ: Action[] = ['read'];

/** A role's permission map. Missing resource = no access. */
export type PermissionMap = Partial<Record<Resource, Action[]>>;
