import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { PermissionMap } from '@/lib/rbac';
import { SidebarNav } from './sidebar-nav';

/** Desktop sidebar (hidden on mobile; see MobileNav). */
export function Sidebar({ permissions }: { permissions: PermissionMap }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card lg:flex">
      <Link
        href="/dashboard"
        className="flex h-16 items-center gap-2 border-b px-6"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-display text-lg font-semibold">Tushar</span>
      </Link>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav permissions={permissions} />
      </div>
    </aside>
  );
}
