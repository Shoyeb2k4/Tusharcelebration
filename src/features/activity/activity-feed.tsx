import {
  GitBranch,
  StickyNote,
  Paperclip,
  CalendarClock,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { timeAgo } from '@/lib/dates';
import type { ActivityItem, ActivityKind } from './timeline';

const ICON: Record<ActivityKind, LucideIcon> = {
  created: Sparkles,
  stage_change: GitBranch,
  followup_scheduled: CalendarClock,
  followup_completed: CheckCircle2,
  note: StickyNote,
  attachment: Paperclip,
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <EmptyState title="No activity yet" />;
  }

  return (
    <ol className="relative space-y-4 border-l pl-6">
      {items.map((item) => {
        const Icon = ICON[item.kind];
        return (
          <li key={item.id} className="relative">
            <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border bg-card">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{item.title}</p>
              {item.detail && (
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {item.detail}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {item.actor ? `${item.actor} · ` : ''}
                {timeAgo(item.at)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
