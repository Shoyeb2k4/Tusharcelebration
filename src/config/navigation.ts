import {
  LayoutDashboard,
  Users,
  GitBranch,
  CalendarDays,
  FileText,
  Wallet,
  UtensilsCrossed,
  Sparkles,
  BedDouble,
  Truck,
  Package,
  UserCog,
  ListChecks,
  BarChart3,
  FileStack,
  CheckSquare,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type { Resource } from '@/lib/rbac';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Resource this item maps to; hidden if the user lacks access. */
  resource: Resource;
  /** Phase in which the destination becomes live. */
  phase: 1 | 2 | 3 | 4 | 5;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Full navigation. The sidebar filters items by the user's permissions
 * (see `visibleResources`) and marks not-yet-built destinations.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        resource: 'dashboard',
        phase: 1,
      },
    ],
  },
  {
    label: 'Sales',
    items: [
      {
        label: 'Enquiries',
        href: '/enquiries',
        icon: GitBranch,
        resource: 'enquiry',
        phase: 1,
      },
      {
        label: 'Customers',
        href: '/customers',
        icon: Users,
        resource: 'customer',
        phase: 1,
      },
      {
        label: 'Quotations',
        href: '/quotations',
        icon: FileText,
        resource: 'quotation',
        phase: 2,
      },
      {
        label: 'Bookings',
        href: '/bookings',
        icon: CalendarDays,
        resource: 'booking',
        phase: 2,
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        label: 'Finance',
        href: '/finance',
        icon: Wallet,
        resource: 'payment',
        phase: 2,
      },
      {
        label: 'Catering',
        href: '/catering',
        icon: UtensilsCrossed,
        resource: 'catering',
        phase: 3,
      },
      {
        label: 'Decoration',
        href: '/decoration',
        icon: Sparkles,
        resource: 'decoration',
        phase: 3,
      },
      {
        label: 'Guest Rooms',
        href: '/rooms',
        icon: BedDouble,
        resource: 'room',
        phase: 3,
      },
      {
        label: 'Vendors',
        href: '/vendors',
        icon: Truck,
        resource: 'vendor',
        phase: 3,
      },
      {
        label: 'Inventory',
        href: '/inventory',
        icon: Package,
        resource: 'inventory',
        phase: 3,
      },
      {
        label: 'Staff',
        href: '/staff',
        icon: UserCog,
        resource: 'staff',
        phase: 3,
      },
      {
        label: 'Tasks',
        href: '/tasks',
        icon: ListChecks,
        resource: 'task',
        phase: 2,
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        label: 'Reports',
        href: '/reports',
        icon: BarChart3,
        resource: 'report',
        phase: 4,
      },
      {
        label: 'Documents',
        href: '/documents',
        icon: FileStack,
        resource: 'document',
        phase: 4,
      },
      {
        label: 'Approvals',
        href: '/approvals',
        icon: CheckSquare,
        resource: 'approval',
        phase: 2,
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Settings',
        href: '/settings',
        icon: Settings,
        resource: 'settings',
        phase: 4,
      },
    ],
  },
];
