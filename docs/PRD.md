# Tushar Celebrations ERP — Product Requirements Document

**Version:** 1.0 · **Owner:** Product · **Status:** Approved for build

---

## 1. Vision & problem statement

Premium banquet venues run on WhatsApp threads, paper registers, and disconnected spreadsheets. Enquiries fall through the cracks, quotations are inconsistent, kitchen and decoration teams work from stale information, payments go untracked, and owners cannot see profitability per event. Tushar Celebrations ERP replaces this with a single operational system of record covering the complete event lifecycle.

**One-line vision:** *From first enquiry to final settlement, one workspace runs the venue.*

## 2. Goals & non-goals

### Goals
- Capture and convert every enquiry with a measurable sales pipeline.
- Turn a confirmed booking into a single **Event Workspace** that every department drives from.
- Track every rupee: quotation → advance → installments → final → invoice → outstanding, with per-event profitability.
- Automate departmental task generation off a milestone timeline.
- Feed kitchen, decoration, rooms, inventory, and staff from one source of truth.
- Reduce clicks and manual re-entry; surface the right action at the right time.
- Ship as multi-tenant SaaS resellable to other venues.

### Non-goals (v1)
- No restaurant POS for Bonbon (catering operations only — see Module 9).
- No full accounting/GL replacement (export to Tally/Zoho instead).
- No native iOS/Android app in v1 (responsive PWA + manager mobile views instead).
- No payroll processing (attendance + salary records only, export for payroll).

## 3. Personas

| Persona | Primary jobs-to-be-done | Key screens |
|---------|------------------------|-------------|
| **Owner / Super Admin** | See money and occupancy at a glance; approve high-value discounts & expenses | Dashboard, Reports, Approvals |
| **General Manager** | Orchestrate operations across departments; resolve conflicts | Dashboard, Event Workspace, Tasks |
| **Sales Executive** | Work leads, send quotations, close bookings | Enquiry CRM, Quotation, Booking |
| **Event Manager** | Run the event workspace, coordinate timeline & vendors | Event Workspace, Planning, Vendors |
| **Accounts** | Record payments, raise invoices, chase outstanding | Finance, Invoices, Reports |
| **Kitchen Manager** | Execute production sheets, manage ingredients | Catering, Production Sheet, Inventory |
| **Decoration Manager** | Deliver decoration package, manage materials/labour | Decoration, Inventory, Tasks |
| **Housekeeping** | Room readiness, cleaning tasks | Guest Rooms, Tasks |
| **Inventory / Store Manager** | Stock levels, reservations, issue/return | Inventory, Store |
| **Reception / Security** | Check-ins, visitor/guest flow | Rooms, Guest List |
| **Read-only Auditor** | Inspect records without mutating | All read views, Audit Log |

## 4. Design principles

Modern & premium UI · minimal clicks · fast keyboard-driven workflow · enterprise-modular architecture · role-based access · real-time updates · full audit trail on critical actions · automatic backups · responsive (desktop-first, excellent tablet) · dark & light mode.

**Interaction north stars**
- The **Event Workspace** eliminates cross-module hopping — every event action is reachable in ≤2 clicks from it.
- Any list is filterable, sortable, and command-palette searchable (`⌘K`).
- Destructive/financial actions require confirmation and are audited.
- Optimistic UI with React Query; realtime reconciles across users.

## 5. Modules (functional requirements)

Each module below lists its core capabilities. Detailed flows are in [`USER_FLOWS.md`](USER_FLOWS.md); screens in [`WIREFRAMES.md`](WIREFRAMES.md); data in [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md).

### M1 — Executive Dashboard
Configurable, draggable widget grid per user. Widgets: today's events, upcoming events, new enquiries, follow-ups due, pending quotations, pending payments, revenue today/month, outstanding balances, hall occupancy, staff attendance, inventory alerts, tasks due today. Each widget deep-links to its source. Layout persisted per user.

### M2 — Enquiry CRM
Capture: customer + multiple contacts, event type, primary + alternate dates, expected guests, budget, requirements, source, assigned salesperson, notes, attachments. Pipeline: **New → Follow-up → Site Visit → Quotation Sent → Negotiation → Confirmed | Lost**. Follow-up scheduler with reminders. Metrics: conversion rate, response time (first-touch), follow-up history, salesperson leaderboard.

### M3 — Venue Management
Unlimited venues (Main Hall, Lawn, Conference Hall, Dining, Outdoor…). Each: capacity, pricing rules, facilities, photos, layouts, time slots, availability calendar. Hard **double-booking prevention** enforced at DB (exclusion constraint) and API.

### M4 — Booking Management
Convert enquiry → booking. Generate booking number, agreement, terms, advance receipt. States: tentative, confirmed, cancelled, rescheduled — with reason + audit.

### M5 — Event Workspace *(flagship)*
Single control center per booking with tabbed sections: Customer, Booking, Payments, Rooms, Decoration, Kitchen, Menu, Inventory, Tasks, Timeline, Staff, Vendors, Documents, Photos, Internal Notes, Approvals, Checklists. Cross-department realtime; activity feed; no need to leave the page.

### M6 — Event Planning
Auto-generated milestone timeline: 90 / 60 / 30 / 15 / 7 / 3 / 1 days before → Event Day → Post-Event. Each milestone spawns department-assigned tasks from templates. Schedule shifts if event date changes.

### M7 — Quotation System
Packages + custom line items, discounts, taxes (GST), optional add-on services. Versioned quotations. Branded PDF export. One-click send via WhatsApp/email. Accept → seed booking.

### M8 — Finance
Ledger: quotation → advance → installments → final → invoice → receipt → outstanding. Expense categories: decoration, food, photography, generator, electricity, flowers, cleaning, misc. Automatic **per-event profitability** (revenue − allocated expenses). Payment schedules with reminders.

### M9 — Catering (Bonbon) — Operations, not POS
Menu packages + custom menu, per-plate pricing, guest count. Auto-generated **kitchen production sheet**, preparation schedule, food cost, ingredient requirement (BOM explosion), live counters, sweet counters. Kitchen receives sheets automatically on confirmation/menu-lock.

### M10 — Decoration
Packages: Basic / Traditional / Premium / Luxury / Royal. Each stores images, materials (BOM), estimated cost, labour, setup time, required inventory. Assigning a package reserves inventory and creates setup tasks.

### M11 — Guest Rooms
Rooms allocated per event: bride/groom side, VIP, complimentary, paid. Check-in/out, housekeeping status, room status board.

### M12 — Vendor Management
Vendor directory (decorators, photographers, bands, DJ, florists, transport, generator, security). Store contracts, rates, payments, past jobs, ratings, documents, availability. Purchase orders link to events and finance.

### M13 — Inventory
Assets/consumables across furniture, stage, decor material, lighting, sound, crockery, kitchen equipment, flowers, generators, cleaning supplies. Statuses: available, reserved, in-use, damaged, maintenance, lost. Reservations tie to events. Low-stock alerts.

### M14 — Staff Management
Attendance, departments, salary records, leaves, tasks, performance, shift planning, documents, ID cards. Feeds dashboard attendance widget.

### M15 — Task Management
Tasks auto-routed to departments (kitchen, decoration, accounts, housekeeping, security, maintenance). Each: priority, due date, checklist, attachments, comments, completion status. Kanban + list + calendar views.

### M16 — Customer Portal
Customer self-service: view booking, track payments, download invoices/receipts, view timeline, select menu, approve decoration, upload guest list, view room allocation, message management. Scoped, tokenized access.

### M17 — WhatsApp Automation
Templated sends: quotation, booking confirmation, payment reminder, upcoming-event reminder, invoice, receipt, feedback request, thank-you. Triggered by lifecycle events; delivery status tracked.

### M18 — Reports
Revenue, expenses, profit, bookings, lead conversion, cancellation rate, vendor payments, staff performance, occupancy, taxes, monthly/yearly, profit-per-event. Filter by date/venue/salesperson; export CSV/PDF.

### M19 — Documents
PDF generation: quotation, agreement, invoice, receipt, kitchen production sheet, vendor PO, task sheet, guest list, room allocation, decoration checklist, event completion report. Versioned, stored, re-downloadable.

### M20 — Manager Mobile (PWA)
Approve bookings/expenses, view events, notifications, complete tasks, upload event photos, track progress. Responsive PWA now; Tauri/native later.

## 6. AI features
- **AI Quotation Generator** — draft a quote from enquiry attributes + historical wins.
- **AI Event Timeline Generator** — tailor the milestone plan to event type/size.
- **AI Budget Estimator** & **AI Cost Optimization** — estimate and trim event cost.
- **AI Menu Recommendation** — suggest menu given cuisine, budget, headcount.
- **AI Resource Planner** — staff/inventory allocation across concurrent events.
- **AI Follow-up Assistant** — draft next-best follow-up messages.
- **AI Profit Prediction** — forecast margin at quote time.
- **AI Risk Detection** — flag resource conflicts, overdue tasks, payment risk.

All AI features are **assistive** (human-in-the-loop): they draft/suggest, a user confirms. Model calls go through a server-side `ai` service with per-org guardrails and cost caps.

## 7. Non-functional requirements

| Attribute | Target |
|-----------|--------|
| Availability | 99.9% |
| P95 API latency | < 400 ms (reads), < 800 ms (writes) |
| First contentful paint | < 1.5 s on venue office broadband |
| Offline | Critical read + queued writes for tasks, attendance, room status |
| Security | RBAC + RLS, encrypted at rest & in transit, audit log |
| Backups | Automated daily PITR + weekly logical dump, 30-day retention |
| Accessibility | WCAG 2.1 AA |
| Localization | i18n-ready; INR + GST first; multi-currency later |
| Scale | 100+ tenants, 10k events/tenant/yr |

## 8. Success metrics
- Lead → booking conversion rate ↑; first-response time ↓.
- % events with complete production sheet before T-3 days.
- Outstanding balance aging ↓.
- Owner uses profit-per-event report weekly.
- ≥ 80% of daily operations happen inside the Event Workspace (click-path analytics).

## 9. Assumptions, constraints, dependencies
- WhatsApp Cloud API approved sender + template approval required for M17.
- Supabase project per environment (dev/staging/prod).
- GST rules per Indian tax regime; configurable per org.
- Payment gateway integration (Razorpay) is v1.1, not v1 (record manual payments in v1).

## 10. Risks
| Risk | Mitigation |
|------|------------|
| Scope is very large | Strict milestone slicing (see ROADMAP); Event Workspace + Finance are the load-bearing MVP |
| WhatsApp template approval delays | Ship email fallback; queue messages |
| Double-booking edge cases | DB exclusion constraint as source of truth, not just app checks |
| Multi-tenant data leakage | RLS + Prisma middleware + API guard (defense in depth), tenancy tests |
| AI hallucination in quotes | Human confirmation mandatory; show provenance |
