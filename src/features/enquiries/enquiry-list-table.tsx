import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { formatDate, timeAgo } from '@/lib/dates';
import { StageBadge } from './stage-badge';
import type { EnquiryCard } from './queries';

export function EnquiryListTable({ enquiries }: { enquiries: EnquiryCard[] }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Enquiry</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Event date</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="hidden lg:table-cell">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                <Link href={`/enquiries/${e.id}`} className="block">
                  <span className="font-mono text-xs text-muted-foreground">
                    {e.code}
                  </span>
                  <p className="font-medium">{e.eventType}</p>
                </Link>
              </TableCell>
              <TableCell>
                <p className="font-medium">{e.customer.name}</p>
                <p className="text-xs text-muted-foreground">{e.customer.phone}</p>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {formatDate(e.eventDate)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {e.budget != null ? formatCurrency(e.budget.toString()) : '—'}
              </TableCell>
              <TableCell>
                <StageBadge stage={e.stage} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {timeAgo(e.updatedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
