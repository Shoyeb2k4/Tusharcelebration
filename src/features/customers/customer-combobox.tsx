'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/common/spinner';
import { cn } from '@/lib/utils';
import { findCustomers, type CustomerOption } from './search-action';

interface CustomerComboboxProps {
  value?: string;
  onChange: (id: string, option: CustomerOption) => void;
}

export function CustomerCombobox({ value, onChange }: CustomerComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [options, setOptions] = React.useState<CustomerOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const selected = options.find((o) => o.id === value);

  React.useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    const t = setTimeout(() => {
      findCustomers(query)
        .then((res) => {
          if (active) setOptions(res);
        })
        .finally(() => active && setLoading(false));
    }, 250);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query, open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selected ? (
            <span>
              {selected.name}{' '}
              <span className="text-muted-foreground">· {selected.phone}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select a customer…</span>
          )}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers…"
            className="border-0 focus-visible:ring-0"
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Spinner />
            </div>
          ) : options.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No customers found.
            </p>
          ) : (
            options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  onChange(o.id, o);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent/10"
              >
                <Check
                  className={cn(
                    'h-4 w-4',
                    value === o.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span className="flex-1">{o.name}</span>
                <span className="text-xs text-muted-foreground">{o.phone}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
