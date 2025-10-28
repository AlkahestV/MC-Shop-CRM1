-- ============================================
-- CHANGE USER PASSWORD
-- ============================================
-- Use this SQL to change a user's password in Supabase
-- Replace 'user@example.com' and 'new_password' with actual values
-- ============================================

-- Option 1: Change password by email (Recommended)
-- This uses Supabase's built-in password hashing
UPDATE auth.users
SET 
  encrypted_password = crypt('new_password', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'user@example.com';

-- ============================================

-- Option 2: Change password by user ID
-- Use this if you know the user's ID
UPDATE auth.users
SET 
  encrypted_password = crypt('new_password', gen_salt('bf')),
  updated_at = NOW()
WHERE id = 'user-uuid-here';

-- ============================================

-- Option 3: Change password for current logged-in admin user
-- Useful if you're testing and need to reset your own password
UPDATE auth.users
SET 
  encrypted_password = crypt('new_password', gen_salt('bf')),
  updated_at = NOW()
WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid());

-- ============================================
-- VERIFY THE CHANGE
-- ============================================
-- Check when password was last updated
SELECT email, updated_at
FROM auth.users
WHERE email = 'user@example.com';

-- ============================================
-- EXAMPLE: Reset password for specific user
-- ============================================
-- Step-by-step example:

-- 1. Find the user
SELECT id, email, created_at
FROM auth.users
WHERE email = 'user@example.com';

-- 2. Change their password
UPDATE auth.users
SET 
  encrypted_password = crypt('NewSecurePassword123!', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'user@example.com';

-- 3. Verify it worked
SELECT email, updated_at
FROM auth.users
WHERE email = 'user@example.com';

-- ============================================
-- NOTES
-- ============================================
-- - Use strong passwords (mix of upper/lower/numbers/symbols)
-- - The password is automatically hashed using bcrypt
-- - User can login immediately with the new password
-- - No email notification is sent (manual password change)
-- ============================================

