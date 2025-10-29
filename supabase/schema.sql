-- ============================================
-- MC-SHOP-CRM1 DATABASE SCHEMA
-- ============================================
-- Complete database schema for Motorshop CRM
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. USER ROLES
-- ============================================

-- User roles table to extend auth.users with role information
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('staff', 'admin')) DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================
-- This function prevents infinite recursion in RLS policies
-- by using SECURITY DEFINER to bypass RLS when checking roles
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

-- RLS Policies
CREATE POLICY "Users can view their own role" 
  ON public.user_roles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()) AND id != auth.uid())
  WITH CHECK (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()) AND id != auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_id ON public.user_roles(id);

-- ============================================
-- 2. CUSTOMERS
-- ============================================

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_initial TEXT CHECK (length(middle_initial) <= 1),
  address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  CONSTRAINT first_name_not_empty CHECK (trim(first_name) != ''),
  CONSTRAINT last_name_not_empty CHECK (trim(last_name) != ''),
  CONSTRAINT address_not_empty CHECK (trim(address) != ''),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT phone_format CHECK (phone_number ~ '^[\d\s\(\)\-\+]+$' AND length(phone_number) >= 7),
  CONSTRAINT email_unique UNIQUE (email)
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view all customers"
  ON public.customers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create customers"
  ON public.customers FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can update customers"
  ON public.customers FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()))
  WITH CHECK (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete customers"
  ON public.customers FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()));

-- Trigger function to auto-set created_by (SECURITY DEFINER to bypass RLS)
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

-- Revoke execute from anon and authenticated to keep function privileged
REVOKE EXECUTE ON FUNCTION public.set_created_by() FROM anon, authenticated;

-- Create the BEFORE INSERT trigger on customers
DROP TRIGGER IF EXISTS trg_set_created_by ON public.customers;

CREATE TRIGGER trg_set_created_by
BEFORE INSERT ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_customers_full_name ON public.customers((lower(first_name || ' ' || last_name)));
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(lower(email));
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone_number);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON public.customers(created_by);

-- ============================================
-- 3. UNITS (MOTORCYCLES)
-- ============================================

CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  plate_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT brand_not_empty CHECK (trim(brand) != ''),
  CONSTRAINT model_not_empty CHECK (trim(model) != ''),
  CONSTRAINT year_valid CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 2),
  CONSTRAINT plate_number_not_empty CHECK (trim(plate_number) != '')
);

-- Case-insensitive unique index for plate numbers
CREATE UNIQUE INDEX IF NOT EXISTS idx_units_plate_number_unique ON public.units(UPPER(plate_number));

-- Enable RLS
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view all units"
  ON public.units FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create units"
  ON public.units FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update units"
  ON public.units FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()))
  WITH CHECK (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete units"
  ON public.units FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_units_customer_id ON public.units(customer_id);
CREATE INDEX IF NOT EXISTS idx_units_brand_model ON public.units(brand, model);
CREATE INDEX IF NOT EXISTS idx_units_year ON public.units(year DESC);

-- ============================================
-- 4. JOBS
-- ============================================

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE RESTRICT,
  work_date DATE NOT NULL,
  duration_hours DECIMAL(5,2) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  CONSTRAINT duration_positive CHECK (duration_hours > 0 AND duration_hours <= 999.99),
  CONSTRAINT work_date_not_future CHECK (work_date <= CURRENT_DATE + INTERVAL '7 days')
);

-- Job items table
CREATE TABLE IF NOT EXISTS public.job_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  products_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT description_not_empty CHECK (trim(description) != '')
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs
CREATE POLICY "Authenticated users can view all jobs"
  ON public.jobs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create jobs"
  ON public.jobs FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can update jobs"
  ON public.jobs FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()))
  WITH CHECK (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete jobs"
  ON public.jobs FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()));

-- RLS Policies for job_items
CREATE POLICY "Authenticated users can view all job items"
  ON public.job_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create job items"
  ON public.job_items FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update job items"
  ON public.job_items FOR UPDATE TO authenticated
  USING (public.is_user_admin(auth.uid()))
  WITH CHECK (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete job items"
  ON public.job_items FOR DELETE TO authenticated
  USING (public.is_user_admin(auth.uid()));

-- Apply the same created_by trigger to jobs table
DROP TRIGGER IF EXISTS trg_set_created_by ON public.jobs;

CREATE TRIGGER trg_set_created_by
BEFORE INSERT ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON public.jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_unit_id ON public.jobs(unit_id);
CREATE INDEX IF NOT EXISTS idx_jobs_work_date ON public.jobs(work_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON public.jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_customer_date ON public.jobs(customer_id, work_date DESC);
CREATE INDEX IF NOT EXISTS idx_job_items_job_id ON public.job_items(job_id);

-- ============================================
-- 5. TRIGGERS & FUNCTIONS
-- ============================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON public.units FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Automatic role assignment on signup
-- Note: This function uses SECURITY DEFINER because it's called by auth.users
-- triggers and needs elevated permissions to insert into user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (NEW.id, 'staff')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Normalize customer email
CREATE OR REPLACE FUNCTION public.normalize_customer_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.email = lower(trim(NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER normalize_customer_email_trigger
  BEFORE INSERT OR UPDATE ON public.customers FOR EACH ROW
  EXECUTE FUNCTION public.normalize_customer_email();

-- Normalize plate number
CREATE OR REPLACE FUNCTION public.normalize_plate_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.plate_number = UPPER(trim(NEW.plate_number));
  RETURN NEW;
END;
$$;

CREATE TRIGGER normalize_plate_number_trigger
  BEFORE INSERT OR UPDATE ON public.units FOR EACH ROW
  EXECUTE FUNCTION public.normalize_plate_number();

-- Validate job unit belongs to customer
CREATE OR REPLACE FUNCTION public.validate_job_unit_customer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.units 
    WHERE id = NEW.unit_id AND customer_id = NEW.customer_id
  ) THEN
    RAISE EXCEPTION 'Unit does not belong to the specified customer';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_job_unit_customer_trigger
  BEFORE INSERT OR UPDATE ON public.jobs FOR EACH ROW
  EXECUTE FUNCTION public.validate_job_unit_customer();

-- ============================================
-- 6. UTILITY FUNCTIONS
-- ============================================

-- Get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.user_roles 
  WHERE id = get_user_role.user_id;
  RETURN COALESCE(user_role, 'staff');
END;
$$;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role FROM public.user_roles WHERE id = auth.uid()) = 'admin',
    false
  );
END;
$$;

-- Search customers
CREATE OR REPLACE FUNCTION public.search_customers(search_query TEXT)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  middle_initial TEXT,
  address TEXT,
  phone_number TEXT,
  email TEXT,
  created_at TIMESTAMPTZ,
  unit_count BIGINT
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
BEGIN
  IF length(trim(search_customers.search_query)) < 2 THEN 
    RETURN; 
  END IF;

  RETURN QUERY
  SELECT 
    c.id, c.first_name, c.last_name, c.middle_initial,
    c.address, c.phone_number, c.email, c.created_at,
    COUNT(u.id) as unit_count
  FROM public.customers c
  LEFT JOIN public.units u ON c.id = u.customer_id
  WHERE 
    c.first_name ILIKE '%' || search_customers.search_query || '%' OR
    c.last_name ILIKE '%' || search_customers.search_query || '%' OR
    (c.first_name || ' ' || c.last_name) ILIKE '%' || search_customers.search_query || '%' OR
    c.email ILIKE '%' || search_customers.search_query || '%' OR
    c.phone_number ILIKE '%' || search_customers.search_query || '%'
  GROUP BY c.id, c.first_name, c.last_name, c.middle_initial, 
           c.address, c.phone_number, c.email, c.created_at
  ORDER BY 
    CASE 
      WHEN lower(c.last_name) = lower(search_customers.search_query) THEN 1
      WHEN lower(c.first_name) = lower(search_customers.search_query) THEN 2
      WHEN lower(c.first_name || ' ' || c.last_name) = lower(search_customers.search_query) THEN 3
      ELSE 4
    END,
    c.last_name, c.first_name
  LIMIT 20;
END;
$$;

-- Get customer profile
CREATE OR REPLACE FUNCTION public.get_customer_profile(customer_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
DECLARE
  result JSON;
  customer_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.customers 
    WHERE id = get_customer_profile.customer_id
  ) INTO customer_exists;
  
  IF NOT customer_exists THEN
    RAISE EXCEPTION 'Customer not found with ID: %', get_customer_profile.customer_id;
  END IF;

  SELECT json_build_object(
    'customer', (
      SELECT row_to_json(c) 
      FROM public.customers c 
      WHERE c.id = get_customer_profile.customer_id
    ),
    'units', COALESCE((
      SELECT json_agg(row_to_json(u) ORDER BY u.created_at)
      FROM public.units u 
      WHERE u.customer_id = get_customer_profile.customer_id
    ), '[]'::json),
    'jobs', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', j.id,
          'work_date', j.work_date,
          'duration_hours', j.duration_hours,
          'remarks', j.remarks,
          'unit', (
            SELECT row_to_json(u) 
            FROM public.units u 
            WHERE u.id = j.unit_id
          ),
          'items', COALESCE((
            SELECT json_agg(row_to_json(ji) ORDER BY ji.created_at)
            FROM public.job_items ji 
            WHERE ji.job_id = j.id
          ), '[]'::json),
          'created_at', j.created_at,
          'created_by', j.created_by
        )
        ORDER BY j.work_date DESC, j.created_at DESC
      )
      FROM public.jobs j 
      WHERE j.customer_id = get_customer_profile.customer_id
    ), '[]'::json)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- ============================================
-- 7. FUNCTION GRANTS & AUTH PERMISSIONS
-- ============================================

-- Grant execute on utility functions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_customers(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_customer_profile(UUID) TO authenticated;

-- Grant permissions for auth trigger function
-- This allows Supabase Auth to create users and assign roles
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated, anon, public;

GRANT INSERT, SELECT ON TABLE public.user_roles TO supabase_auth_admin;

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Database schema created successfully!
-- Next step: Create your first admin user
-- ============================================

