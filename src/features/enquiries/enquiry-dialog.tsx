'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EnquiryForm } from './enquiry-form';

export function EnquiryDialog({
  fixedCustomerId,
  trigger,
}: {
  fixedCustomerId?: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            New enquiry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New enquiry</DialogTitle>
          <DialogDescription>
            Capture a lead and it enters the pipeline at the New stage.
          </DialogDescription>
        </DialogHeader>
        <EnquiryForm
          fixedCustomerId={fixedCustomerId}
          onSuccess={(id) => {
            setOpen(false);
            router.push(`/enquiries/${id}`);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
