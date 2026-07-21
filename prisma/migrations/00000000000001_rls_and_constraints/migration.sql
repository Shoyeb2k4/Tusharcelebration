-- Guarantees Prisma cannot express: double-booking prevention (range
-- exclusion) and multi-tenant Row-Level Security. See docs/DATABASE_SCHEMA.md.

-- ── Double-booking prevention ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
  ADD CONSTRAINT booking_no_overlap
  EXCLUDE USING gist (
    "venueId" WITH =,
    tstzrange("startAt", "endAt") WITH &&
  )
  WHERE (status IN ('TENTATIVE', 'CONFIRMED'));

-- ── Row-Level Security (tenant isolation) ──────────────────────────────────
-- Every org-scoped table is filtered by the JWT `org_id` claim set by
-- Supabase Auth. This is the last line of defense behind the Prisma
-- middleware and API guard.

DO $$
DECLARE
  t text;
  tenant_tables text[] := ARRAY[
    'Organization','User','Customer','Contact','Enquiry','Quotation','Booking',
    'Event','Vendor','InventoryItem','Staff','Package','Task','AuditLog',
    'Notification','MessageLog','Note'
  ];
BEGIN
  FOREACH t IN ARRAY tenant_tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', t);

    IF t = 'Organization' THEN
      EXECUTE format($p$
        CREATE POLICY tenant_isolation ON %I
        USING (id = current_setting('request.jwt.claims', true)::json->>'org_id');
      $p$, t);
    ELSE
      EXECUTE format($p$
        CREATE POLICY tenant_isolation ON %I
        USING ("orgId" = current_setting('request.jwt.claims', true)::json->>'org_id');
      $p$, t);
    END IF;
  END LOOP;
END $$;
