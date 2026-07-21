'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/common/spinner';
import { CustomerCombobox } from '@/features/customers/customer-combobox';
import { createEnquirySchema, type CreateEnquiryInput } from './schema';
import { ENQUIRY_SOURCES, SOURCE_LABELS } from './config';
import { createEnquiry } from './actions';

interface EnquiryFormProps {
  fixedCustomerId?: string;
  onSuccess?: (id: string) => void;
}

export function EnquiryForm({ fixedCustomerId, onSuccess }: EnquiryFormProps) {
  const form = useForm<CreateEnquiryInput>({
    resolver: zodResolver(createEnquirySchema),
    defaultValues: {
      customerId: fixedCustomerId ?? '',
      eventType: '',
      source: 'OTHER',
      requirements: '',
    },
  });
  const [pending, startTransition] = React.useTransition();

  function onSubmit(values: CreateEnquiryInput) {
    startTransition(async () => {
      const result = await createEnquiry(values);
      if (result.ok) {
        toast.success('Enquiry created');
        onSuccess?.(result.data.id);
      } else {
        if (result.fieldErrors) {
          for (const [k, msgs] of Object.entries(result.fieldErrors)) {
            form.setError(k as keyof CreateEnquiryInput, { message: msgs?.[0] });
          }
        }
        toast.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!fixedCustomerId && (
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer *</FormLabel>
                <CustomerCombobox
                  value={field.value}
                  onChange={(id) => field.onChange(id)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event type *</FormLabel>
                <FormControl>
                  <Input placeholder="Wedding, Reception, Corporate…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ENQUIRY_SOURCES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {SOURCE_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().slice(0, 10)
                        : ''
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expectedGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="200"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? undefined : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Budget (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="500000"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? undefined : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Catering, decoration, rooms…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending && <Spinner className="text-primary-foreground" />}
            Create enquiry
          </Button>
        </div>
      </form>
    </Form>
  );
}
