import type { EnquiryStage, EnquirySource } from '@prisma/client';
import type { BadgeProps } from '@/components/ui/badge';

type BadgeVariant = NonNullable<BadgeProps['variant']>;

interface StageMeta {
  label: string;
  variant: BadgeVariant;
}

/** Ordered pipeline stages (kanban column order). */
export const PIPELINE_STAGES: EnquiryStage[] = [
  'NEW',
  'FOLLOW_UP',
  'SITE_VISIT',
  'QUOTATION_SENT',
  'NEGOTIATION',
  'CONFIRMED',
];

/** Terminal stage rendered outside the board. */
export const LOST_STAGE: EnquiryStage = 'LOST';

export const STAGE_META: Record<EnquiryStage, StageMeta> = {
  NEW: { label: 'New', variant: 'secondary' },
  FOLLOW_UP: { label: 'Follow-up', variant: 'default' },
  SITE_VISIT: { label: 'Site Visit', variant: 'default' },
  QUOTATION_SENT: { label: 'Quotation Sent', variant: 'warning' },
  NEGOTIATION: { label: 'Negotiation', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'success' },
  LOST: { label: 'Lost', variant: 'destructive' },
};

/**
 * Allowed forward/backward transitions. CONFIRMED and LOST are terminal from
 * the board; LOST can be reached from any active stage. This is enforced in
 * the change-stage action and mirrored in the UI.
 */
export const ALLOWED_TRANSITIONS: Record<EnquiryStage, EnquiryStage[]> = {
  NEW: ['FOLLOW_UP', 'SITE_VISIT', 'QUOTATION_SENT', 'LOST'],
  FOLLOW_UP: ['NEW', 'SITE_VISIT', 'QUOTATION_SENT', 'LOST'],
  SITE_VISIT: ['FOLLOW_UP', 'QUOTATION_SENT', 'NEGOTIATION', 'LOST'],
  QUOTATION_SENT: ['SITE_VISIT', 'NEGOTIATION', 'CONFIRMED', 'LOST'],
  NEGOTIATION: ['QUOTATION_SENT', 'CONFIRMED', 'LOST'],
  CONFIRMED: [],
  LOST: ['NEW'],
};

export function canTransition(
  from: EnquiryStage,
  to: EnquiryStage,
): boolean {
  if (from === to) return false;
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export const ENQUIRY_SOURCES: EnquirySource[] = [
  'WALK_IN',
  'PHONE',
  'WHATSAPP',
  'REFERRAL',
  'WEBSITE',
  'SOCIAL',
  'BROKER',
  'OTHER',
];

export const SOURCE_LABELS: Record<EnquirySource, string> = {
  WALK_IN: 'Walk-in',
  PHONE: 'Phone',
  WHATSAPP: 'WhatsApp',
  REFERRAL: 'Referral',
  WEBSITE: 'Website',
  SOCIAL: 'Social Media',
  BROKER: 'Broker',
  OTHER: 'Other',
};

export const FOLLOWUP_CHANNELS = ['call', 'whatsapp', 'email', 'visit'] as const;
export type FollowUpChannel = (typeof FOLLOWUP_CHANNELS)[number];
