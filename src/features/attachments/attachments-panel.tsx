'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Paperclip, ExternalLink, ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/common/empty-state';
import { Spinner } from '@/components/common/spinner';
import { timeAgo } from '@/lib/dates';
import { addAttachment } from '@/features/enquiries/actions';

export interface AttachmentItem {
  id: string;
  kind: string;
  fileUrl: string;
  caption: string | null;
  createdAt: Date | string;
}

/**
 * Phase 1 links files by URL (e.g. a Supabase Storage signed URL). The binary
 * upload flow — request signed URL → PUT to Storage → save returned path — is
 * wired in the same action shape and lands with the storage bucket config.
 */
export function AttachmentsPanel({
  enquiryId,
  attachments,
  canWrite,
}: {
  enquiryId: string;
  attachments: AttachmentItem[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const [fileUrl, setFileUrl] = React.useState('');
  const [caption, setCaption] = React.useState('');
  const [kind, setKind] = React.useState<'file' | 'photo'>('file');
  const [pending, startTransition] = React.useTransition();

  function submit() {
    if (!fileUrl.trim()) {
      toast.error('Provide a file URL.');
      return;
    }
    startTransition(async () => {
      const result = await addAttachment({
        enquiryId,
        fileUrl: fileUrl.trim(),
        caption,
        kind,
      });
      if (result.ok) {
        setFileUrl('');
        setCaption('');
        toast.success('Attachment added');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      {canWrite && (
        <div className="space-y-3 rounded-lg border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
            <Input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://…/file.pdf"
              aria-label="File URL"
            />
            <Select value={kind} onValueChange={(v) => setKind(v as 'file' | 'photo')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="photo">Photo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            aria-label="Caption"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={submit} disabled={pending}>
              {pending && <Spinner className="text-primary-foreground" />}
              <Paperclip className="h-4 w-4" />
              Attach
            </Button>
          </div>
        </div>
      )}

      {attachments.length === 0 ? (
        <EmptyState
          icon={Paperclip}
          title="No attachments"
          description="Quotes, reference images and documents can be attached here."
        />
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {attachments.map((a) => {
            const Icon = a.kind === 'photo' ? ImageIcon : FileText;
            return (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {a.caption || a.fileUrl.split('/').pop() || 'Attachment'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(a.createdAt)}
                  </p>
                </div>
                <a
                  href={a.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Open attachment"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
