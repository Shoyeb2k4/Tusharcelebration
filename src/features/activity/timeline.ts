import type { EnquiryStage } from '@prisma/client';
import { STAGE_META } from '@/features/enquiries/config';

export type ActivityKind =
  | 'created'
  | 'stage_change'
  | 'followup_scheduled'
  | 'followup_completed'
  | 'note'
  | 'attachment';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  detail?: string;
  at: Date;
  actor?: string | null;
}

/** Minimal shapes the builder consumes — decoupled from Prisma includes. */
interface TimelineSource {
  createdAt: Date;
  pipelineEvents: {
    id: string;
    fromStage: EnquiryStage | null;
    toStage: EnquiryStage;
    note: string | null;
    createdAt: Date;
  }[];
  followUps: {
    id: string;
    channel: string;
    note: string | null;
    dueAt: Date;
    completedAt: Date | null;
    outcome: string | null;
    createdAt: Date;
  }[];
  crmNotes: {
    id: string;
    body: string;
    authorName: string | null;
    createdAt: Date;
  }[];
  attachments: {
    id: string;
    kind: string;
    caption: string | null;
    createdAt: Date;
  }[];
}

/**
 * Merge an enquiry's related records into a single reverse-chronological
 * activity timeline. Pure and deterministic — unit tested.
 */
export function buildEnquiryTimeline(source: TimelineSource): ActivityItem[] {
  const items: ActivityItem[] = [];

  items.push({
    id: 'created',
    kind: 'created',
    title: 'Enquiry created',
    at: source.createdAt,
  });

  for (const ev of source.pipelineEvents) {
    const to = STAGE_META[ev.toStage].label;
    const from = ev.fromStage ? STAGE_META[ev.fromStage].label : null;
    items.push({
      id: `pipe-${ev.id}`,
      kind: 'stage_change',
      title: from ? `Moved ${from} → ${to}` : `Stage set to ${to}`,
      detail: ev.note ?? undefined,
      at: ev.createdAt,
    });
  }

  for (const f of source.followUps) {
    items.push({
      id: `fu-${f.id}`,
      kind: 'followup_scheduled',
      title: `Follow-up scheduled (${f.channel})`,
      detail: f.note ?? undefined,
      at: f.createdAt,
    });
    if (f.completedAt) {
      items.push({
        id: `fud-${f.id}`,
        kind: 'followup_completed',
        title: `Follow-up completed (${f.channel})`,
        detail: f.outcome ?? undefined,
        at: f.completedAt,
      });
    }
  }

  for (const n of source.crmNotes) {
    items.push({
      id: `note-${n.id}`,
      kind: 'note',
      title: 'Note added',
      detail: n.body,
      at: n.createdAt,
      actor: n.authorName,
    });
  }

  for (const a of source.attachments) {
    items.push({
      id: `att-${a.id}`,
      kind: 'attachment',
      title: a.kind === 'photo' ? 'Photo attached' : 'File attached',
      detail: a.caption ?? undefined,
      at: a.createdAt,
    });
  }

  return items.sort((a, b) => b.at.getTime() - a.at.getTime());
}
