# API Specification

## 1. Conventions
- **Transport**: REST-ish JSON over HTTPS via Next.js Route Handlers (`app/api/*`), plus typed server actions for form mutations. Optionally exposed as tRPC for end-to-end types; contracts below are transport-agnostic.
- **Auth**: Supabase JWT (Bearer). Every request resolves `{ userId, orgId, roleKey }`. Missing/invalid → `401`.
- **Tenancy**: `orgId` derived from the token, never the client. Handlers never accept `orgId` from the body.
- **Validation**: every input parsed with a Zod schema from `packages/contracts`. Failure → `422` with field errors.
- **Authorization**: policy check `can(role, action, resource)` before handler logic. Deny → `403`.
- **Idempotency**: financial POSTs accept `Idempotency-Key` header.
- **Pagination**: cursor-based `?cursor=&limit=` (default 25, max 100). Responses: `{ data, nextCursor }`.
- **Errors**: `{ error: { code, message, fields? } }` with proper HTTP status.
- **Audit**: mutating endpoints write `AuditLog` (actor, before/after).

## 2. Standard response envelope
```jsonc
// success
{ "data": { /* resource or list */ }, "nextCursor": "opt" }
// error
{ "error": { "code": "FORBIDDEN", "message": "…", "fields": { "amount": "required" } } }
```

## 3. Resource endpoints (representative)

### Auth & session
```
POST   /api/auth/callback           Supabase auth exchange
GET    /api/me                      current user, role, permissions, org
```

### Enquiries (CRM)
```
GET    /api/enquiries?stage=&owner=&cursor=
POST   /api/enquiries               create enquiry (+customer inline)
GET    /api/enquiries/:id
PATCH  /api/enquiries/:id           update fields
POST   /api/enquiries/:id/stage     { toStage, note }  -> writes PipelineEvent
POST   /api/enquiries/:id/followups { dueAt, channel, note }
PATCH  /api/followups/:id           complete { outcome }
GET    /api/enquiries/metrics       conversion, response time, leaderboard
```

### Venues & availability
```
GET    /api/venues
POST   /api/venues
GET    /api/venues/:id/availability?from=&to=
```

### Quotations
```
GET    /api/quotations?status=
POST   /api/quotations              from enquiry
POST   /api/quotations/:id/version  new version (copies lines)
PATCH  /api/quotations/:id          edit lines/discount/tax
POST   /api/quotations/:id/ai-draft AI-suggested draft (returns lines, not persisted)
POST   /api/quotations/:id/send     { channel }  -> MessageLog + PDF
POST   /api/quotations/:id/accept   -> seeds Booking
GET    /api/quotations/:id/pdf
```

### Bookings
```
GET    /api/bookings?status=
POST   /api/bookings                { quotationId, venueId, slot } (409 on overlap)
POST   /api/bookings/:id/confirm    -> creates Event + timeline + tasks
POST   /api/bookings/:id/cancel     { reason }
POST   /api/bookings/:id/reschedule { startAt, endAt }
```

### Event Workspace (aggregate)
```
GET    /api/events/:id              workspace summary (financials, progress, risks)
GET    /api/events/:id/:section     payments|rooms|kitchen|menu|decoration|
                                    inventory|tasks|timeline|staff|vendors|
                                    documents|photos|notes|approvals|checklists
POST   /api/events/:id/notes        internal note
GET    /api/events/:id/activity     realtime feed (also via Supabase channel)
```

### Finance
```
GET    /api/events/:id/payments
POST   /api/events/:id/payments     { type, method, amount, ref }  (Idempotency-Key)
POST   /api/events/:id/invoices     issue invoice
GET    /api/finance/outstanding?aging=
POST   /api/events/:id/expenses     { category, amount, vendorId? }
GET    /api/events/:id/profitability
```

### Catering
```
GET    /api/events/:id/catering
PATCH  /api/events/:id/catering     menu items, guest count, per-plate
POST   /api/events/:id/catering/lock  -> production sheet + ingredients + tasks
GET    /api/events/:id/catering/production-sheet   (pdf)
```

### Decoration
```
GET    /api/events/:id/decoration
POST   /api/events/:id/decoration/assign  { packageId | tier }  -> reserves inventory
POST   /api/events/:id/decoration/approve  (customer)
```

### Rooms
```
GET    /api/events/:id/rooms
POST   /api/events/:id/rooms        allocate
PATCH  /api/rooms/:id               checkin/checkout/housekeeping/status
```

### Inventory
```
GET    /api/inventory?category=&status=
POST   /api/inventory               create item
POST   /api/inventory/:id/movements { type, quantity, reason }
POST   /api/events/:id/inventory/reserve { itemId, quantity, from, to }
GET    /api/inventory/alerts        low-stock
```

### Vendors
```
GET    /api/vendors?category=
POST   /api/vendors
POST   /api/events/:id/vendors      engage { vendorId, service, rate }
POST   /api/vendor-engagements/:id/po  purchase order
```

### Staff
```
GET    /api/staff?department=
POST   /api/staff/:id/attendance    { date, checkIn }   (offline-syncable)
GET    /api/staff/attendance?date=
POST   /api/staff/:id/leaves
PATCH  /api/leaves/:id               approve/reject
POST   /api/events/:id/staff         assign
```

### Tasks
```
GET    /api/tasks?department=&assignee=&status=&eventId=
POST   /api/tasks
PATCH  /api/tasks/:id                status/assignee/priority/due
POST   /api/tasks/:id/checklist
POST   /api/tasks/:id/comments
```

### Approvals
```
GET    /api/approvals?status=pending
POST   /api/approvals                request { type, refId, amount }
POST   /api/approvals/:id/decide     { decision, note }  -> applies effect
```

### Documents & reports
```
POST   /api/documents/:type/generate { eventId }   -> PDF (see Module 19 list)
GET    /api/reports/:report?from=&to=&venue=&format=csv|pdf
```

### Customer portal (tokenized)
```
GET    /api/portal/:token/booking
GET    /api/portal/:token/payments
POST   /api/portal/:token/menu       select
POST   /api/portal/:token/decoration/approve
POST   /api/portal/:token/guests     upload
POST   /api/portal/:token/messages
```

### WhatsApp automation
```
POST   /api/messages/send            { template, refType, refId }  (queued)
POST   /api/webhooks/whatsapp        delivery/read receipts -> MessageLog
```

### AI services
```
POST   /api/ai/quotation             draft line items
POST   /api/ai/timeline              tailor milestones
POST   /api/ai/budget                estimate + optimize
POST   /api/ai/menu                  recommend
POST   /api/ai/risk                  detect conflicts/overdue/payment risk
POST   /api/ai/profit                predict margin
```
All AI endpoints return suggestions with provenance; nothing is persisted without an explicit follow-up write.

## 4. Realtime channels (Supabase)
```
org:{orgId}:event:{eventId}      workspace updates, activity feed
org:{orgId}:tasks                task board changes
org:{orgId}:rooms                room status
org:{orgId}:notifications:{uid}  personal notifications
```

## 5. Rate limiting & security
- Per-org + per-IP rate limits on write endpoints and AI endpoints (cost caps).
- CSRF protection on cookie-auth server actions; Bearer for API.
- All list endpoints RLS-backed even if a bug bypasses the app filter.
- File uploads: signed URLs, type/size validation, virus-scan hook.

## 6. Versioning
- Prefix `/api/v1`. Breaking changes → `/api/v2` with deprecation window. Contracts versioned in `packages/contracts`.
