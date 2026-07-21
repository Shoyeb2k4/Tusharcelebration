# Development Roadmap

Sequenced to deliver a usable core early, then broaden. The **load-bearing MVP is Event Workspace + Finance + Bookings** — everything else attaches to it.

## Guiding rules
- Ship vertical slices (DB → API → UI → tests) per module, not horizontal layers.
- Each milestone ends with a demoable, tested increment behind feature flags.
- Multi-tenancy, RBAC, and audit are built in Phase 0 — never retrofitted.

## Phase 0 — Foundation (Weeks 1–3)
**Goal:** skeleton that everything plugs into.
- Monorepo (`apps/web`, `packages/{db,ui,rbac,contracts}`).
- Next.js + TS + Tailwind + shadcn/ui setup; design tokens; light/dark.
- Supabase project; Prisma schema (this repo) → migrations; **RLS** + exclusion constraint; seed.
- Auth (Supabase) + session; **RBAC policy engine** + permission matrix; API guard + Prisma tenancy middleware.
- Audit log + notification plumbing; command palette shell; app layout & nav.
- CI (lint, typecheck, unit, migrate check).
**Exit:** log in as any role, see permission-filtered nav, tenant isolation proven by tests.

## Phase 1 — Sales spine (Weeks 4–7)
- **M2 Enquiry CRM**: capture, pipeline board, follow-ups, metrics.
- **M3 Venues** + availability calendar.
- **M7 Quotation** builder + versioning + PDF + send.
- **M4 Bookings**: convert, confirm (double-booking guard), agreement/advance receipt.
**Exit:** enquiry → quotation → confirmed booking end-to-end.

## Phase 2 — Event Workspace + Finance (Weeks 8–12) ← core value
- **M5 Event Workspace** shell + Overview + Customer/Booking tabs + activity feed + realtime.
- **M8 Finance**: payments, receipts, invoices, outstanding, expenses, profitability.
- **M6 Event Planning**: milestone timeline generation + department tasks.
- **M15 Task Management**: board/list/calendar, checklists, comments.
- **M1 Dashboard** v1 (core widgets).
- **Approvals** for discounts/expenses.
**Exit:** a confirmed booking is fully operable from one workspace; money tracked; owner sees profit per event.

## Phase 3 — Operations departments (Weeks 13–18)
- **M9 Catering**: menu, lock, production sheet, ingredients, prep schedule.
- **M10 Decoration**: packages, materials, inventory reservation, customer approval.
- **M13 Inventory**: items, reservations, movements, low-stock alerts.
- **M11 Guest Rooms**: allocation board, check-in/out, housekeeping.
- **M14 Staff**: attendance (offline), shifts, leaves, assignments.
- **M12 Vendors**: directory, engagements, POs, ratings.
**Exit:** kitchen/decoration/rooms/inventory/staff/vendors all drive from the workspace.

## Phase 4 — Documents, Reports, Portal, Messaging (Weeks 19–23)
- **M19 Documents**: full PDF suite.
- **M18 Reports**: revenue/expense/profit/conversion/occupancy/etc. + export.
- **M16 Customer Portal**: tokenized self-service.
- **M17 WhatsApp Automation**: templates + delivery tracking + email fallback.
**Exit:** customer-facing loop closed; owners have reporting; comms automated.

## Phase 5 — AI, PWA/offline, Desktop (Weeks 24–29)
- **AI features**: quotation, timeline, budget/optimization, menu, risk, profit — human-in-the-loop.
- **M20 / PWA**: offline for tasks/attendance/rooms; manager mobile views; push.
- **Tauri** Windows build; automated backups verified; restore drill.
**Exit:** AI assists live; offline-critical flows work; installable desktop app.

## Phase 6 — SaaS hardening (Weeks 30–34)
- Tenant onboarding/self-serve provisioning; per-tenant theming; plan/limits.
- Performance passes (virtualization, caching, query budgets); load testing.
- Security review, pen-test, WCAG AA audit; docs & runbooks.
- Payment gateway (Razorpay) for online collection.
**Exit:** onboard a second venue with config only; production SLOs met.

## Team & cadence (suggested)
- 2 FE, 2 FS, 1 designer, 1 PM/QA. Two-week sprints, milestone demos, feature flags for safe rollout.

## Definition of done (per module)
Schema + migration · Zod contracts · API + authz + audit · UI (all states) · unit + integration + one E2E happy path · a11y pass · docs updated.
