'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { authorize } from '@/lib/auth/guard';
import { audit } from '@/lib/audit';
import {
  type ActionResult,
  ok,
  parseInput,
  toActionError,
} from '@/lib/action';
import { customerSchema } from './schema';

const clean = (v?: string) => (v && v.trim() ? v.trim() : null);

export async function createCustomer(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await authorize('create', 'customer');
    const parsed = parseInput(customerSchema, input);
    if (!parsed.success) return parsed.result;
    const d = parsed.data;

    const customer = await prisma.customer.create({
      data: {
        orgId: user.orgId,
        name: d.name.trim(),
        phone: d.phone.trim(),
        email: clean(d.email),
        company: clean(d.company),
        address: clean(d.address),
        notes: clean(d.notes),
      },
      select: { id: true },
    });

    await audit({
      orgId: user.orgId,
      actorId: user.userId,
      action: 'create',
      resource: 'Customer',
      resourceId: customer.id,
      after: d,
    });

    revalidatePath('/customers');
    return ok({ id: customer.id });
  } catch (err) {
    return toActionError(err);
  }
}

export async function updateCustomer(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await authorize('update', 'customer');
    const parsed = parseInput(customerSchema, input);
    if (!parsed.success) return parsed.result;
    const d = parsed.data;

    // Tenant-scoped guard: never update another org's row.
    const existing = await prisma.customer.findFirst({
      where: { id, orgId: user.orgId },
      select: { id: true },
    });
    if (!existing) return toActionError(new Error('Customer not found'));

    await prisma.customer.update({
      where: { id },
      data: {
        name: d.name.trim(),
        phone: d.phone.trim(),
        email: clean(d.email),
        company: clean(d.company),
        address: clean(d.address),
        notes: clean(d.notes),
      },
    });

    await audit({
      orgId: user.orgId,
      actorId: user.userId,
      action: 'update',
      resource: 'Customer',
      resourceId: id,
      after: d,
    });

    revalidatePath('/customers');
    revalidatePath(`/customers/${id}`);
    return ok({ id });
  } catch (err) {
    return toActionError(err);
  }
}
