'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CalendarClock, Check, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/common/empty-state';
import { Spinner } from '@/components/common/spinner';
import { cn } from '@/lib/utils';
import { formatDateTime, isOverdue, timeAgo } from '@/lib/dates';
import { FOLLOWUP_CHANNELS, type FollowUpChannel } from '@/features/enquiries/config';
import { addFollowUp, completeFollowUp } from '@/features/enquiries/actions';

export interface FollowUpItem {
  id: string;
  channel: string;
  note: string | null;
  dueAt: Date | string;
  completedAt: Date | string | null;
  outcome: string | null;
}

const CHANNEL_ICON: Record<string, React.ElementType> = {
  call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  visit: MapPin,
};

export function FollowUpsPanel({
  enquiryId,
  followUps,
  canWrite,
}: {
  enquiryId: string;
  followUps: FollowUpItem[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const [dueAt, setDueAt] = React.useState('');
  const [channel, setChannel] = React.useState<FollowUpChannel>('call');
  const [note, setNote] = React.useState('');
  const [pending, startTransition] = React.useTransition();

  const pendingItems = followUps.filter((f) => !f.completedAt);
  const doneItems = followUps.filter((f) => f.completedAt);

  function schedule() {
    if (!dueAt) {
      toast.error('Pick a date and time.');
      return;
    }
    startTransition(async () => {
      const result = await addFollowUp({
        enquiryId,
        dueAt: new Date(dueAt),
        channel,
        note,
      });
      if (result.ok) {
        setDueAt('');
        setNote('');
        toast.success('Follow-up scheduled');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function complete(id: string) {
    startTransition(async () => {
      const result = await completeFollowUp({ followUpId: id });
      if (result.ok) {
        toast.success('Follow-up completed');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-5">
      {canWrite && (
        <div className="space-y-3 rounded-lg border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">When</label>
              <Input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Channel</label>
              <Select
                value={channel}
                onValueChange={(v) => setChannel(v as FollowUpChannel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOLLOWUP_CHANNELS.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's this follow-up about?"
            rows={2}
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={schedule} disabled={pending}>
              {pending && <Spinner className="text-primary-foreground" />}
              Schedule follow-up
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Upcoming</h4>
        {pendingItems.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No follow-ups scheduled"
            description="Stay on top of leads by scheduling the next touch."
          />
        ) : (
          <ul className="space-y-2">
            {pendingItems.map((f) => {
              const Icon = CHANNEL_ICON[f.channel] ?? CalendarClock;
              const overdue = isOverdue(f.dueAt);
              return (
                <li
                  key={f.id}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">
                        {f.channel}
                      </span>
                      {overdue && <Badge variant="destructive">Overdue</Badge>}
                    </div>
                    <p className={cn('text-xs', overdue ? 'text-destructive' : 'text-muted-foreground')}>
                      {formatDateTime(f.dueAt)}
                    </p>
                    {f.note && <p className="mt-1 text-sm">{f.note}</p>}
                  </div>
                  {canWrite && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => complete(f.id)}
                      disabled={pending}
                    >
                      <Check className="h-4 w-4" />
                      Done
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {doneItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Completed</h4>
          <ul className="space-y-2">
            {doneItems.map((f) => (
              <li key={f.id} className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  <span className="capitalize">{f.channel}</span>
                  <span className="text-xs text-muted-foreground">
                    · {timeAgo(f.completedAt)}
                  </span>
                </div>
                {f.outcome && <p className="mt-1 text-sm">{f.outcome}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
