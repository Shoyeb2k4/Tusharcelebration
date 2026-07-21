# Phase 1 — Foundation + Sales CRM

Status: **complete, typechecked, tested, production-build verified.**

This phase delivers the production-ready application scaffold and the first
vertical slice: authentication, the app shell with role-based navigation, and
a full Customer/Enquiry CRM (lead pipeline, follow-ups, notes, attachments,
activity timeline, search & filters).

## What shipped

| # | Feature | Where |
|---|---------|-------|
| 1 | Authentication (Supabase, email/password, session, sign-out) | `features/auth`, `lib/supabase`, `middleware.ts` |
| 2 | Dashboard shell (KPIs, follow-ups due, recent enquiries) | `app/(app)/dashboard`, `features/dashboard` |
| 3 | Sidebar navigation (sections, active state, mobile sheet) | `components/layout` |
| 4 | Role-based navigation (filtered by RBAC permissions) | `sidebar-nav.tsx` + `lib/rbac` |
| 5 | Customer CRM (list, create, edit, detail) | `features/customers`, `app/(app)/customers` |
| 6 | Lead pipeline (kanban board + list view + stage machine) | `features/enquiries` |
| 7 | Customer details (contact, enquiries, notes tabs) | `app/(app)/customers/[id]` |
| 8 | Follow-up system (schedule, complete, overdue flags) | `features/follow-ups` |
| 9 | Search & filters (URL-synced search, source filter, view toggle) | `components/common/search-input`, `enquiry-filters` |
| 10 | Notes (multi-entry stream on customer & enquiry) | `features/notes`, `Note` model |
| 11 | Attachments (link/caption, list) | `features/attachments` |
| 12 | Activity timeline (merged, reverse-chronological) | `features/activity` |

Cross-cutting foundation: TypeScript strict mode, Tailwind + shadcn/ui design
system, dark/light mode, React Query provider, React Hook Form + Zod on every
form, toast notifications (sonner), error boundaries (`error.tsx` + component
boundary), loading skeletons, and a reusable component architecture under a
feature-based folder structure.

## Architecture

```
src/
  app/
    (auth)/login          public login route
    (app)/                protected shell (layout enforces auth)
      dashboard/ customers/ enquiries/
    auth/callback         OAuth/magic-link exchange
    api/health            liveness probe
  components/
    ui/                   shadcn-style primitives (Radix based)
    layout/               sidebar, header, mobile nav, user menu
    common/               page header, empty state, stat tile, search, spinner…
    providers/            theme + react-query + tooltip + toaster
  features/               feature-based vertical slices
    auth/ customers/ enquiries/ follow-ups/ notes/ attachments/
    activity/ dashboard/
  lib/
    rbac/                 permission engine (Phase 0)
    supabase/             server / client / middleware clients
    auth/                 session (getSessionUser) + guard (authorize)
    prisma.ts audit.ts action.ts codes.ts utils.ts dates.ts
  config/navigation.ts    nav model mapped to RBAC resources
  middleware.ts           session refresh + route protection
```

### Authorization — defense in depth
1. **Route protection** — `middleware.ts` redirects unauthenticated users.
2. **Session principal** — `getSessionUser()` joins the Supabase user to the
   app `User` + `Role`, exposing the permission map.
3. **Server actions** — every mutation calls `authorize(action, resource)`
   (throws `ForbiddenError` → friendly result) before doing work.
4. **Tenant scoping** — every query/mutation is filtered by `orgId`; parent
   records are re-checked against the caller's org before writes.
5. **UI gating** — nav and action buttons render only when the permission map
   allows, using the same `can()`/`canAccess()` engine.
6. **RLS** — the SQL migration enables Row-Level Security as the final guard.

### Data-flow pattern
- **Reads**: Server Components call typed query functions (`features/*/queries.ts`,
  `server-only`) that take `orgId`.
- **Writes**: Server Actions (`features/*/actions.ts`) → `authorize` → Zod parse
  (`parseInput`) → Prisma → `audit()` → `revalidatePath`. They return a
  discriminated `ActionResult` the client maps to toasts / field errors.
- **Interactivity**: Client Components (forms, pipeline controls) use
  `useTransition` + server actions; React Query is wired for future client
  fetching (e.g. the customer typeahead uses a server action directly).

### Schema note — `Note` model
Phase 1 added one model, `Note` (documented in `schema.prisma`), to support a
multi-entry, timestamped note stream on customers and enquiries. The existing
single `notes` text fields on `Customer`/`Enquiry` remain for the primary blurb;
`Note` powers the Notes tab and feeds the activity timeline. This is the only
schema addition — everything else uses the Phase-0 schema as-is.

## Running locally

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env        # fill DATABASE_URL, DIRECT_URL, Supabase keys

# 3. Database
npm run db:deploy           # apply migrations (schema + RLS + constraints)
npm run db:seed             # demo org, roles, sample CRM data

# 4. Link the seed admin to a Supabase Auth user
#    Create a user in Supabase Auth with the seed email, then set its UUID:
#    SEED_AUTH_USER_ID=<uuid> npm run db:seed

# 5. Dev
npm run dev                 # http://localhost:3000
```

## Quality gates (all green)

```bash
npm run typecheck   # tsc --noEmit  → 0 errors
npm run test        # vitest        → 29 passing
npm run build       # next build    → 9 routes compiled
```

### Tests
- `lib/rbac/policy.test.ts` — role permissions, nav filtering, deny paths.
- `features/enquiries/config.test.ts` — pipeline state machine (incl. terminal
  CONFIRMED, LOST reachability, no-op guard).
- `features/activity/timeline.test.ts` — timeline merge + ordering.
- `features/customers/schema.test.ts`, `features/enquiries/schema.test.ts` —
  Zod validation & coercion.
- `features/enquiries/stage-badge.test.tsx` — component render (jsdom).

## Deliberately deferred (Phase 2+)
- Binary file upload via Supabase Storage signed URLs (Phase 1 links by URL;
  the action shape is ready).
- Booking conversion on `CONFIRMED` (Phase 2 — Bookings module).
- Realtime activity feed via Supabase channels (server-render + revalidate now).
- Full `⌘K` command palette across entities (basic global search now).
- Drag-and-drop between pipeline columns (stage moves via the accessible stage
  menu now).

## Definition of done — met
Schema + migration · Zod contracts · API/actions + authz + audit · UI with
loading/empty/error states · unit + component tests · typecheck + build clean · docs.
