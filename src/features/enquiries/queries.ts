import 'server-only';
import type { EnquiryStage } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { EnquiryFilter } from './schema';
import { PIPELINE_STAGES, LOST_STAGE } from './config';

const enquiryCardInclude = {
  customer: { select: { id: true, name: true, phone: true } },
  owner: { select: { id: true, fullName: true } },
  _count: { select: { followUps: true } },
} as const;

function buildWhere(orgId: string, filter: EnquiryFilter) {
  const q = filter.q?.trim();
  return {
    orgId,
    ...(filter.stage ? { stage: filter.stage } : {}),
    ...(filter.source ? { source: filter.source } : {}),
    ...(filter.ownerId ? { ownerId: filter.ownerId } : {}),
    ...(q
      ? {
          OR: [
            { code: { contains: q, mode: 'insensitive' as const } },
            { eventType: { contains: q, mode: 'insensitive' as const } },
            { customer: { name: { contains: q, mode: 'insensitive' as const } } },
            { customer: { phone: { contains: q } } },
          ],
        }
      : {}),
  };
}

export type EnquiryCard = Awaited<ReturnType<typeof listEnquiries>>[number];

/** Flat, filtered list (list view). */
export async function listEnquiries(orgId: string, filter: EnquiryFilter) {
  return prisma.enquiry.findMany({
    where: buildWhere(orgId, filter),
    include: enquiryCardInclude,
    orderBy: { updatedAt: 'desc' },
    take: 200,
  });
}

/** Board data grouped by pipeline stage. */
export async function getPipelineBoard(orgId: string, filter: EnquiryFilter) {
  const rows = await prisma.enquiry.findMany({
    where: buildWhere(orgId, { ...filter, stage: undefined }),
    include: enquiryCardInclude,
    orderBy: { updatedAt: 'desc' },
    take: 500,
  });

  const columns: Record<EnquiryStage, typeof rows> = {
    NEW: [],
    FOLLOW_UP: [],
    SITE_VISIT: [],
    QUOTATION_SENT: [],
    NEGOTIATION: [],
    CONFIRMED: [],
    LOST: [],
  };
  for (const row of rows) columns[row.stage].push(row);

  return {
    board: PIPELINE_STAGES.map((stage) => ({
      stage,
      items: columns[stage],
    })),
    lost: columns[LOST_STAGE],
  };
}

/** Full enquiry detail: customer, follow-ups, notes, attachments, history. */
export async function getEnquiry(orgId: string, id: string) {
  return prisma.enquiry.findFirst({
    where: { id, orgId },
    include: {
      customer: true,
      owner: { select: { id: true, fullName: true } },
      followUps: { orderBy: { dueAt: 'asc' } },
      crmNotes: { orderBy: { createdAt: 'desc' } },
      attachments: { orderBy: { createdAt: 'desc' } },
      pipelineEvents: { orderBy: { createdAt: 'desc' } },
    },
  });
}

/** Pipeline conversion + response-time metrics for dashboards. */
export async function getEnquiryMetrics(orgId: string) {
  const [byStage, total, responded] = await Promise.all([
    prisma.enquiry.groupBy({
      by: ['stage'],
      where: { orgId },
      _count: { _all: true },
    }),
    prisma.enquiry.count({ where: { orgId } }),
    prisma.enquiry.count({
      where: { orgId, firstResponseAt: { not: null } },
    }),
  ]);

  const counts = Object.fromEntries(
    byStage.map((r) => [r.stage, r._count._all]),
  ) as Record<EnquiryStage, number>;

  const confirmed = counts.CONFIRMED ?? 0;
  const lost = counts.LOST ?? 0;
  const closed = confirmed + lost;

  return {
    total,
    counts,
    conversionRate: closed > 0 ? confirmed / closed : 0,
    responseRate: total > 0 ? responded / total : 0,
  };
}
