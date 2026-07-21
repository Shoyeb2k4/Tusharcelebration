# User Flows

Flows use Mermaid. They cover the load-bearing journeys; secondary CRUD is standard list→form→save.

## 1. Enquiry → Confirmed booking (sales spine)

```mermaid
flowchart TD
  A[New enquiry captured] --> B{Assigned salesperson}
  B --> C[Follow-up scheduled]
  C --> D[Site visit]
  D --> E[Build quotation]
  E --> F[Send quotation via WhatsApp/email]
  F --> G{Customer response}
  G -->|Negotiate| E
  G -->|Reject| L[Mark Lost + reason]
  G -->|Accept| H[Collect advance]
  H --> I[Generate booking + agreement + advance receipt]
  I --> J[Confirm booking - venue slot locked]
  J --> K[Event Workspace opens + timeline generated]
```

Key rules: stage transitions write `PipelineEvent`; `firstResponseAt` captured on first outbound touch for response-time metrics; accepting a quotation is the only path that seeds a `Booking`.

## 2. Booking confirmation → Event Workspace bootstrap

```mermaid
flowchart TD
  A[Booking confirmed] --> B[Create Event]
  B --> C[Generate TimelineMilestones from template<br/>90/60/30/15/7/3/1/Day/Post]
  C --> D[Spawn department tasks per milestone]
  B --> E[Seed Payments schedule from quotation]
  B --> F[Send booking confirmation WhatsApp]
  D --> G[Notify department leads]
```

## 3. Catering: menu lock → kitchen production sheet

```mermaid
flowchart TD
  A[Menu selected in Workspace or Portal] --> B{Guest count final?}
  B -->|No| C[Draft catering order]
  B -->|Yes| D[Lock catering order]
  D --> E[Explode menu -> IngredientRequirements BOM]
  E --> F[Compute food cost + prep schedule]
  F --> G[Generate ProductionSheet PDF]
  G --> H[Notify Kitchen Manager + create prep tasks]
  E --> I[Reserve kitchen inventory + flag low stock]
```

## 4. Decoration: assign package → setup

```mermaid
flowchart TD
  A[Assign decoration tier/package] --> B[Copy materials BOM to assignment]
  B --> C[Reserve required inventory]
  C --> D[Send preview to customer portal]
  D --> E{Customer approves?}
  E -->|No| A
  E -->|Yes| F[Create setup tasks + labour schedule]
  F --> G[Setup on event day -> status done]
```

## 5. Finance: payment → outstanding → invoice

```mermaid
flowchart TD
  A[Record payment ADVANCE/INSTALLMENT/FINAL] --> B[Generate receipt PDF]
  B --> C[Recompute outstanding = total - sum paid]
  C --> D{Outstanding = 0?}
  D -->|No| E[Schedule payment reminder]
  D -->|Yes| F[Issue final invoice]
  E --> G[WhatsApp reminder on due date]
  F --> H[Compute profitability = revenue - expenses]
```

Discounts beyond a threshold and expenses over a limit route through **Approvals** before taking effect.

## 6. Task lifecycle (any department)

```mermaid
flowchart LR
  TODO --> IN_PROGRESS
  IN_PROGRESS --> BLOCKED
  BLOCKED --> IN_PROGRESS
  IN_PROGRESS --> DONE
  DONE -->|reopen| TODO
```
Checklist completion can gate `DONE`; completing all tasks in a milestone advances the milestone.

## 7. Approval flow

```mermaid
flowchart TD
  A[Actor requests approval<br/>discount/expense/refund/booking] --> B[Approval PENDING created]
  B --> C[Notify approver by role]
  C --> D{Decision}
  D -->|Approve| E[Apply effect + audit]
  D -->|Reject| F[Block effect + notify requester]
```

## 8. Customer portal self-service

```mermaid
flowchart TD
  A[Customer opens tokenized portal link] --> B[View booking + timeline]
  B --> C[Track/download payments & invoices]
  B --> D[Select menu]
  B --> E[Approve decoration]
  B --> F[Upload guest list]
  D & E & F --> G[Changes reflect in Event Workspace realtime]
```

## 9. Attendance (offline-capable)

```mermaid
flowchart TD
  A[Staff check-in on tablet/PWA] --> B{Online?}
  B -->|Yes| C[Write Attendance]
  B -->|No| D[Queue in IndexedDB]
  D --> E[Sync on reconnect -> Attendance]
  C & E --> F[Dashboard attendance widget updates]
```

## 10. AI-assisted quotation (human-in-the-loop)

```mermaid
flowchart TD
  A[Open quotation for enquiry] --> B[Click "AI draft"]
  B --> C[Server AI service reads enquiry + historical wins]
  C --> D[Returns suggested line items + pricing + margin]
  D --> E[Salesperson edits/accepts]
  E --> F[Save quotation version]
```
