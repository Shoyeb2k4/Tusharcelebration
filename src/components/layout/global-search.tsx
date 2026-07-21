'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * Lightweight global search. Phase 1 scope: routes to the enquiry/customer
 * lists with a query. The full command-palette (⌘K) lands with more entities.
 */
export function GlobalSearch() {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/customers?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative hidden w-full max-w-sm md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search customers, enquiries…"
        aria-label="Global search"
        className="pl-9 pr-16"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
        ⌘K
      </kbd>
    </form>
  );
}
