# Wireframes (low-fidelity)

ASCII wireframes describing layout, hierarchy, and key interactions for the load-bearing screens. High-fidelity Figma frames follow the design tokens in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).

## Shell

```
┌──────────────────────────────────────────────────────────────────┐
│ ☰  Tushar Celebrations        ⌘K Search…        🔔  ◐  [User ▾]    │  top bar
├───────────┬──────────────────────────────────────────────────────┤
│ Dashboard │                                                        │
│ Enquiries │                    MAIN CONTENT                        │
│ Bookings  │                                                        │
│ Events    │                                                        │
│ Calendar  │                                                        │
│ Quotations│                                                        │
│ Finance ▾ │                                                        │
│ Catering  │                                                        │
│ …         │                                                        │
│ Settings  │                                                        │
└───────────┴──────────────────────────────────────────────────────┘
Sidebar collapses to icons on tablet; becomes bottom sheet on mobile.
```

## 1. Executive Dashboard (draggable widgets)

```
┌ Dashboard ─────────────────────────────  [Customize ▤] [Today ▾] ┐
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│ │Revenue    │ │Revenue    │ │Outstanding│ │Hall       │          │
│ │Today      │ │Month      │ │Balance    │ │Occupancy  │          │
│ │ ₹1.2L  ▲  │ │ ₹34L   ▲  │ │ ₹8.5L     │ │ 72%  ▓▓▓░ │          │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘          │
│ ┌─────────────────────┐ ┌─────────────────────────────┐          │
│ │ Today's Events      │ │ Follow-ups Due              │          │
│ │ • Sharma Wedding    │ │ • Call Mr. Khan   11:00     │          │
│ │   Main Hall · 6pm   │ │ • WA Reddy fam    14:30     │          │
│ │ • Corp Offsite      │ │ [ 5 more ]                  │          │
│ └─────────────────────┘ └─────────────────────────────┘          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐        │
│ │New       │ │Pending   │ │Inventory │ │Tasks Due Today │        │
│ │Enquiries │ │Quotations│ │Alerts    │ │ 8 open         │        │
│ └──────────┘ └──────────┘ └──────────┘ └────────────────┘        │
└──────────────────────────────────────────────────────────────────┘
Widgets: drag handle top-left, resize corner bott-right, layout saved per user.
```

## 2. Enquiry CRM — Kanban pipeline

```
┌ Enquiries ──────────────  [+ New Enquiry]  [List][Board]  [Filter▾]┐
│ NEW      FOLLOW-UP  SITE VISIT  QUOTED    NEGOTIATE  CONFIRMED     │
│ ┌──────┐ ┌──────┐  ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐       │
│ │Sharma│ │Khan  │  │Reddy │   │Mehta │   │Iyer  │   │Verma │       │
│ │Wed·200│ │Bday │  │Recep │   │Wed   │   │Corp  │   │Wed   │       │
│ │₹4L    │ │₹1L  │  │₹2.5L │   │₹6L   │   │₹9L   │   │₹5L   │       │
│ │👤 Ravi│ │👤Sam │  │📞 due│   │📎 v2 │   │⚠ 3d  │   │✓     │       │
│ └──────┘ └──────┘  └──────┘   └──────┘   └──────┘   └──────┘       │
│  drag card between columns → writes PipelineEvent + updates stage  │
└───────────────────────────────────────────────────────────────────┘
```

## 3. Event Workspace (flagship)

```
┌ Sharma Wedding · BKG-2026-000012 ······ CONFIRMED · 12 Aug · Main Hall ┐
│ [Overview][Customer][Booking][Payments][Rooms][Decoration][Kitchen]    │
│ [Menu][Inventory][Tasks][Timeline][Staff][Vendors][Docs][Photos][Notes]│
│ [Approvals][Checklists]                                                 │
├────────────────────────────────────┬───────────────────────────────────┤
│  OVERVIEW                           │  ACTIVITY FEED (realtime)         │
│  ┌ Financials ─────────────┐        │  • Accounts recorded ₹2L advance  │
│  │ Total   ₹5,00,000       │        │  • Kitchen locked menu            │
│  │ Paid    ₹2,00,000       │        │  • Decor package: Royal assigned  │
│  │ Due     ₹3,00,000  ⏰    │        │  • Task "Stage setup" done        │
│  │ Profit  ₹1,10,000 (est) │        │                                   │
│  └─────────────────────────┘        │  QUICK ACTIONS                    │
│  ┌ Timeline ──────────────┐         │  [Record payment]                 │
│  │ ●─●─●─○─○─○ Event day    │        │  [Add task]  [Send WhatsApp]      │
│  │ T-30 tasks: 4/6 done    │        │  [Generate invoice]               │
│  └─────────────────────────┘        │  [Assign vendor]                  │
│  ┌ Departments status ─────┐        │                                   │
│  │ Kitchen ▓▓▓░ Decor ▓▓▓▓  │        │  RISK ALERTS                      │
│  │ Rooms ▓▓░░  Inventory ▓▓ │        │  ⚠ Payment due in 3d              │
│  └─────────────────────────┘        │  ⚠ Sound equip double-reserved    │
└────────────────────────────────────┴───────────────────────────────────┘
Every tab loads inline; no full-page nav. Deep links open the right tab.
```

## 4. Quotation builder

```
┌ Quotation QUO-2026-000045 · v2 · DRAFT ······ [AI Draft ✨][Preview PDF] ┐
│ Customer: Sharma  Event: Wedding  Date: 12 Aug  Guests: 200             │
├─────────────────────────────────────────────────────────────────────────┤
│ Item                    Cat        Qty   Unit ₹     Amount   Opt         │
│ Main Hall (Evening)     venue        1   1,50,000   1,50,000 [ ]         │
│ Royal Decoration        decoration   1   1,20,000   1,20,000 [ ]         │
│ Menu — Premium Veg      catering   200        850   1,70,000 [ ]         │
│ Bride+Groom rooms       rooms        4      5,000     20,000 [x]         │
│ [+ Add line]  [+ Add package]                                           │
├─────────────────────────────────────────────────────────────────────────┤
│ Subtotal 4,60,000   Discount [−20,000]   GST 18% 79,200  Total 5,19,200 │
│                                        [Save v2]  [Send via WhatsApp ▸]  │
└─────────────────────────────────────────────────────────────────────────┘
```

## 5. Finance — Outstanding & payment

```
┌ Outstanding ─────────────────────  [This Month ▾] [Export]  ┐
│ Event            Total    Paid     Due       Aging   Action  │
│ Sharma Wedding   5,00,000 2,00,000 3,00,000  ●30d   [Remind] │
│ Iyer Corp        9,00,000 9,00,000        0  ✓       [Invoice]│
│ Mehta Wedding    6,00,000 1,00,000 5,00,000  ●●60d  [Remind] │
│                                    ─────────                  │
│                          Total Outstanding  ₹8,00,000        │
└──────────────────────────────────────────────────────────────┘
```

## 6. Kitchen Production Sheet

```
┌ Production Sheet · Sharma Wedding · 12 Aug · 200 pax ····· [PDF][Print] ┐
│ MENU                                 INGREDIENTS (BOM)                   │
│ Starters                             Paneer      24 kg                   │
│  • Paneer Tikka        200 plate     Basmati     30 kg                   │
│  • Veg Spring Roll     200 plate     Ghee         8 kg                   │
│ Mains                                Onion       40 kg                   │
│  • Dal Makhani         200 plate     …                                   │
│ Live Counters                                                           │
│  • Chaat Counter         1           PREP SCHEDULE                       │
│ Sweet Counters                       14:00 Marination (Tandoor)         │
│  • Assorted Sweets       1           16:00 Gravy base (Main line)        │
│                                      18:00 Live counter setup            │
│ Food cost est: ₹1,05,000                                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## 7. Tasks (Kanban)

```
┌ Tasks ───── [Board][List][Calendar]  [Dept: All ▾] [Mine] [+ Task] ┐
│ TODO            IN PROGRESS      BLOCKED         DONE               │
│ ┌────────────┐  ┌────────────┐   ┌───────────┐  ┌───────────┐       │
│ │Stage setup │  │Order flowers│  │Gen backup │  │Book DJ    │       │
│ │Decor · HIGH│  │Decor        │  │Maint ·URG │  │Event mgr  │       │
│ │Due T-1  ☑2/5│  │Due T-2     │  │waiting PO │  │✓          │       │
│ └────────────┘  └────────────┘   └───────────┘  └───────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

## 8. Customer Portal

```
┌ Your Event · Sharma Wedding · 12 Aug ─────────────  [Message us] ┐
│  Timeline ●──●──●──○ Event day                                    │
│  Payments:  Paid ₹2L / ₹5L    [Download receipts] [Invoice]      │
│  ┌ Choose your menu ┐  ┌ Approve decoration ┐  ┌ Guest list ┐    │
│  │ Premium Veg  ◉    │  │ [Royal preview 🖼] │  │ Upload .xlsx│    │
│  │ Deluxe NonVeg ○   │  │ [Approve] [Changes]│  │ 180 added   │    │
│  └───────────────────┘  └────────────────────┘  └─────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

## 9. Responsive behavior
- **Desktop-first**: two-pane workspace, persistent sidebar.
- **Tablet**: sidebar → icon rail; workspace tabs scroll horizontally; primary target for on-floor staff.
- **Mobile (PWA)**: single column, bottom tab bar (Dashboard / Events / Tasks / More); approvals & photo upload optimized for thumb.
