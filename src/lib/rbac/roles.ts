/**
 * System role templates.
 *
 * These seed the `Role` table for every new organization. Tenants may clone
 * and customize them; the `key` stays stable for policy lookups.
 * Granularity: each role grants only the actions it needs per resource.
 */

import { ALL, READ, PermissionMap } from './permissions';

export type RoleKey =
  | 'SUPER_ADMIN'
  | 'OWNER'
  | 'GENERAL_MANAGER'
  | 'SALES_EXECUTIVE'
  | 'EVENT_MANAGER'
  | 'ACCOUNTS'
  | 'KITCHEN_MANAGER'
  | 'DECORATION_MANAGER'
  | 'HOUSEKEEPING'
  | 'INVENTORY_MANAGER'
  | 'STORE_MANAGER'
  | 'RECEPTION'
  | 'SECURITY'
  | 'AUDITOR';

export interface RoleTemplate {
  key: RoleKey;
  name: string;
  description: string;
  permissions: PermissionMap;
}

const CU = ['create', 'update'] as const;

export const SYSTEM_ROLES: RoleTemplate[] = [
  {
    key: 'SUPER_ADMIN',
    name: 'Super Admin',
    description: 'Full platform access including org settings and roles.',
    permissions: Object.fromEntries(
      // all resources, all actions
      ([
        'dashboard','enquiry','customer','venue','quotation','booking','event',
        'payment','invoice','expense','catering','decoration','room','inventory',
        'vendor','staff','attendance','task','approval','document','report',
        'message','settings','role','auditLog',
      ] as const).map((r) => [r, ALL]),
    ),
  },
  {
    key: 'OWNER',
    name: 'Owner',
    description: 'Business owner: full operational + financial visibility, approvals.',
    permissions: {
      dashboard: READ, enquiry: ALL, customer: ALL, venue: ALL, quotation: ALL,
      booking: ALL, event: ALL, payment: ALL, invoice: ALL, expense: ALL,
      catering: ALL, decoration: ALL, room: ALL, inventory: ALL, vendor: ALL,
      staff: ALL, attendance: READ, task: ALL, approval: ALL, document: ALL,
      report: ['read', 'export'], message: ALL, settings: ALL, auditLog: READ,
    },
  },
  {
    key: 'GENERAL_MANAGER',
    name: 'General Manager',
    description: 'Runs operations across departments; approves within limits.',
    permissions: {
      dashboard: READ, enquiry: ALL, customer: ALL, venue: ['read', ...CU],
      quotation: ALL, booking: ALL, event: ALL, payment: ['read', 'create'],
      invoice: ['read', 'create'], expense: ['read', ...CU, 'approve'],
      catering: ALL, decoration: ALL, room: ALL, inventory: ['read', ...CU],
      vendor: ALL, staff: ['read', ...CU], attendance: READ, task: ALL,
      approval: ['read', 'approve'], document: ALL, report: ['read', 'export'],
      message: ALL,
    },
  },
  {
    key: 'SALES_EXECUTIVE',
    name: 'Sales Executive',
    description: 'Works leads, builds quotations, closes bookings.',
    permissions: {
      dashboard: READ, enquiry: ALL, customer: ALL, venue: READ,
      quotation: ALL, booking: ['read', 'create', 'update'], event: READ,
      payment: READ, document: ['read', 'create'], message: ['read', 'create'],
      report: READ,
    },
  },
  {
    key: 'EVENT_MANAGER',
    name: 'Event Manager',
    description: 'Runs the Event Workspace, timeline, vendors and staff on the floor.',
    permissions: {
      dashboard: READ, customer: READ, booking: READ, event: ['read', 'update'],
      payment: READ, catering: ['read', 'update'], decoration: ['read', 'update'],
      room: ALL, inventory: ['read', 'update'], vendor: ['read', ...CU],
      staff: READ, attendance: READ, task: ALL, approval: ['read', 'create'],
      document: ['read', 'create'], report: READ, message: ['read', 'create'],
    },
  },
  {
    key: 'ACCOUNTS',
    name: 'Accounts',
    description: 'Payments, invoices, expenses, outstanding, financial reports.',
    permissions: {
      dashboard: READ, customer: READ, booking: READ, event: READ,
      payment: ALL, invoice: ALL, expense: ALL, approval: ['read', 'create'],
      document: ['read', 'create'], report: ['read', 'export'],
      message: ['read', 'create'], vendor: READ,
    },
  },
  {
    key: 'KITCHEN_MANAGER',
    name: 'Kitchen Manager',
    description: 'Catering production sheets, ingredients, kitchen inventory & tasks.',
    permissions: {
      dashboard: READ, event: READ, catering: ['read', 'update'],
      inventory: ['read', 'update'], task: ['read', 'update'],
      document: READ, staff: READ, attendance: READ,
    },
  },
  {
    key: 'DECORATION_MANAGER',
    name: 'Decoration Manager',
    description: 'Decoration packages, materials, setup tasks & inventory.',
    permissions: {
      dashboard: READ, event: READ, decoration: ['read', 'update'],
      inventory: ['read', 'update'], task: ['read', 'update'],
      document: READ, vendor: READ,
    },
  },
  {
    key: 'HOUSEKEEPING',
    name: 'Housekeeping',
    description: 'Room readiness and cleaning tasks.',
    permissions: {
      dashboard: READ, event: READ, room: ['read', 'update'],
      task: ['read', 'update'],
    },
  },
  {
    key: 'INVENTORY_MANAGER',
    name: 'Inventory Manager',
    description: 'Stock levels, reservations, movements, alerts.',
    permissions: {
      dashboard: READ, event: READ, inventory: ALL, task: ['read', 'update'],
      report: READ, vendor: READ,
    },
  },
  {
    key: 'STORE_MANAGER',
    name: 'Store Manager',
    description: 'Issue/return stock, store movements.',
    permissions: {
      dashboard: READ, inventory: ['read', 'update'], task: ['read', 'update'],
    },
  },
  {
    key: 'RECEPTION',
    name: 'Reception',
    description: 'Check-ins, guest flow, front-desk views.',
    permissions: {
      dashboard: READ, event: READ, room: ['read', 'update'], customer: READ,
      task: ['read', 'update'], document: READ,
    },
  },
  {
    key: 'SECURITY',
    name: 'Security',
    description: 'Guest/visitor flow and security tasks.',
    permissions: {
      dashboard: READ, event: READ, task: ['read', 'update'],
    },
  },
  {
    key: 'AUDITOR',
    name: 'Read-only Auditor',
    description: 'Inspect everything, mutate nothing.',
    permissions: Object.fromEntries(
      ([
        'dashboard','enquiry','customer','venue','quotation','booking','event',
        'payment','invoice','expense','catering','decoration','room','inventory',
        'vendor','staff','attendance','task','approval','document','report',
        'message','settings','auditLog',
      ] as const).map((r) => [r, READ]),
    ),
  },
];

export const SYSTEM_ROLE_BY_KEY: Record<RoleKey, RoleTemplate> =
  Object.fromEntries(SYSTEM_ROLES.map((r) => [r.key, r])) as Record<
    RoleKey,
    RoleTemplate
  >;
