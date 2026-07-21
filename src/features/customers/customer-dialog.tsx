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
import { CustomerForm } from './customer-form';
import type { CustomerInput } from './schema';

interface CustomerDialogProps {
  trigger?: React.ReactNode;
  customerId?: string;
  defaultValues?: Partial<CustomerInput>;
  redirectOnCreate?: boolean;
}

export function CustomerDialog({
  trigger,
  customerId,
  defaultValues,
  redirectOnCreate,
}: CustomerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            New customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {customerId ? 'Edit customer' : 'New customer'}
          </DialogTitle>
          <DialogDescription>
            {customerId
              ? 'Update this customer’s contact details.'
              : 'Add a customer to start tracking enquiries and bookings.'}
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          customerId={customerId}
          defaultValues={defaultValues}
          onSuccess={(id) => {
            setOpen(false);
            if (redirectOnCreate && !customerId) router.push(`/customers/${id}`);
            else router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
