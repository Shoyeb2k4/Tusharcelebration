import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatTileProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  accent?: 'default' | 'success' | 'warning' | 'destructive';
}

const ACCENT: Record<NonNullable<StatTileProps['accent']>, string> = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/15 text-warning',
  destructive: 'bg-destructive/12 text-destructive',
};

export function StatTile({
  label,
  value,
  icon: Icon,
  hint,
  accent = 'default',
}: StatTileProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        {Icon && (
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-lg',
              ACCENT[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
