import { format, formatDistanceToNow, isPast } from 'date-fns';

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatDateTime(
  date: Date | string | null | undefined,
): string {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy, h:mm a');
}

export function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return '—';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isOverdue(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  return isPast(new Date(date));
}
