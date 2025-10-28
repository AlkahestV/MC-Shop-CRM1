# Motorshop CRM - Complete Setup Guide

## Quick Start (5 minutes)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project (note: this takes ~2 minutes)
4. Save your project URL and anon key

### 2. Configure Environment

In the project root, update `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
\`\`\`

### 3. Set Up Database

Go to your Supabase project → SQL Editor, and run each file in order:

#### Step 1: Run `supabase/schemas/01_user_roles.sql`
This creates the user roles table and policies.

#### Step 2: Run `supabase/schemas/02_customers.sql`
This creates the customers table.

#### Step 3: Run `supabase/schemas/03_units.sql`
This creates the motorcycle units table.

#### Step 4: Run `supabase/schemas/04_jobs.sql`
This creates the jobs and job items tables.

#### Step 5: Run `supabase/schemas/05_functions.sql`
This creates helper functions for search and profile retrieval.

### 4. Create Your First User

1. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

2. Open http://localhost:3000/login

3. You'll be redirected because no user exists. Go to Supabase Dashboard → Authentication → Users

4. Click "Invite user" or use this SQL to create a test user:
\`\`\`sql
-- Note: This creates a user without email verification
-- For production, use proper signup flow
\`\`\`

5. Better yet, temporarily disable RLS to sign up:
   - Go to Authentication → Policies
   - Sign up via the app at http://localhost:3000/login
   - Re-enable policies after signup

### 5. Make Your First User an Admin

In Supabase SQL Editor, run:

\`\`\`sql
-- First, find your user ID
SELECT id, email FROM auth.users;

-- Then insert into user_roles (replace 'your-user-id' with actual ID)
INSERT INTO public.user_roles (id, role) 
VALUES ('your-user-id', 'admin');
\`\`\`

### 6. You're Done! 🎉

Visit http://localhost:3000 and sign in.

## Detailed Setup Instructions

### Authentication Setup

The app uses Supabase Auth with email/password. To configure:

1. In Supabase Dashboard → Authentication → Settings:
   - Enable Email provider
   - Disable email confirmation for development (optional)
   - Set Site URL to http://localhost:3000
   - Add redirect URLs:
     - http://localhost:3000/auth/callback
     - https://your-production-domain.com/auth/callback

### Creating Additional Users

#### Method 1: Admin Panel (Recommended for Production)
1. Supabase Dashboard → Authentication → Users
2. Click "Invite user"
3. Enter email
4. User receives invitation email
5. Add role via SQL:
\`\`\`sql
INSERT INTO public.user_roles (id, role) 
VALUES ('new-user-id', 'staff'); -- or 'admin'
\`\`\`

#### Method 2: Direct SQL (Development Only)
\`\`\`sql
-- This bypasses email verification
-- Not recommended for production
\`\`\`

### Testing the Application

1. **Create a Customer**:
   - Dashboard → Customer Management → New Customer
   - Fill in: John Doe, john@example.com, etc.
   - Add a motorcycle: Honda, CB500X, 2023, ABC-1234
   - Submit

2. **Create a Job**:
   - Dashboard → Create Job
   - Search "John Doe"
   - Select customer
   - Choose the motorcycle
   - Enter work date and duration
   - Add job item: "Oil change and filter replacement"
   - Add products: "10W-40 Engine Oil, Oil Filter"
   - Submit

3. **View Profile**:
   - Dashboard → Customer Profiles
   - Search "John Doe"
   - See customer info, motorcycles, and job history

### Production Deployment

#### 1. Prepare Supabase for Production

- Ensure RLS is enabled on all tables ✅ (already done)
- Review and test all policies
- Set up proper email templates for auth
- Configure production site URL and redirect URLs

#### 2. Deploy to Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
\`\`\`

#### 3. Update Supabase Settings

In Supabase Dashboard → Authentication → Settings:
- Site URL: https://your-domain.vercel.app
- Redirect URLs: https://your-domain.vercel.app/auth/callback

### Troubleshooting

#### "Access denied" errors
- Check that RLS policies are correctly set up
- Verify user has a role in `user_roles` table
- Check Supabase logs for policy violations

#### "Function not found" errors
- Ensure all SQL files in `supabase/schemas/` were run
- Check function permissions (SECURITY DEFINER is set)

#### Authentication loops
- Clear cookies and localStorage
- Check middleware.ts is correctly configured
- Verify environment variables are set

#### Can't create customers/jobs
- Check user is authenticated
- Verify RLS policies allow insertion
- Check Supabase logs for errors

### Database Maintenance

#### Backup
Supabase automatically backs up your database. For manual backups:
1. Supabase Dashboard → Database → Backups
2. Click "Create backup"

#### View Logs
- Supabase Dashboard → Logs
- Filter by table or time range
- Use for debugging RLS policy issues

#### Monitor Performance
- Supabase Dashboard → Database → Query Performance
- Check slow queries
- Add indexes if needed (already optimized in schema)

### Security Checklist

- ✅ RLS enabled on all tables
- ✅ Authentication required for all routes (via middleware)
- ✅ Role-based access control implemented
- ✅ Sensitive operations restricted to admins
- ✅ Input validation on forms
- ✅ SQL injection protection (using Supabase client)
- ✅ XSS protection (React auto-escaping)
- ⚠️ Enable email verification in production
- ⚠️ Set up 2FA for admin accounts (optional)
- ⚠️ Review and test all policies before production

### Next Steps

1. Customize the branding (colors, logo)
2. Add your shop's information
3. Set up email templates in Supabase
4. Configure domain and SSL
5. Train staff on using the system
6. Set up regular database backups
7. Monitor usage and performance

Need help? Check the main README.md for more information.

