import 'server-only';
import { prisma } from '@/lib/prisma';
import type { CustomerFilter } from './schema';

/**
 * List customers for an org with optional text search over name/phone/email,
 * plus enquiry counts. Cursor-paginated.
 */
export async function listCustomers(orgId: string, filter: CustomerFilter) {
  const q = filter.q?.trim();
  const where = {
    orgId,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { phone: { contains: q } },
            { email: { contains: q, mode: 'insensitive' as const } },
            { company: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const rows = await prisma.customer.findMany({
    where,
    take: filter.limit + 1,
    ...(filter.cursor ? { cursor: { id: filter.cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { enquiries: true, bookings: true } },
    },
  });

  const hasMore = rows.length > filter.limit;
  const data = hasMore ? rows.slice(0, filter.limit) : rows;
  return {
    data,
    nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null,
  };
}

/** Full customer detail with contacts, enquiries and notes. */
export async function getCustomer(orgId: string, id: string) {
  return prisma.customer.findFirst({
    where: { id, orgId },
    include: {
      contacts: true,
      enquiries: {
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { fullName: true } } },
      },
      crmNotes: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
      _count: { select: { enquiries: true, bookings: true } },
    },
  });
}

/** Minimal customer options for select inputs. */
export async function listCustomerOptions(orgId: string, q?: string) {
  return prisma.customer.findMany({
    where: {
      orgId,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' as const } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
    select: { id: true, name: true, phone: true },
    orderBy: { name: 'asc' },
    take: 20,
  });
}
