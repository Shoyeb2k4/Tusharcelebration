import { describe, expect, it } from 'vitest';
import {
  canTransition,
  ALLOWED_TRANSITIONS,
  PIPELINE_STAGES,
  STAGE_META,
} from './config';

describe('pipeline stage transitions', () => {
  it('allows the standard forward path to CONFIRMED', () => {
    expect(canTransition('NEW', 'FOLLOW_UP')).toBe(true);
    expect(canTransition('SITE_VISIT', 'QUOTATION_SENT')).toBe(true);
    expect(canTransition('QUOTATION_SENT', 'NEGOTIATION')).toBe(true);
    expect(canTransition('NEGOTIATION', 'CONFIRMED')).toBe(true);
  });

  it('lets any non-terminal active stage be marked LOST', () => {
    const active = PIPELINE_STAGES.filter((s) => s !== 'CONFIRMED');
    for (const stage of active) {
      expect(canTransition(stage, 'LOST')).toBe(true);
    }
    // CONFIRMED is terminal — it cannot be lost.
    expect(canTransition('CONFIRMED', 'LOST')).toBe(false);
  });

  it('treats CONFIRMED as terminal', () => {
    expect(ALLOWED_TRANSITIONS.CONFIRMED).toHaveLength(0);
    expect(canTransition('CONFIRMED', 'NEGOTIATION')).toBe(false);
  });

  it('rejects skipping straight from NEW to CONFIRMED', () => {
    expect(canTransition('NEW', 'CONFIRMED')).toBe(false);
  });

  it('never allows a no-op transition to the same stage', () => {
    for (const stage of PIPELINE_STAGES) {
      expect(canTransition(stage, stage)).toBe(false);
    }
  });

  it('has display metadata for every stage', () => {
    for (const stage of [...PIPELINE_STAGES, 'LOST'] as const) {
      expect(STAGE_META[stage].label).toBeTruthy();
    }
  });
});
