import type { Metadata } from 'next';
import Link from 'next/link';
import {
  GitBranch,
  Users,
  TrendingUp,
  Bell,
  CalendarClock,
  ArrowRight,
} from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { assertCan } from '@/lib/rbac';
import { PageHeader } from '@/components/common/page-header';
import { StatTile } from '@/components/common/stat-tile';
import { EmptyState } from '@/components/common/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDashboardData } from '@/features/dashboard/queries';
import { STAGE_META } from '@/features/enquiries/config';
import { formatDateTime, isOverdue, timeAgo } from '@/lib/dates';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const user = await requireUser();
  assertCan(user, 'read', 'dashboard');

  const data = await getDashboardData(user.orgId);
  const conversionPct = Math.round(data.metrics.conversionRate * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user.fullName.split(' ')[0]}`}
        description="Here’s what’s happening across the venue today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="New enquiries"
          value={data.newEnquiries}
          icon={GitBranch}
        />
        <StatTile
          label="Total customers"
          value={data.customerCount}
          icon={Users}
        />
        <StatTile
          label="Conversion rate"
          value={`${conversionPct}%`}
          icon={TrendingUp}
          accent="success"
          hint="Confirmed vs closed"
        />
        <StatTile
          label="Follow-ups due"
          value={data.followUpsDue.length}
          icon={Bell}
          accent={data.followUpsDue.length > 0 ? 'warning' : 'default'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Follow-ups due</CardTitle>
            <Link
              href="/enquiries"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Pipeline <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.followUpsDue.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="All caught up"
                description="No follow-ups due today."
              />
            ) : (
              <ul className="divide-y">
                {data.followUpsDue.map((f) => (
                  <li key={f.id} className="py-2.5">
                    <Link
                      href={`/enquiries/${f.enquiry.id}`}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {f.enquiry.customer.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground capitalize">
                          {f.channel} · {f.enquiry.eventType}
                        </p>
                      </div>
                      <Badge variant={isOverdue(f.dueAt) ? 'destructive' : 'secondary'}>
                        {formatDateTime(f.dueAt)}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent enquiries</CardTitle>
            <Link
              href="/enquiries"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.recentEnquiries.length === 0 ? (
              <EmptyState
                icon={GitBranch}
                title="No enquiries yet"
                description="New leads will show up here."
              />
            ) : (
              <ul className="divide-y">
                {data.recentEnquiries.map((e) => (
                  <li key={e.id} className="py-2.5">
                    <Link
                      href={`/enquiries/${e.id}`}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {e.customer.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {e.eventType} · {timeAgo(e.createdAt)}
                        </p>
                      </div>
                      <Badge variant={STAGE_META[e.stage].variant}>
                        {STAGE_META[e.stage].label}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
