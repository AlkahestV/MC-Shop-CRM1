-- Jobs table
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
  CONSTRAINT duration_positive CHECK (duration_hours > 0)
);

-- Job items table (multiple work items per job)
CREATE TABLE IF NOT EXISTS public.job_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  products_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs
CREATE POLICY "Authenticated users can view all jobs"
  ON public.jobs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create jobs"
  ON public.jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update jobs"
  ON public.jobs
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  );

CREATE POLICY "Admins can delete jobs"
  ON public.jobs
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- Enable RLS on job_items
ALTER TABLE public.job_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_items
CREATE POLICY "Authenticated users can view all job items"
  ON public.job_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create job items"
  ON public.job_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update job items"
  ON public.job_items
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  );

CREATE POLICY "Admins can delete job items"
  ON public.job_items
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON public.jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_unit_id ON public.jobs(unit_id);
CREATE INDEX IF NOT EXISTS idx_jobs_work_date ON public.jobs(work_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON public.jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_job_items_job_id ON public.job_items(job_id);

-- Updated at trigger for jobs
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

