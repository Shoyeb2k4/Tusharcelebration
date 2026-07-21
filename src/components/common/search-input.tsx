'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * URL-synced search box. Debounces typing and writes `?q=` on the current
 * route so the server component can read it and re-query. Resets pagination.
 */
export function SearchInput({
  placeholder = 'Search…',
  paramKey = 'q',
}: {
  placeholder?: string;
  paramKey?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(searchParams.get(paramKey) ?? '');

  const commit = React.useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set(paramKey, next);
      else params.delete(paramKey);
      params.delete('cursor');
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, paramKey],
  );

  React.useEffect(() => {
    const t = setTimeout(() => {
      if ((searchParams.get(paramKey) ?? '') !== value) commit(value);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
