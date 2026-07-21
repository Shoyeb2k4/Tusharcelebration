import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, CalendarDays, Users, Wallet, Tag } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { assertCan } from '@/lib/rbac';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/dates';
import { getEnquiry } from '@/features/enquiries/queries';
import { StageChanger } from '@/features/enquiries/stage-changer';
import { SOURCE_LABELS } from '@/features/enquiries/config';
import { FollowUpsPanel } from '@/features/follow-ups/follow-ups-panel';
import { NotesPanel } from '@/features/notes/notes-panel';
import { AttachmentsPanel } from '@/features/attachments/attachments-panel';
import { ActivityFeed } from '@/features/activity/activity-feed';
import { buildEnquiryTimeline } from '@/features/activity/timeline';

export const metadata: Metadata = { title: 'Enquiry' };

export default async function EnquiryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  assertCan(user, 'read', 'enquiry');

  const enquiry = await getEnquiry(user.orgId, params.id);
  if (!enquiry) notFound();

  const canWrite = !!user.permissions.enquiry?.includes('update');
  const timeline = buildEnquiryTimeline(enquiry);

  const facts = [
    { icon: Tag, label: 'Event type', value: enquiry.eventType },
    { icon: CalendarDays, label: 'Event date', value: formatDate(enquiry.eventDate) },
    {
      icon: Users,
      label: 'Guests',
      value: enquiry.expectedGuests?.toString() ?? '—',
    },
    {
      icon: Wallet,
      label: 'Budget',
      value: enquiry.budget != null ? formatCurrency(enquiry.budget.toString()) : '—',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
          <Link href="/enquiries">
            <ArrowLeft className="h-4 w-4" />
            Back to pipeline
          </Link>
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-semibold">
                {enquiry.customer.name}
              </h1>
              <Badge variant="outline">{SOURCE_LABELS[enquiry.source]}</Badge>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {enquiry.code} · {enquiry.eventType}
            </p>
          </div>
          <StageChanger
            enquiryId={enquiry.id}
            stage={enquiry.stage}
            canWrite={canWrite}
          />
        </div>
      </div>

      {enquiry.stage === 'LOST' && enquiry.lostReason && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-3 text-sm">
            <span className="font-medium text-destructive">Lost: </span>
            {enquiry.lostReason}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <Card key={f.label}>
            <CardContent className="flex items-center gap-3 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <f.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="font-medium">{f.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="followups">
            <TabsList className="flex-wrap">
              <TabsTrigger value="followups">
                Follow-ups
                {enquiry.followUps.filter((f) => !f.completedAt).length > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 text-xs">
                    {enquiry.followUps.filter((f) => !f.completedAt).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="followups">
              <FollowUpsPanel
                enquiryId={enquiry.id}
                followUps={enquiry.followUps}
                canWrite={canWrite}
              />
            </TabsContent>
            <TabsContent value="notes">
              <NotesPanel
                enquiryId={enquiry.id}
                notes={enquiry.crmNotes}
                canWrite={canWrite}
              />
            </TabsContent>
            <TabsContent value="attachments">
              <AttachmentsPanel
                enquiryId={enquiry.id}
                attachments={enquiry.attachments}
                canWrite={canWrite}
              />
            </TabsContent>
            <TabsContent value="activity">
              <ActivityFeed items={timeline} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Link
                href={`/customers/${enquiry.customer.id}`}
                className="font-medium text-primary hover:underline"
              >
                {enquiry.customer.name}
              </Link>
              <p className="text-muted-foreground">{enquiry.customer.phone}</p>
              {enquiry.customer.email && (
                <p className="text-muted-foreground">{enquiry.customer.email}</p>
              )}
              {enquiry.owner && (
                <p className="pt-2 text-xs text-muted-foreground">
                  Owner: {enquiry.owner.fullName}
                </p>
              )}
            </CardContent>
          </Card>

          {enquiry.requirements && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {enquiry.requirements}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
