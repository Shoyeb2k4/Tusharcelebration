import { describe, expect, it } from 'vitest';
import { createEnquirySchema, changeStageSchema } from './schema';

const CUID = 'clh1234567890abcdef1234x';

describe('createEnquirySchema', () => {
  it('requires a customer and event type', () => {
    expect(createEnquirySchema.safeParse({}).success).toBe(false);
    expect(
      createEnquirySchema.safeParse({
        customerId: CUID,
        eventType: 'Wedding',
      }).success,
    ).toBe(true);
  });

  it('coerces numeric budget and guest strings', () => {
    const r = createEnquirySchema.safeParse({
      customerId: CUID,
      eventType: 'Wedding',
      budget: '500000',
      expectedGuests: '200',
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.budget).toBe(500000);
      expect(r.data.expectedGuests).toBe(200);
    }
  });

  it('defaults source to OTHER', () => {
    const r = createEnquirySchema.parse({
      customerId: CUID,
      eventType: 'Wedding',
    });
    expect(r.source).toBe('OTHER');
  });
});

describe('changeStageSchema', () => {
  it('accepts a valid stage change', () => {
    const r = changeStageSchema.safeParse({
      enquiryId: CUID,
      toStage: 'FOLLOW_UP',
    });
    expect(r.success).toBe(true);
  });

  it('rejects an unknown stage', () => {
    const r = changeStageSchema.safeParse({
      enquiryId: CUID,
      toStage: 'ARCHIVED',
    });
    expect(r.success).toBe(false);
  });
});
