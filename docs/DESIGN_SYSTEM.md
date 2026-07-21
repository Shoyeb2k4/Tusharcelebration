# Design System

Premium, calm, information-dense but uncluttered. Built on **Tailwind CSS + shadcn/ui** with a token layer so the whole product (and future SaaS tenants) can be re-themed from one place.

## 1. Brand & tone
Refined celebration — warm, trustworthy, premium. Not flashy. Deep plum/wine as the signature, warm gold as accent, generous whitespace, restrained motion.

## 2. Color tokens

Defined as CSS variables (HSL) consumed by Tailwind. Light and dark each define the same token names.

```css
:root {
  --background: 40 30% 99%;
  --foreground: 270 15% 12%;
  --card: 0 0% 100%;
  --muted: 40 20% 96%;
  --muted-foreground: 270 6% 45%;
  --primary: 300 45% 28%;        /* deep plum */
  --primary-foreground: 40 40% 98%;
  --accent: 38 78% 52%;          /* warm gold */
  --accent-foreground: 270 20% 12%;
  --success: 152 55% 38%;
  --warning: 34 92% 50%;
  --destructive: 0 72% 48%;
  --border: 40 15% 88%;
  --ring: 300 45% 40%;
  --radius: 0.75rem;
}
.dark {
  --background: 270 20% 8%;
  --foreground: 40 30% 96%;
  --card: 270 18% 11%;
  --muted: 270 12% 16%;
  --muted-foreground: 270 8% 62%;
  --primary: 300 55% 68%;
  --primary-foreground: 270 25% 10%;
  --accent: 38 80% 58%;
  --success: 152 45% 52%;
  --warning: 34 90% 58%;
  --destructive: 0 65% 58%;
  --border: 270 12% 20%;
  --ring: 300 55% 62%;
}
```

**Semantic status colors** (used consistently everywhere): success = paid/confirmed/available; warning = due-soon/reserved/low-stock; destructive = overdue/cancelled/damaged; primary = active selection; accent = highlights & CTAs.

## 3. Typography
- **Sans:** `Inter` (UI). **Display:** `Fraunces` or `Playfair Display` for page titles / brand moments (celebration feel), used sparingly.
- Scale (rem): `xs .75 · sm .875 · base 1 · lg 1.125 · xl 1.25 · 2xl 1.5 · 3xl 1.875 · 4xl 2.25`.
- Numbers use tabular figures in tables/financials (`font-variant-numeric: tabular-nums`).
- Line height 1.5 body, 1.2 headings. Max content measure ~72ch for prose.

## 4. Spacing, radius, elevation
- Spacing scale = Tailwind default (4px base). Layout gutters 24px desktop / 16px tablet / 12px mobile.
- Radius: `--radius` (12px) for cards, 8px inputs, full for pills/avatars.
- Elevation: flat surfaces + subtle borders; shadows only for overlays (`shadow-sm` cards, `shadow-lg` popovers/modals). Avoid heavy drop shadows.

## 5. Component inventory (shadcn/ui base)
Button (primary/secondary/ghost/destructive) · Input/Textarea/Select/Combobox · DatePicker/RangePicker · Checkbox/Radio/Switch · Badge/Chip (status) · Card · Table (sortable, sticky header, row density toggle) · Tabs · Dialog/Sheet/Drawer · Dropdown/Popover/Tooltip · Command palette (`⌘K`) · Toast · Skeleton/Spinner · Avatar · Progress/Meter · Kanban board · Calendar · Stepper/Timeline · File dropzone · Empty state · Stat/KPI tile · Data-viz primitives (see `dataviz` guidance).

### Domain components
- **StatTile** — label, value (tabular), delta arrow, sparkline.
- **StatusBadge** — maps enum → semantic color, single source of truth.
- **MoneyText** — formats `Decimal` in org currency, right-aligned.
- **EntityLink** — consistent cross-links (customer/event/invoice) with hover card.
- **WorkspaceTab** — lazy-loaded section inside Event Workspace.
- **PipelineCard** — draggable CRM card.
- **TimelineRail** — milestone progress.
- **WidgetShell** — draggable/resizable dashboard widget container.

## 6. States & feedback
- Every list/table has **loading (skeleton)**, **empty (illustration + primary action)**, and **error (retry)** states.
- Optimistic updates via React Query; realtime reconciles. Show subtle "saving…/saved" affordance.
- Destructive/financial actions: confirm dialog naming the specific record + amount.

## 7. Motion
- 150–200ms ease-out for enter, 100ms for exit. Reduced-motion respected.
- Drag: 8px lift + shadow. Tab switch: crossfade, no layout jump.
- No decorative animation on data-heavy screens.

## 8. Accessibility (WCAG 2.1 AA)
- Contrast ≥ 4.5:1 text / 3:1 UI. Verified in both themes.
- Full keyboard nav; visible `--ring` focus. `⌘K` and arrow-key list nav.
- ARIA roles on Kanban, tabs, dialogs; live regions for toasts/realtime.
- Color never the sole signal — pair with icon/label.
- Min hit target 40×40px (tablet-friendly for on-floor staff).

## 9. Theming for SaaS resale
All brand-specific values are tokens. A tenant theme = one JSON of token overrides (primary/accent/logo/radius). No component code changes required to re-skin for another banquet hall.

## 10. Iconography
`lucide-react`, 1.5px stroke, 20px default. Consistent metaphors: ₹ finance, 🍽 catering, 🎀 decoration, 🛏 rooms, 📦 inventory, 🧑‍🤝‍🧑 staff, ✅ tasks.
