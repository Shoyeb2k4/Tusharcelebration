import { z } from 'zod';
import { ForbiddenError } from '@/lib/rbac';

/** Discriminated result returned by every Server Action. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });
export const fail = (
  error: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult<never> => ({ ok: false, error, fieldErrors });

/**
 * Parse an input with a Zod schema, returning a typed value or a structured
 * field-error result. Keeps Server Actions free of repetitive try/catch.
 */
export function parseInput<S extends z.ZodTypeAny>(
  schema: S,
  input: unknown,
):
  | { success: true; data: z.infer<S> }
  | { success: false; result: ActionResult<never> } {
  const parsed = schema.safeParse(input);
  if (parsed.success) return { success: true, data: parsed.data };
  return {
    success: false,
    result: fail('Please correct the highlighted fields.', {
      ...parsed.error.flatten().fieldErrors,
    } as Record<string, string[]>),
  };
}

/**
 * Convert a thrown error into a user-safe ActionResult. Authorization errors
 * become a clear 403-style message; everything else is a generic failure with
 * the detail logged server-side.
 */
export function toActionError(err: unknown): ActionResult<never> {
  if (err instanceof ForbiddenError) return fail(err.message);
  console.error('[action] unhandled error', err);
  return fail('Something went wrong. Please try again.');
}
