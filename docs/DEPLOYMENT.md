# Deployment Strategy

## 1. Environments
| Env | Purpose | Data |
|-----|---------|------|
| Local | Dev | Supabase local stack, seeded |
| Preview | Per-PR ephemeral | isolated Supabase branch |
| Staging | Pre-prod QA, migrations rehearsal | anonymized copy |
| Production | Live tenants | real, PITR-protected |

## 2. Topology
- **Web** (`apps/web`): Next.js on Vercel (or Node container on Fly.io/Render). Edge for static/ISR, Node runtime for API route handlers needing Prisma.
- **Database/Auth/Storage/Realtime**: Supabase (managed Postgres). One project per environment; branches for previews.
- **Background jobs**: Supabase Edge Functions + `pg-boss` queue for WhatsApp sends, PDF generation, reminders, backups, AI batch. Scheduled via `pg_cron`.
- **Desktop**: Tauri build (Windows `.msi` first) points at the same hosted API; distributed via signed installer + auto-update feed.

## 3. CI/CD pipeline
```
push / PR
  → lint · typecheck · unit · component · contract
  → spin ephemeral DB → migrate → integration tests
  → build web → deploy Preview → E2E smoke + axe on preview URL
merge to main
  → deploy Staging → run migrations (prisma migrate deploy) → full E2E + load
  → manual approval gate
  → deploy Production (canary) → health checks → promote
```
- **Migrations**: `prisma migrate deploy` runs before app promotion; expand/contract pattern for zero-downtime (add nullable → backfill → enforce → drop). Raw-SQL constraint/RLS migrations included and idempotent.
- **Rollback**: web is immutable deploys (instant revert). DB uses forward-only migrations; destructive changes gated behind two-phase releases; PITR for emergencies.
- **Feature flags** decouple deploy from release; risky modules dark-launched.

## 4. Configuration & secrets
- Env vars per environment; secrets in Vercel/Supabase vault (never in repo).
- Keys: `DATABASE_URL`, Supabase URL/anon/service keys, WhatsApp Cloud API token, AI provider key, storage bucket, JWT signing.
- Distinct service-role vs anon keys; service role only server-side.

## 5. Multi-tenant operations
- Tenant provisioning job: create org, seed system roles, default packages/venues, theme.
- Per-tenant usage metering (events, storage, messages) for SaaS billing.
- Noisy-neighbor protection: per-org rate limits, connection pooling (Supabase pooler / PgBouncer).

## 6. Backups & DR
- **PITR** enabled on prod (continuous WAL).
- Nightly logical `pg_dump` → object storage, 30-day retention, encrypted.
- **Monthly restore drill** into an isolated env; RPO ≤ 5 min, RTO ≤ 1 hr targets documented.
- Storage bucket versioning for uploaded documents/photos.

## 7. Observability
- **Errors**: Sentry (web + edge functions), source maps uploaded per deploy.
- **Logs**: structured JSON, shipped to a log store; request id + orgId + userId correlation.
- **Metrics/APM**: latency (P50/P95), error rate, DB pool saturation, queue depth, WhatsApp delivery rate; dashboards + alerts.
- **Uptime**: external health checks on `/api/health`; SLO 99.9% with alerting to on-call.
- **Audit log** is product data (not just ops) — queryable in-app for compliance.

## 8. Security & compliance
- HTTPS everywhere; HSTS. Data encrypted at rest (Supabase) and in transit.
- RBAC + RLS enforced; least-privilege service accounts.
- Dependency scanning (Dependabot), secret scanning, SAST in CI.
- Signed uploads + content validation; PII handling policy; data export/delete per tenant (privacy).
- Pre-prod pen-test and WCAG AA audit gate the SaaS GA (Phase 6).

## 9. Runbooks
Documented for: failed migration, WhatsApp outage (queue + email fallback), Supabase incident, restore-from-backup, tenant data export/delete, rotating leaked secret, scaling under event-season load.
