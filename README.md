# Tushar Celebrations ERP

A production-grade, modular **Venue Management ERP** for premium banquet & event venues — managing the full lifecycle from first customer enquiry to event completion and final settlement. Architected multi-tenant from day one so it can be sold as a SaaS to other banquet halls with minimal customization.

> This is not a booking app. It is an operations backbone: CRM → Quotation → Booking → Event Workspace → Catering/Decoration/Rooms/Inventory/Staff → Finance → Reports.

## Deliverables in this repository

| # | Deliverable | Location |
|---|-------------|----------|
| 1 | Product Requirements Document (PRD) | [`docs/PRD.md`](docs/PRD.md) |
| 2 | Information Architecture | [`docs/INFORMATION_ARCHITECTURE.md`](docs/INFORMATION_ARCHITECTURE.md) |
| 3 | Database Schema | [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) + [`prisma/schema.prisma`](prisma/schema.prisma) |
| 4 | ER Diagram | [`docs/DATABASE_SCHEMA.md#er-diagram`](docs/DATABASE_SCHEMA.md#er-diagram) (Mermaid) |
| 5 | User Flows | [`docs/USER_FLOWS.md`](docs/USER_FLOWS.md) |
| 6 | Wireframes | [`docs/WIREFRAMES.md`](docs/WIREFRAMES.md) |
| 7 | Design System | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) |
| 8 | UI/UX Specification | [`docs/UIUX_SPEC.md`](docs/UIUX_SPEC.md) |
| 9 | API Specification | [`docs/API_SPEC.md`](docs/API_SPEC.md) |
| 10 | Development Roadmap | [`docs/ROADMAP.md`](docs/ROADMAP.md) |
| 11 | Testing Strategy | [`docs/TESTING_STRATEGY.md`](docs/TESTING_STRATEGY.md) |
| 12 | Deployment Strategy | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) |
| 13 | Future Enhancement Roadmap | [`docs/FUTURE_ROADMAP.md`](docs/FUTURE_ROADMAP.md) |
| — | RBAC permission matrix (code) | [`src/lib/rbac/`](src/lib/rbac/) |

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Data layer | PostgreSQL (Supabase) + Prisma ORM |
| Client state | TanStack React Query |
| Validation | Zod (shared client/server contracts) |
| Auth | Supabase Auth (JWT) + row-level security + app-layer RBAC |
| Files/storage | Supabase Storage |
| Realtime | Supabase Realtime channels |
| Background jobs | Supabase Edge Functions + queue (pg-boss) |
| PDF | React-PDF / server-side rendering |
| Messaging | WhatsApp Cloud API |
| Desktop | Tauri (Windows first, macOS later) |
| PWA / offline | Service worker + IndexedDB sync queue |
| Testing | Vitest, React Testing Library, Playwright |

## Multi-tenancy model

Every business-domain row carries an `orgId` (tenant). Isolation is enforced at three layers:
1. **Postgres Row-Level Security** keyed on the JWT `org_id` claim.
2. **Prisma middleware** injecting `orgId` on all queries.
3. **API guard** validating the caller's org before any handler runs.

## Repository layout (target)

```
apps/
  web/            Next.js app (dashboard, all modules, customer portal)
  desktop/        Tauri wrapper
packages/
  db/             Prisma schema, migrations, seed
  ui/             shadcn-based design system components
  rbac/           roles, permissions, policy engine
  contracts/      Zod schemas shared client <-> server
  pdf/            document templates
  jobs/           background workers, WhatsApp, backups
docs/             all specifications (this deliverable)
```

## Status

This commit delivers the **design & architecture foundation** (items 1–13 above) plus the concrete **database schema** as runnable Prisma. Module implementation proceeds against the milestones in [`docs/ROADMAP.md`](docs/ROADMAP.md).
