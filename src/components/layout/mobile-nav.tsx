'use client';

import * as React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import type { PermissionMap } from '@/lib/rbac';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarNav } from './sidebar-nav';

export function MobileNav({ permissions }: { permissions: PermissionMap }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="flex h-16 flex-row items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <SheetTitle className="font-display">Tushar</SheetTitle>
        </SheetHeader>
        <SidebarNav permissions={permissions} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
