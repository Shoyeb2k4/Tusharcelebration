'use server';

import { authorize } from '@/lib/auth/guard';
import { listCustomerOptions } from './queries';

export interface CustomerOption {
  id: string;
  name: string;
  phone: string;
}

/** Typeahead search for customer pickers. Org-scoped and permission-gated. */
export async function findCustomers(q: string): Promise<CustomerOption[]> {
  const user = await authorize('read', 'customer');
  return listCustomerOptions(user.orgId, q.trim() || undefined);
}
