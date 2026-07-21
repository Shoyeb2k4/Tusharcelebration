import Link from 'next/link';
import { CalendarDays, Users, Phone, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/dates';
import { SOURCE_LABELS } from './config';
import type { EnquiryCard as EnquiryCardData } from './queries';

export function EnquiryCard({
  enquiry,
  showStage = false,
}: {
  enquiry: EnquiryCardData;
  showStage?: boolean;
}) {
  return (
    <Card className="p-3 transition-shadow hover:shadow-md">
      <Link href={`/enquiries/${enquiry.id}`} className="block space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {enquiry.customer.name}
            </p>
            <p className="text-xs text-muted-foreground">{enquiry.eventType}</p>
          </div>
          {enquiry.budget != null && (
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {formatCurrency(enquiry.budget.toString())}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {enquiry.eventDate && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(enquiry.eventDate)}
            </span>
          )}
          {enquiry.expectedGuests != null && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {enquiry.expectedGuests}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {enquiry.customer.phone}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground">
            {enquiry.code}
          </span>
          <div className="flex items-center gap-1.5">
            {enquiry._count.followUps > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Bell className="h-3 w-3" />
                {enquiry._count.followUps}
              </Badge>
            )}
            {showStage && (
              <Badge variant="outline">{SOURCE_LABELS[enquiry.source]}</Badge>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
