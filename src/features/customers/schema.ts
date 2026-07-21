import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(120),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number.')
    .max(20)
    .regex(/^[+\d][\d\s-]*$/, 'Enter a valid phone number.'),
  email: z
    .string()
    .email('Enter a valid email address.')
    .optional()
    .or(z.literal('')),
  company: z.string().max(120).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  notes: z.string().max(2000).optional().or(z.literal('')),
});

export type CustomerInput = z.infer<typeof customerSchema>;

export const customerFilterSchema = z.object({
  q: z.string().trim().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export type CustomerFilter = z.infer<typeof customerFilterSchema>;
