-- ============================================
-- FIX AUTH TRIGGER PERMISSIONS
-- ============================================
-- Problem: handle_new_user() trigger fails because it lacks
-- permission to insert into public.user_roles when auth creates users.
--
-- Solution: Change function to SECURITY DEFINER and grant proper permissions
-- This follows Supabase's official pattern for auth triggers.
-- ============================================

-- Step 1: Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Step 2: Recreate function with SECURITY DEFINER
-- This allows the function to run with elevated permissions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer -- Changed from SECURITY INVOKER to SECURITY DEFINER
set search_path = '' -- Still protected against search_path attacks
as $$
begin
  insert into public.user_roles (id, role)
  values (new.id, 'staff')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Step 3: Recreate the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Step 4: Grant necessary permissions to supabase_auth_admin
-- This role is used by Supabase Auth system
grant usage on schema public to supabase_auth_admin;

grant execute
  on function public.handle_new_user
  to supabase_auth_admin;

-- Revoke execute from regular users (they shouldn't call this directly)
revoke execute
  on function public.handle_new_user
  from authenticated, anon, public;

-- Grant INSERT permission on user_roles to supabase_auth_admin
-- This allows the trigger to insert new role records
grant insert
  on table public.user_roles
  to supabase_auth_admin;

-- Step 5: Also grant SELECT so the auth system can read roles
grant select
  on table public.user_roles
  to supabase_auth_admin;

-- ============================================
-- FIX COMPLETE
-- ============================================
-- The trigger will now work correctly when creating users.
-- You can now create users via:
-- 1. Supabase Dashboard (Authentication → Users → Add User)
-- 2. Auth API (if email signup is enabled)
-- ============================================

