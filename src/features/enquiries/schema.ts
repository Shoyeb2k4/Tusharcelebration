import { z } from 'zod';
import { FOLLOWUP_CHANNELS } from './config';

const EnquiryStageEnum = z.enum([
  'NEW',
  'FOLLOW_UP',
  'SITE_VISIT',
  'QUOTATION_SENT',
  'NEGOTIATION',
  'CONFIRMED',
  'LOST',
]);

const EnquirySourceEnum = z.enum([
  'WALK_IN',
  'PHONE',
  'WHATSAPP',
  'REFERRAL',
  'WEBSITE',
  'SOCIAL',
  'BROKER',
  'OTHER',
]);

export const createEnquirySchema = z.object({
  customerId: z.string().cuid('Select a customer.'),
  eventType: z.string().min(2, 'Event type is required.').max(80),
  eventDate: z.coerce.date().optional(),
  expectedGuests: z.coerce.number().int().min(0).max(100000).optional(),
  budget: z.coerce.number().min(0).max(1_000_000_000).optional(),
  source: EnquirySourceEnum.default('OTHER'),
  requirements: z.string().max(2000).optional().or(z.literal('')),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;

export const changeStageSchema = z.object({
  enquiryId: z.string().cuid(),
  toStage: EnquiryStageEnum,
  note: z.string().max(500).optional().or(z.literal('')),
  lostReason: z.string().max(500).optional().or(z.literal('')),
});

export type ChangeStageInput = z.infer<typeof changeStageSchema>;

export const createFollowUpSchema = z.object({
  enquiryId: z.string().cuid(),
  dueAt: z.coerce.date(),
  channel: z.enum(FOLLOWUP_CHANNELS),
  note: z.string().max(500).optional().or(z.literal('')),
});

export type CreateFollowUpInput = z.infer<typeof createFollowUpSchema>;

export const completeFollowUpSchema = z.object({
  followUpId: z.string().cuid(),
  outcome: z.string().max(500).optional().or(z.literal('')),
});

export type CompleteFollowUpInput = z.infer<typeof completeFollowUpSchema>;

export const enquiryFilterSchema = z.object({
  q: z.string().trim().optional(),
  stage: EnquiryStageEnum.optional(),
  source: EnquirySourceEnum.optional(),
  ownerId: z.string().optional(),
});

export type EnquiryFilter = z.infer<typeof enquiryFilterSchema>;

export const noteSchema = z.object({
  body: z.string().min(1, 'Note cannot be empty.').max(2000),
  customerId: z.string().cuid().optional(),
  enquiryId: z.string().cuid().optional(),
});

export type NoteInput = z.infer<typeof noteSchema>;

export const attachmentSchema = z.object({
  enquiryId: z.string().cuid(),
  fileUrl: z.string().url('Enter a valid file URL.'),
  caption: z.string().max(200).optional().or(z.literal('')),
  kind: z.enum(['file', 'photo']).default('file'),
});

export type AttachmentInput = z.infer<typeof attachmentSchema>;
