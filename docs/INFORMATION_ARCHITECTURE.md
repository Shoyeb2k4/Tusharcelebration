# Information Architecture

## 1. Navigation model

Two shells:

- **Staff app** (authenticated by role) — left sidebar + top command bar.
- **Customer portal** — minimal top nav, scoped to one customer's bookings.

### Staff app — primary navigation

```
Dashboard
Enquiries (CRM)
Bookings
Events            ← opens Event Workspace
Calendar          ← venues availability + events
Quotations
Finance
  ├─ Payments
  ├─ Invoices
  ├─ Expenses
  └─ Outstanding
Catering
Decoration
Guest Rooms
Vendors
Inventory
  └─ Store
Staff
  ├─ Attendance
  ├─ Shifts
  └─ Leaves
Tasks
Reports
Documents
Approvals
Settings
  ├─ Venues
  ├─ Packages (menu / decoration)
  ├─ Task templates & timeline
  ├─ Roles & permissions
  ├─ Organization & tax
  ├─ WhatsApp / notifications
  └─ Audit log
```

Sidebar items are filtered by the signed-in user's permissions (see `src/lib/rbac`). A role that lacks `read` on a resource never sees its nav entry.

### Global chrome
- **Command palette (`⌘K`)** — jump to any event, enquiry, customer, invoice, or action.
- **Global search** — cross-entity.
- **Notification center** — tasks, approvals, payment reminders, risk alerts.
- **Org/branch switcher** (multi-branch future).
- **Theme toggle** (light/dark), **user menu**.

## 2. The Event Workspace as a hub

The Event Workspace (`/events/:id`) is the gravitational center. It is a tabbed page, not a set of separate routes, so context never resets:

```
/events/:id
  ?tab=overview | customer | booking | payments | rooms |
        decoration | kitchen | menu | inventory | tasks |
        timeline | staff | vendors | documents | photos |
        notes | approvals | checklists
```

Every other module can deep-link *into* the workspace (e.g. Finance "record payment" opens `?tab=payments`), and the workspace links *out* only for heavy management screens (e.g. editing a decoration package definition).

## 3. Content hierarchy

```
Organization (tenant)
 ├─ Users ── Roles ── Permissions
 ├─ Venues ── TimeSlots ── AvailabilityBlocks
 ├─ Customers ── Contacts
 ├─ Enquiries ── FollowUps ── PipelineEvents
 ├─ Quotations ── QuotationLineItems ── Versions
 ├─ Bookings
 │   └─ Event (Workspace root)
 │        ├─ Payments · Invoices · Expenses
 │        ├─ RoomAllocations
 │        ├─ DecorationAssignment ── Materials
 │        ├─ CateringOrder ── MenuItems ── ProductionSheet ── IngredientRequirements
 │        ├─ InventoryReservations
 │        ├─ Tasks ── Checklists ── Comments
 │        ├─ TimelineMilestones
 │        ├─ StaffAssignments
 │        ├─ VendorEngagements ── PurchaseOrders
 │        ├─ Documents · Photos · Notes
 │        └─ Approvals
 ├─ Packages (Menu, Decoration)
 ├─ Inventory Items ── StockMovements
 ├─ Staff ── Attendance · Shifts · Leaves · SalaryRecords
 ├─ Vendors ── Contracts · Ratings
 ├─ AuditLog
 └─ Notifications / MessageLog
```

## 4. URL map (staff app)

| Route | Screen |
|-------|--------|
| `/dashboard` | Executive dashboard (widget grid) |
| `/enquiries` · `/enquiries/:id` | CRM list / detail |
| `/bookings` · `/bookings/:id` | Bookings |
| `/events/:id` | **Event Workspace** (tabbed) |
| `/calendar` | Venue + event calendar |
| `/quotations` · `/quotations/:id` | Quotation builder |
| `/finance/payments` `/finance/invoices` `/finance/expenses` `/finance/outstanding` | Finance |
| `/catering` · `/catering/:orderId` | Catering ops |
| `/decoration` · `/decoration/:id` | Decoration |
| `/rooms` | Room board |
| `/vendors` · `/vendors/:id` | Vendors |
| `/inventory` · `/inventory/:id` · `/inventory/store` | Inventory / store |
| `/staff` `/staff/attendance` `/staff/shifts` `/staff/leaves` | Staff |
| `/tasks` | Tasks (kanban/list/calendar) |
| `/reports/:report` | Reports |
| `/documents` | Document library |
| `/approvals` | Approval queue |
| `/settings/*` | Configuration |

## 5. Customer portal map

| Route | Screen |
|-------|--------|
| `/portal` | Booking overview |
| `/portal/payments` | Payments + downloads |
| `/portal/timeline` | Event timeline |
| `/portal/menu` | Menu selection |
| `/portal/decoration` | Decoration approval |
| `/portal/guests` | Guest list upload |
| `/portal/rooms` | Room allocation |
| `/portal/messages` | Chat with management |

## 6. Search & discovery
- **Command palette** indexes: events, enquiries, customers, bookings, invoices, vendors, staff, inventory items.
- Every list view: server-side filter + sort + saved views per user.
- Entity cross-links everywhere (customer ↔ enquiries ↔ bookings ↔ events ↔ payments).

## 7. Notifications taxonomy
`task.assigned`, `task.overdue`, `approval.requested`, `payment.due`, `payment.received`, `enquiry.followup_due`, `event.upcoming`, `inventory.low_stock`, `risk.detected`, `booking.confirmed`, `whatsapp.delivery`. Each maps to in-app center + optional push/WhatsApp per user preference.
