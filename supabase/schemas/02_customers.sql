-- Customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_initial TEXT,
  address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Authenticated users can view all customers"
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create customers"
  ON public.customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update customers"
  ON public.customers
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  );

CREATE POLICY "Admins can delete customers"
  ON public.customers
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone_number);

-- Updated at trigger
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

