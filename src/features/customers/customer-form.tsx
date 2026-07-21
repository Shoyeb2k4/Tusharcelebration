'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/common/spinner';
import { customerSchema, type CustomerInput } from './schema';
import { createCustomer, updateCustomer } from './actions';
import type { ActionResult } from '@/lib/action';

interface CustomerFormProps {
  defaultValues?: Partial<CustomerInput>;
  customerId?: string;
  onSuccess?: (id: string) => void;
}

export function CustomerForm({
  defaultValues,
  customerId,
  onSuccess,
}: CustomerFormProps) {
  const form = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      company: '',
      address: '',
      notes: '',
      ...defaultValues,
    },
  });
  const [pending, startTransition] = React.useTransition();

  function applyFieldErrors(result: Extract<ActionResult, { ok: false }>) {
    if (result.fieldErrors) {
      for (const [key, messages] of Object.entries(result.fieldErrors)) {
        form.setError(key as keyof CustomerInput, {
          message: messages?.[0],
        });
      }
    }
  }

  function onSubmit(values: CustomerInput) {
    startTransition(async () => {
      const result = customerId
        ? await updateCustomer(customerId, values)
        : await createCustomer(values);
      if (result.ok) {
        toast.success(customerId ? 'Customer updated' : 'Customer created');
        onSuccess?.(result.data.id);
      } else {
        applyFieldErrors(result);
        toast.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input placeholder="+91 98765 43210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company / organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="Anything worth remembering" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending && <Spinner className="text-primary-foreground" />}
            {customerId ? 'Save changes' : 'Create customer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
