import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Customer } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { initials } from '@/lib/utils';
import { timeAgo } from '@/lib/dates';

type CustomerRow = Customer & {
  _count: { enquiries: number; bookings: number };
};

export function CustomerTable({ customers }: { customers: CustomerRow[] }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="hidden md:table-cell">Company</TableHead>
            <TableHead className="text-center">Enquiries</TableHead>
            <TableHead className="hidden lg:table-cell">Added</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.id} className="cursor-pointer">
              <TableCell>
                <Link
                  href={`/customers/${c.id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials(c.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    {c.email && (
                      <p className="truncate text-xs text-muted-foreground">
                        {c.email}
                      </p>
                    )}
                  </div>
                </Link>
              </TableCell>
              <TableCell className="tabular-nums">{c.phone}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {c.company ?? '—'}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{c._count.enquiries}</Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {timeAgo(c.createdAt)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/customers/${c.id}`}
                  aria-label={`Open ${c.name}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
