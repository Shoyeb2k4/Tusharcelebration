import { prisma } from '@/lib/prisma';

interface AuditInput {
  orgId: string;
  actorId?: string | null;
  action: 'create' | 'update' | 'delete' | 'approve' | 'login' | 'export';
  resource: string;
  resourceId?: string | null;
  before?: unknown;
  after?: unknown;
}

/**
 * Write an audit-log entry for a critical action. Never throws into the caller —
 * an audit failure must not fail the business operation, but is logged.
 */
export async function audit(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        orgId: input.orgId,
        actorId: input.actorId ?? null,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId ?? null,
        before: (input.before ?? undefined) as never,
        after: (input.after ?? undefined) as never,
      },
    });
  } catch (err) {
    console.error('[audit] failed to write audit log', err);
  }
}
