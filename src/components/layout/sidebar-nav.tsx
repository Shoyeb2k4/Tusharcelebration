'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { canAccess, type PermissionMap } from '@/lib/rbac';
import { NAV_SECTIONS } from '@/config/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarNavProps {
  permissions: PermissionMap;
  onNavigate?: () => void;
}

/**
 * Role-based navigation. Items the user cannot access are hidden entirely;
 * destinations that belong to a later build phase are shown but marked "Soon".
 */
export function SidebarNav({ permissions, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => canAccess({ permissions }, item.resource)),
  })).filter((section) => section.items.length > 0);

  return (
    <nav className="flex flex-1 flex-col gap-4 px-3 py-4" aria-label="Primary">
      {sections.map((section) => (
        <div key={section.label} className="space-y-1">
          <p className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {section.label}
          </p>
          {section.items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            const soon = item.phase > 1;
            return (
              <Link
                key={item.href}
                href={soon ? '#' : item.href}
                onClick={(e) => {
                  if (soon) e.preventDefault();
                  else onNavigate?.();
                }}
                aria-disabled={soon}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  soon && 'cursor-not-allowed opacity-60 hover:bg-transparent',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {soon && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="text-[10px]">
                        Soon
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Arrives in Phase {item.phase}</TooltipContent>
                  </Tooltip>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
