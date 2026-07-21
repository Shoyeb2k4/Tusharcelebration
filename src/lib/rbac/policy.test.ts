import { describe, expect, it } from 'vitest';
import { can, canAccess, assertCan, ForbiddenError, visibleResources } from './policy';
import { SYSTEM_ROLE_BY_KEY } from './roles';

const principal = (key: keyof typeof SYSTEM_ROLE_BY_KEY) => ({
  permissions: SYSTEM_ROLE_BY_KEY[key].permissions,
});

describe('RBAC policy', () => {
  it('grants Accounts full control of payments', () => {
    expect(can(principal('ACCOUNTS'), 'create', 'payment')).toBe(true);
    expect(can(principal('ACCOUNTS'), 'delete', 'payment')).toBe(true);
  });

  it('denies Sales any write on payments', () => {
    expect(can(principal('SALES_EXECUTIVE'), 'create', 'payment')).toBe(false);
    expect(can(principal('SALES_EXECUTIVE'), 'read', 'payment')).toBe(true);
  });

  it('makes the Auditor read-only everywhere it can see', () => {
    const auditor = principal('AUDITOR');
    expect(can(auditor, 'read', 'event')).toBe(true);
    for (const action of ['create', 'update', 'delete', 'approve'] as const) {
      expect(can(auditor, action, 'event')).toBe(false);
    }
  });

  it('hides resources a role cannot access (nav filtering)', () => {
    expect(canAccess(principal('SECURITY'), 'payment')).toBe(false);
    expect(visibleResources(principal('SECURITY'), ['payment', 'task', 'event']))
      .toEqual(['task', 'event']);
  });

  it('only lets a permitted role approve expenses', () => {
    expect(can(principal('GENERAL_MANAGER'), 'approve', 'expense')).toBe(true);
    expect(can(principal('KITCHEN_MANAGER'), 'approve', 'expense')).toBe(false);
  });

  it('assertCan throws ForbiddenError when denied', () => {
    expect(() => assertCan(principal('SECURITY'), 'create', 'payment'))
      .toThrow(ForbiddenError);
    expect(() => assertCan(principal('ACCOUNTS'), 'create', 'payment')).not.toThrow();
  });
});
