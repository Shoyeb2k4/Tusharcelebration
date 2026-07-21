import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Mail, Phone, Building2, MapPin, Pencil } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { assertCan } from '@/lib/rbac';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common/empty-state';
import { initials } from '@/lib/utils';
import { formatDate } from '@/lib/dates';
import { getCustomer } from '@/features/customers/queries';
import { CustomerDialog } from '@/features/customers/customer-dialog';
import { EnquiryDialog } from '@/features/enquiries/enquiry-dialog';
import { StageBadge } from '@/features/enquiries/stage-badge';
import { NotesPanel } from '@/features/notes/notes-panel';

export const metadata: Metadata = { title: 'Customer' };

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  assertCan(user, 'read', 'customer');

  const customer = await getCustomer(user.orgId, params.id);
  if (!customer) notFound();

  const canEdit = !!user.permissions.customer?.includes('update');
  const canNote = canEdit;
  const canCreateEnquiry = !!user.permissions.enquiry?.includes('create');

  const contactRows = [
    { icon: Phone, value: customer.phone },
    { icon: Mail, value: customer.email },
    { icon: Building2, value: customer.company },
    { icon: MapPin, value: customer.address },
  ].filter((r) => r.value);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4" />
            Back to customers
          </Link>
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-base">
                {initials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-2xl font-semibold">
                {customer.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {customer._count.enquiries} enquiries ·{' '}
                {customer._count.bookings} bookings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canCreateEnquiry && <EnquiryDialog fixedCustomerId={customer.id} />}
            {canEdit && (
              <CustomerDialog
                customerId={customer.id}
                defaultValues={{
                  name: customer.name,
                  phone: customer.phone,
                  email: customer.email ?? '',
                  company: customer.company ?? '',
                  address: customer.address ?? '',
                  notes: customer.notes ?? '',
                }}
                trigger={
                  <Button variant="outline">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contact details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {contactRows.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <r.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{r.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="enquiries">
            <TabsList>
              <TabsTrigger value="enquiries">
                Enquiries ({customer._count.enquiries})
              </TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="enquiries" className="space-y-2">
              {customer.enquiries.length === 0 ? (
                <EmptyState
                  title="No enquiries yet"
                  description="Create an enquiry to start the pipeline for this customer."
                  action={
                    canCreateEnquiry ? (
                      <EnquiryDialog fixedCustomerId={customer.id} />
                    ) : undefined
                  }
                />
              ) : (
                customer.enquiries.map((e) => (
                  <Link
                    key={e.id}
                    href={`/enquiries/${e.id}`}
                    className="flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-muted/40"
                  >
                    <div>
                      <p className="font-medium">{e.eventType}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {e.code} · {formatDate(e.eventDate)}
                      </p>
                    </div>
                    <StageBadge stage={e.stage} />
                  </Link>
                ))
              )}
            </TabsContent>

            <TabsContent value="notes">
              <NotesPanel
                customerId={customer.id}
                notes={customer.crmNotes}
                canWrite={canNote}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
