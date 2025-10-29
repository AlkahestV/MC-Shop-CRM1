-- ============================================
-- FIX: Customer RLS Policy Issue
-- ============================================
-- 
-- PROBLEM:
-- When trying to insert a customer, the RLS policy check fails because
-- created_by is NULL, and the policy requires: created_by = auth.uid()
--
-- SOLUTION:
-- Use a SECURITY DEFINER trigger to automatically set created_by to auth.uid()
-- BEFORE the RLS policy check occurs. This bypasses RLS temporarily during
-- the trigger execution to set the field, then the RLS check passes.
--
-- Run this on an EXISTING database to fix customer creation issues.
-- (This is already included in the main schema.sql for new databases)
-- ============================================

-- 1) Create a SECURITY DEFINER function to set created_by to auth.uid()
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- If client didn't supply created_by, set it from the JWT-subjected auth.uid()
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;

  -- If created_by is supplied but not equal to auth.uid(), override it to enforce ownership
  -- (This prevents clients from inserting rows for other users)
  IF NEW.created_by IS DISTINCT FROM auth.uid() THEN
    NEW.created_by := auth.uid();
  END IF;

  RETURN NEW;
END;
$$;

-- 2) Revoke execute from anon and authenticated to keep function privileged
REVOKE EXECUTE ON FUNCTION public.set_created_by() FROM anon, authenticated;

-- 3) Create the BEFORE INSERT trigger on customers
DROP TRIGGER IF EXISTS trg_set_created_by ON public.customers;

CREATE TRIGGER trg_set_created_by
BEFORE INSERT ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();

-- 4) Apply the same trigger to jobs table (it also has created_by + RLS)
DROP TRIGGER IF EXISTS trg_set_created_by ON public.jobs;

CREATE TRIGGER trg_set_created_by
BEFORE INSERT ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();

-- ============================================
-- Verification
-- ============================================
-- After running this, you should be able to insert customers and jobs without
-- explicitly providing the created_by field. The trigger will automatically
-- set it to the authenticated user's ID.
--
-- Test customer insert:
-- INSERT INTO public.customers (first_name, last_name, phone_number, email, address)
-- VALUES ('John', 'Doe', '555-1234', 'john@example.com', '123 Main St');
--
-- Test job insert (replace UUIDs with real ones from your database):
-- INSERT INTO public.jobs (customer_id, unit_id, work_date, duration_hours, remarks)
-- VALUES ('customer-uuid-here', 'unit-uuid-here', CURRENT_DATE, 2.5, 'Oil change');
-- ============================================

