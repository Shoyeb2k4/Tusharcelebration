import { prisma } from '@/lib/prisma';

/**
 * Generate a human-friendly sequential code like ENQ-2026-000042, scoped per
 * org per year. Uses the current count as a sequence base; the unique
 * constraint on (orgId, code) is the real guard and callers retry on clash.
 */
export async function nextEnquiryCode(orgId: string): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.enquiry.count({ where: { orgId } });
  const seq = String(count + 1).padStart(6, '0');
  return `ENQ-${year}-${seq}`;
}
