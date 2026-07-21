import 'server-only';
import { endOfDay } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { getEnquiryMetrics } from '@/features/enquiries/queries';

/** Aggregate data for the executive dashboard (Phase 1 scope). */
export async function getDashboardData(orgId: string) {
  const now = new Date();
  const todayEnd = endOfDay(now);

  const [metrics, customerCount, followUpsDue, recentEnquiries, newThisStage] =
    await Promise.all([
      getEnquiryMetrics(orgId),
      prisma.customer.count({ where: { orgId } }),
      prisma.followUp.findMany({
        where: {
          completedAt: null,
          dueAt: { lte: todayEnd },
          enquiry: { orgId },
        },
        orderBy: { dueAt: 'asc' },
        take: 8,
        include: {
          enquiry: {
            select: {
              id: true,
              eventType: true,
              customer: { select: { name: true } },
            },
          },
        },
      }),
      prisma.enquiry.findMany({
        where: { orgId },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: {
          customer: { select: { name: true } },
        },
      }),
      prisma.enquiry.count({ where: { orgId, stage: 'NEW' } }),
    ]);

  return {
    metrics,
    customerCount,
    followUpsDue,
    recentEnquiries,
    newEnquiries: newThisStage,
  };
}
