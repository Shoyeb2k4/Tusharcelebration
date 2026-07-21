# Testing Strategy

## 1. Philosophy
Confidence per rupee of effort. Heaviest coverage on the load-bearing, money-touching, and tenant-isolation paths. Test behavior through public contracts, not implementation details.

## 2. Test pyramid

| Layer | Tool | Scope | Target |
|-------|------|-------|--------|
| Unit | Vitest | pure logic: pricing, tax, profitability, BOM explosion, RBAC policy, date/timeline math | fast, many |
| Component | Vitest + React Testing Library | components incl. loading/empty/error states, a11y roles | key components |
| Contract | Vitest + Zod | request/response schemas stay in sync client↔server | all endpoints |
| Integration | Vitest + Testcontainers/Supabase local | API handler + real Postgres: authz, tenancy, audit, constraints | all mutating endpoints |
| E2E | Playwright | critical user journeys across the real app | ~15 flows |
| Non-functional | k6, axe, Lighthouse | load, accessibility, perf budgets | per release |

## 3. Must-cover critical paths (non-negotiable)
1. **Tenant isolation** — a user of org A can never read/write org B (API + RLS). Property-style: for every resource, cross-org access → 403/empty.
2. **Double-booking** — overlapping active bookings for a venue rejected (exclusion constraint) under concurrency.
3. **Money math** — quotation totals (discount, GST), payment → outstanding, profitability = revenue − expenses. Decimal precision, no float drift.
4. **Idempotent payments** — same `Idempotency-Key` never double-records.
5. **RBAC** — each role can only perform permitted actions; Auditor is read-only everywhere.
6. **Catering lock** — locking generates exactly one production sheet + ingredients + prep tasks; is idempotent.
7. **Timeline generation** — confirming a booking creates the correct milestone set + department tasks; rescheduling shifts them.
8. **Approvals** — over-threshold discount/expense cannot take effect without an APPROVED record.

## 4. E2E journeys (Playwright)
- Enquiry → quotation → send → accept → booking → confirm → workspace.
- Record advance → outstanding updates → final payment → invoice → profitability.
- Assign menu → lock → production sheet visible to Kitchen role.
- Assign decoration → reserve inventory → customer approves in portal.
- Allocate rooms → check-in → housekeeping ready.
- Create task → assign → complete checklist → milestone advances.
- Offline: mark attendance offline → reconnect → syncs.
- Permission: Sales role cannot open Reports/Approvals it lacks.

## 5. Test data & environments
- `prisma/seed.ts` deterministic fixtures + factory helpers per entity.
- Integration tests run against ephemeral Postgres (Supabase local / Testcontainers) with migrations applied, including raw-SQL constraints & RLS.
- Each test creates its own org; DB reset/truncate between suites.

## 6. Accessibility & performance gates
- `axe` on every E2E page; violations fail CI.
- Lighthouse CI budget: LCP < 2.5s, TBT < 200ms on key routes.
- k6 load test: dashboard + workspace + tasks under expected concurrency; assert P95 latency budgets from PRD §7.

## 7. CI gates (block merge)
lint · typecheck · unit + component · contract · integration · migration-applies-clean · affected E2E smoke · axe. Full E2E + load nightly and pre-release.

## 8. Quality practices
- Coverage informative, not a vanity gate; **mutation testing (Stryker)** on pricing/RBAC modules to verify assertions bite.
- Seeded RNG for AI-feature tests; AI responses mocked at the service boundary (assert prompt inputs + handling, not model output).
- Flaky tests quarantined and fixed, not retried blindly.
- Every bug fix ships with a regression test.
