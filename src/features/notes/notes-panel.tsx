'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/common/empty-state';
import { Spinner } from '@/components/common/spinner';
import { timeAgo } from '@/lib/dates';
import { addNote, deleteNote } from '@/features/enquiries/actions';

export interface NoteItem {
  id: string;
  body: string;
  authorName: string | null;
  createdAt: Date | string;
}

interface NotesPanelProps {
  notes: NoteItem[];
  enquiryId?: string;
  customerId?: string;
  canWrite: boolean;
}

export function NotesPanel({
  notes,
  enquiryId,
  customerId,
  canWrite,
}: NotesPanelProps) {
  const router = useRouter();
  const [body, setBody] = React.useState('');
  const [pending, startTransition] = React.useTransition();

  function submit() {
    const value = body.trim();
    if (!value) return;
    startTransition(async () => {
      const result = await addNote({ body: value, enquiryId, customerId });
      if (result.ok) {
        setBody('');
        toast.success('Note added');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteNote(id);
      if (result.ok) {
        toast.success('Note deleted');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      {canWrite && (
        <div className="space-y-2">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a note…"
            rows={3}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit();
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">⌘/Ctrl + Enter to save</p>
            <Button size="sm" onClick={submit} disabled={pending || !body.trim()}>
              {pending && <Spinner className="text-primary-foreground" />}
              Add note
            </Button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <EmptyState title="No notes yet" description="Notes you add appear here." />
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="whitespace-pre-wrap text-sm">{n.body}</p>
                {canWrite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(n.id)}
                    disabled={pending}
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {n.authorName ?? 'Someone'} · {timeAgo(n.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
