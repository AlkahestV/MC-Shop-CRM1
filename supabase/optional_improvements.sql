-- ============================================
-- OPTIONAL SCHEMA IMPROVEMENTS
-- ============================================
-- These improvements are NOT CRITICAL.
-- Your schema is production-ready as-is.
-- Apply these for enhanced documentation and explicit security.
-- ============================================

-- ============================================
-- 1. TABLE COMMENTS (Documentation)
-- ============================================
-- Best Practice: Add comments to describe what each table does
-- Reference: Supabase code-format-sql.md

comment on table public.user_roles is 'Extends auth.users with role information (staff or admin) for authorization. Each user gets a role assigned on signup via trigger.';

comment on table public.customers is 'Stores customer information including contact details, timestamps, and creator tracking. Email addresses are normalized to lowercase and must be unique.';

comment on table public.units is 'Stores motorcycle/vehicle information associated with customers. Plate numbers are normalized to uppercase and must be unique. Units are cascade deleted when their customer is deleted.';

comment on table public.jobs is 'Stores service jobs performed on customer units. Tracks work date, duration, and creator. Prevents customer/unit deletion via RESTRICT. Validates that unit belongs to customer via trigger.';

comment on table public.job_items is 'Stores individual service items/tasks within a job. Describes work performed and products used. Cascade deleted when parent job is deleted.';

-- ============================================
-- 2. EXPLICIT ANON POLICIES (Defense in Depth)
-- ============================================
-- Best Practice: Be explicit about both authenticated and anon roles
-- Reference: Supabase database-rls-policies.md
--
-- Why: Makes security explicit and prevents accidents if someone
-- accidentally removes "TO authenticated" from a policy.
--
-- Note: These policies DENY all access to anonymous users.
-- Your current setup already blocks anon by default, but being
-- explicit is the recommended pattern.

-- USER_ROLES: Deny all anon access
create policy "Anonymous users cannot view user roles"
  on public.user_roles for select to anon using (false);

create policy "Anonymous users cannot insert user roles"
  on public.user_roles for insert to anon with check (false);

create policy "Anonymous users cannot update user roles"
  on public.user_roles for update to anon using (false);

create policy "Anonymous users cannot delete user roles"
  on public.user_roles for delete to anon using (false);

-- CUSTOMERS: Deny all anon access
create policy "Anonymous users cannot view customers"
  on public.customers for select to anon using (false);

create policy "Anonymous users cannot insert customers"
  on public.customers for insert to anon with check (false);

create policy "Anonymous users cannot update customers"
  on public.customers for update to anon using (false);

create policy "Anonymous users cannot delete customers"
  on public.customers for delete to anon using (false);

-- UNITS: Deny all anon access
create policy "Anonymous users cannot view units"
  on public.units for select to anon using (false);

create policy "Anonymous users cannot insert units"
  on public.units for insert to anon with check (false);

create policy "Anonymous users cannot update units"
  on public.units for update to anon using (false);

create policy "Anonymous users cannot delete units"
  on public.units for delete to anon using (false);

-- JOBS: Deny all anon access
create policy "Anonymous users cannot view jobs"
  on public.jobs for select to anon using (false);

create policy "Anonymous users cannot insert jobs"
  on public.jobs for insert to anon with check (false);

create policy "Anonymous users cannot update jobs"
  on public.jobs for update to anon using (false);

create policy "Anonymous users cannot delete jobs"
  on public.jobs for delete to anon using (false);

-- JOB_ITEMS: Deny all anon access
create policy "Anonymous users cannot view job items"
  on public.job_items for select to anon using (false);

create policy "Anonymous users cannot insert job items"
  on public.job_items for insert to anon with check (false);

create policy "Anonymous users cannot update job items"
  on public.job_items for update to anon using (false);

create policy "Anonymous users cannot delete job items"
  on public.job_items for delete to anon using (false);

-- ============================================
-- IMPROVEMENTS COMPLETE
-- ============================================
-- Summary of changes:
-- - Added 5 table comments for documentation
-- - Added 20 explicit anon deny policies for defense in depth
--
-- These changes enhance documentation and make security explicit.
-- They do NOT change any functionality or fix any bugs.
-- ============================================

