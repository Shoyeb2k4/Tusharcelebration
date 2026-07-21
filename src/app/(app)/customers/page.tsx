import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { assertCan } from '@/lib/rbac';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { SearchInput } from '@/components/common/search-input';
import { customerFilterSchema } from '@/features/customers/schema';
import { listCustomers } from '@/features/customers/queries';
import { CustomerTable } from '@/features/customers/customer-table';
import { CustomerDialog } from '@/features/customers/customer-dialog';

export const metadata: Metadata = { title: 'Customers' };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string; cursor?: string };
}) {
  const user = await requireUser();
  assertCan(user, 'read', 'customer');

  const filter = customerFilterSchema.parse({
    q: searchParams.q,
    cursor: searchParams.cursor,
  });
  const { data } = await listCustomers(user.orgId, filter);

  const canCreate = user.permissions.customer?.includes('create');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Everyone who has enquired, booked, or celebrated with us."
        actions={canCreate ? <CustomerDialog redirectOnCreate /> : undefined}
      />

      <div className="flex items-center justify-between gap-3">
        <SearchInput placeholder="Search by name, phone, email…" />
        <p className="text-sm text-muted-foreground">
          {data.length} shown
        </p>
      </div>

      {data.length === 0 ? (
        <EmptyState
          icon={Users}
          title={filter.q ? 'No matching customers' : 'No customers yet'}
          description={
            filter.q
              ? 'Try a different search term.'
              : 'Add your first customer to begin tracking enquiries.'
          }
          action={canCreate && !filter.q ? <CustomerDialog redirectOnCreate /> : undefined}
        />
      ) : (
        <CustomerTable customers={data} />
      )}
    </div>
  );
}
