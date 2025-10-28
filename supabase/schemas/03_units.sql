-- Units (motorcycles) table
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  plate_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT year_valid CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  CONSTRAINT plate_number_unique UNIQUE (plate_number)
);

-- Enable RLS
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- RLS Policies for units
CREATE POLICY "Authenticated users can view all units"
  ON public.units
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create units"
  ON public.units
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update units"
  ON public.units
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  );

CREATE POLICY "Admins can delete units"
  ON public.units
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_units_customer_id ON public.units(customer_id);
CREATE INDEX IF NOT EXISTS idx_units_plate_number ON public.units(plate_number);

-- Updated at trigger
CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

