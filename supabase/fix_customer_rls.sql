-- ============================================
-- FIX: RLS Policy Issues
-- ============================================
-- 
-- PROBLEM 1: Customer/Job Creation Fails
-- When trying to insert a customer/job, the RLS policy check fails because
-- created_by is NULL, and the policy requires: created_by = auth.uid()
--
-- PROBLEM 2: Infinite Recursion on Admin Checks
-- RLS policies that check for admin role can cause infinite recursion
-- when the policy itself queries the user_roles table that has RLS enabled
--
-- SOLUTION:
-- 1. Use SECURITY DEFINER trigger to auto-set created_by to auth.uid()
-- 2. Use SECURITY DEFINER helper function to check admin status without recursion
--
-- Run this on an EXISTING database to fix RLS issues.
-- (These fixes are already included in the main schema.sql for new databases)
-- ============================================

-- ============================================
-- FIX 1: Helper function to prevent infinite recursion
-- ============================================

CREATE OR REPLACE FUNCTION public.is_user_admin(p_user uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.id = p_user AND ur.role = 'admin'
  );
$$;

-- Restrict direct execution by public roles
REVOKE EXECUTE ON FUNCTION public.is_user_admin(uuid) FROM anon, authenticated;

-- ============================================
-- FIX 2: Auto-set created_by trigger
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
-- FIX 3: Update RLS Policies to use helper function
-- ============================================
-- Replace all admin checks in RLS policies with the helper function
-- This prevents the infinite recursion issue

-- Update user_roles policies
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()) AND id != auth.uid())
  WITH CHECK (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()) AND id != auth.uid());

-- Update customers policies
DROP POLICY IF EXISTS "Admins can update customers" ON public.customers;
CREATE POLICY "Admins can update customers"
  ON public.customers FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()))
  WITH CHECK (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete customers" ON public.customers;
CREATE POLICY "Admins can delete customers"
  ON public.customers FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()));

-- Update units policies
DROP POLICY IF EXISTS "Admins can update units" ON public.units;
CREATE POLICY "Admins can update units"
  ON public.units FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()))
  WITH CHECK (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete units" ON public.units;
CREATE POLICY "Admins can delete units"
  ON public.units FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()));

-- Update jobs policies
DROP POLICY IF EXISTS "Admins can update jobs" ON public.jobs;
CREATE POLICY "Admins can update jobs"
  ON public.jobs FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()))
  WITH CHECK (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete jobs" ON public.jobs;
CREATE POLICY "Admins can delete jobs"
  ON public.jobs FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()));

-- Update job_items policies
DROP POLICY IF EXISTS "Admins can update job items" ON public.job_items;
CREATE POLICY "Admins can update job items"
  ON public.job_items FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()))
  WITH CHECK (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete job items" ON public.job_items;
CREATE POLICY "Admins can delete job items"
  ON public.job_items FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()));

-- ============================================
-- Verification
-- ============================================
-- After running this, you should be able to:
-- 1. Insert customers and jobs without providing created_by field
-- 2. Admin operations work without infinite recursion
--
-- Test customer insert:
-- INSERT INTO public.customers (first_name, last_name, phone_number, email, address)
-- VALUES ('John', 'Doe', '555-1234', 'john@example.com', '123 Main St');
--
-- Test job insert (replace UUIDs with real ones):
-- INSERT INTO public.jobs (customer_id, unit_id, work_date, duration_hours, remarks)
-- VALUES ('customer-uuid-here', 'unit-uuid-here', CURRENT_DATE, 2.5, 'Oil change');
-- ============================================

