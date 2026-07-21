# UI/UX Specification

Behavioral contract for how screens work — complementing the visual [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) and layout [`WIREFRAMES.md`](WIREFRAMES.md).

## 1. Global interaction rules
- **Minimal clicks**: the primary action on any screen is one click/keystroke away. Event Workspace actions ≤ 2 clicks from the workspace.
- **Command palette (`⌘K`)**: fuzzy-jump to any entity or action from anywhere.
- **Keyboard-first**: `/` focuses search, `n` new (context-aware), `j/k` list nav, `e` edit, `⌘Enter` submit forms, `Esc` closes overlays.
- **Inline editing** for single-field changes (status, assignee, amount) — no full-page forms for small edits.
- **Autosave** drafts (quotation builder, notes) with visible save state; explicit save for financial commits.
- **Undo** toast (5s) for reversible mutations (delete task, move card).
- **Realtime** presence + live updates in shared views (Workspace, Tasks, Rooms board).

## 2. Layout system
- 12-column responsive grid; content max-width 1440px, workspace uses full width.
- Two-pane pattern for detail screens (context left, actions/feed right).
- Sticky page header with title, status, and primary actions; sticky table headers.
- Density toggle (comfortable/compact) for data tables, persisted per user.

## 3. Screen-by-screen behavior (highlights)

### Dashboard
- Widget grid: drag to reorder, resize handles, add/remove from a widget catalog. Layout saved to `DashboardLayout.widgets`. Each widget: title, value, deep-link, last-updated. Empty widget states guide setup.

### Enquiry CRM
- Board and list toggle share filters. Dragging a card between columns triggers stage change + optional required fields (e.g. Lost → reason modal). Card shows customer, event type, value, owner avatar, next follow-up, quote version. Bulk actions: reassign, set follow-up.

### Event Workspace
- Tab bar horizontally scrollable; tabs lazy-load and cache. Overview shows financial summary, timeline rail, department progress, activity feed, quick actions, risk alerts. Switching tabs never resets scroll/context. Quick actions open side sheets (record payment, add task) instead of navigating away.

### Quotation builder
- Spreadsheet-like line-item grid, keyboard tab-through, add package expands into lines. Live totals. "AI Draft ✨" fills a suggested draft the user edits (never auto-sends). Preview renders the exact PDF. Send opens channel picker (WhatsApp/email) with editable message.

### Finance
- Outstanding table sorted by aging with color-coded severity. Record-payment sheet: type, method, amount (defaults to remaining), reference, date → generates receipt. Discounts/expenses over threshold show an inline "requires approval" banner and route to Approvals.

### Tasks
- Board/list/calendar views. Filters: department, assignee (Mine), event, due. Checklist inline-tickable. Overdue rows flagged. Drag between columns updates status optimistically.

### Catering
- Menu builder grouped by course; guest count drives per-plate math. Lock action is irreversible-with-confirm; on lock, production sheet + prep tasks generate and Kitchen is notified.

### Rooms
- Board of rooms by status/side; drag guest onto room to allocate; check-in/out and housekeeping status togglable inline.

## 4. Empty, loading, error, offline states
- **Loading**: skeletons matching final layout (no spinners for page content).
- **Empty**: friendly illustration + one-line explanation + primary CTA.
- **Error**: inline card with cause + retry; never a blank screen.
- **Offline** (PWA): banner "Working offline — changes will sync"; queued writes badge; conflict resolution last-write-wins with audit trail for critical records.

## 5. Notifications & alerts
- Bell center groups by type; unread count. Toasts for immediate feedback. Risk alerts surfaced in Workspace and Dashboard (payment risk, resource conflict, overdue task).

## 6. Forms & validation
- Zod-backed; validate on blur + submit. Field-level errors adjacent to inputs. Currency/phone/date inputs formatted and masked. Required fields marked; disable submit only after showing why.

## 7. Permissions in the UI
- Actions the user can't perform are hidden (nav) or disabled-with-tooltip (in-context) based on the RBAC policy engine. Read-only Auditor sees everything, mutates nothing (all controls disabled).

## 8. Localization & formatting
- All strings via i18n keys. INR + `en-IN` number/date formatting default; org-configurable. RTL-ready layout primitives.

## 9. Performance UX budget
- Route transitions < 200ms perceived (prefetch + cached queries). Tables virtualized beyond 100 rows. Images lazy-loaded, thumbnails via Supabase transform.

## 10. Trust & safety
- Confirmations name the exact record and amount. Audit trail visible on records ("last edited by…"). Financial mutations are idempotent (client-generated keys) to prevent double-charge on retry.
