import { describe, expect, it } from 'vitest';
import { buildEnquiryTimeline } from './timeline';

const base = {
  createdAt: new Date('2026-01-01T10:00:00Z'),
  pipelineEvents: [],
  followUps: [],
  crmNotes: [],
  attachments: [],
};

describe('buildEnquiryTimeline', () => {
  it('always includes the creation event', () => {
    const items = buildEnquiryTimeline(base);
    expect(items).toHaveLength(1);
    expect(items[0].kind).toBe('created');
  });

  it('emits both scheduled and completed events for a done follow-up', () => {
    const items = buildEnquiryTimeline({
      ...base,
      followUps: [
        {
          id: 'f1',
          channel: 'call',
          note: 'Discuss menu',
          dueAt: new Date('2026-01-03T10:00:00Z'),
          completedAt: new Date('2026-01-03T11:00:00Z'),
          outcome: 'Interested',
          createdAt: new Date('2026-01-02T10:00:00Z'),
        },
      ],
    });
    const kinds = items.map((i) => i.kind);
    expect(kinds).toContain('followup_scheduled');
    expect(kinds).toContain('followup_completed');
  });

  it('renders a readable stage-change title', () => {
    const items = buildEnquiryTimeline({
      ...base,
      pipelineEvents: [
        {
          id: 'p1',
          fromStage: 'NEW',
          toStage: 'FOLLOW_UP',
          note: null,
          createdAt: new Date('2026-01-02T09:00:00Z'),
        },
      ],
    });
    const stage = items.find((i) => i.kind === 'stage_change');
    expect(stage?.title).toBe('Moved New → Follow-up');
  });

  it('returns items in reverse-chronological order', () => {
    const items = buildEnquiryTimeline({
      ...base,
      crmNotes: [
        {
          id: 'n1',
          body: 'first',
          authorName: 'A',
          createdAt: new Date('2026-01-05T10:00:00Z'),
        },
      ],
      attachments: [
        {
          id: 'a1',
          kind: 'file',
          caption: null,
          createdAt: new Date('2026-01-04T10:00:00Z'),
        },
      ],
    });
    const times = items.map((i) => i.at.getTime());
    const sorted = [...times].sort((a, b) => b - a);
    expect(times).toEqual(sorted);
    expect(items[0].kind).toBe('note'); // most recent
  });
});
