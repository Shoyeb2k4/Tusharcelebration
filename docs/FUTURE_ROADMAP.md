# Future Enhancement Roadmap

Post-v1 direction. Sequenced by value-to-effort; all inherit the multi-tenant, RBAC, audit foundation.

## 1. On-site & guest experience
- **QR guest check-in** — per-guest QR from the uploaded guest list; reception scans; live headcount vs catering.
- **Face-recognition attendance** — staff attendance via kiosk; privacy-gated, opt-in, on-device matching where possible.
- **Visitor management** — gate register, badges, host notifications.
- **CCTV integration** — surface camera feeds/events in the workspace (read-only embeds).
- **Digital signage** — event/day boards driven from bookings (hall, welcome screens).
- **Digital invitations** — generate + send e-invites, RSVP flows feeding guest list.

## 2. Commercial & growth
- **Online booking portal** — public availability + enquiry/hold capture feeding CRM.
- **Payment gateway** (Razorpay/Stripe) — online advances/installments, auto-reconciliation, receipts.
- **Customer loyalty** — repeat-client tiers, referral tracking, offers.
- **Reviews & feedback loop** — post-event NPS feeding vendor/staff ratings and reports.

## 3. Scale & SaaS
- **Multi-branch management** — one org, many venues/branches with consolidated + per-branch reporting.
- **Franchise support** — brand-level templates, roll-ups, franchisee isolation.
- **Advanced analytics dashboard** — cohort/seasonality, price-elasticity, capacity optimization.
- **API & integrations** — public API + webhooks; Tally/Zoho Books accounting export; Google/Outlook calendar sync; SMS providers.
- **Marketplace** — vetted vendor marketplace across tenants.

## 4. Intelligence (deepen AI)
- Demand forecasting & dynamic pricing suggestions by season/date.
- Automated resource conflict resolution proposals across concurrent events.
- Churn/at-risk lead scoring; next-best-action for sales.
- Vendor performance prediction; procurement optimization.
- Natural-language reporting ("show profit for June weddings").

## 5. Platform
- **Native mobile apps** (React Native) sharing contracts/design tokens.
- **macOS Tauri** build; auto-update channels.
- Offline expansion beyond critical flows; robust conflict resolution (CRDT for notes/checklists).
- Data warehouse export (BigQuery/Snowflake) for tenant analytics at scale.

## Sequencing principle
Ship what closes the operational loop and drives revenue first (online booking + payments + multi-branch), then experiential (QR/invites/signage), then deeper AI and platform breadth. Each item is a vertical slice with its own DoD, flags, and tenancy tests.
