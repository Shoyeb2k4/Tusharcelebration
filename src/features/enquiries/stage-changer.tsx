'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';
import type { EnquiryStage } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/common/spinner';
import { ALLOWED_TRANSITIONS, STAGE_META } from './config';
import { StageBadge } from './stage-badge';
import { changeStage } from './actions';

export function StageChanger({
  enquiryId,
  stage,
  canWrite,
}: {
  enquiryId: string;
  stage: EnquiryStage;
  canWrite: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [lostOpen, setLostOpen] = React.useState(false);
  const [lostReason, setLostReason] = React.useState('');

  const targets = ALLOWED_TRANSITIONS[stage] ?? [];

  function move(toStage: EnquiryStage, reason?: string) {
    startTransition(async () => {
      const result = await changeStage({
        enquiryId,
        toStage,
        lostReason: reason,
      });
      if (result.ok) {
        toast.success(`Moved to ${STAGE_META[toStage].label}`);
        setLostOpen(false);
        setLostReason('');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  if (!canWrite || targets.length === 0) {
    return <StageBadge stage={stage} />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={pending}>
            {pending ? <Spinner /> : <StageBadge stage={stage} />}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Move to</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {targets.map((t) => (
            <DropdownMenuItem
              key={t}
              onSelect={(e) => {
                e.preventDefault();
                if (t === 'LOST') setLostOpen(true);
                else move(t);
              }}
            >
              {STAGE_META[t].label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={lostOpen} onOpenChange={setLostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark enquiry as lost</DialogTitle>
            <DialogDescription>
              Record why this enquiry didn’t convert — it feeds loss-reason
              reporting.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={lostReason}
            onChange={(e) => setLostReason(e.target.value)}
            placeholder="e.g. Budget mismatch, chose another venue…"
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setLostOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={pending || !lostReason.trim()}
              onClick={() => move('LOST', lostReason)}
            >
              {pending && <Spinner className="text-destructive-foreground" />}
              Mark as lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
