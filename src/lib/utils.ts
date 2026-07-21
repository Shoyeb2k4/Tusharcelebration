import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as INR currency. */
export function formatCurrency(
  value: number | string | null | undefined,
  currency = 'INR',
): string {
  const num = typeof value === 'string' ? Number(value) : value ?? 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(num) ? (num as number) : 0);
}

/** Initials from a full name, for avatars. */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Debounce helper for client-side search inputs. */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  ms: number,
): (...args: Args) => void {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
