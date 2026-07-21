'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ENQUIRY_SOURCES, SOURCE_LABELS } from './config';

function useUpdateParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return React.useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );
}

export function ViewToggle() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') === 'list' ? 'list' : 'board';
  const update = useUpdateParam();

  return (
    <div className="inline-flex rounded-md border p-0.5">
      <Button
        variant="ghost"
        size="sm"
        className={cn('h-8 gap-1.5', view === 'board' && 'bg-muted')}
        onClick={() => update('view', 'board')}
      >
        <LayoutGrid className="h-4 w-4" />
        Board
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn('h-8 gap-1.5', view === 'list' && 'bg-muted')}
        onClick={() => update('view', 'list')}
      >
        <List className="h-4 w-4" />
        List
      </Button>
    </div>
  );
}

export function SourceFilter() {
  const searchParams = useSearchParams();
  const current = searchParams.get('source') ?? 'all';
  const update = useUpdateParam();

  return (
    <Select
      value={current}
      onValueChange={(v) => update('source', v === 'all' ? null : v)}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="All sources" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All sources</SelectItem>
        {ENQUIRY_SOURCES.map((s) => (
          <SelectItem key={s} value={s}>
            {SOURCE_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
