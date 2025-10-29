# Deployment Guide

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy

Vercel will automatically build and deploy when you push to GitHub.

### 3. Add Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables**

Add these two variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://fejnfhmhqjzrzxfoiqfc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlam5maG1ocWp6cnp4Zm9pcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjY1OTcsImV4cCI6MjA3NzI0MjU5N30.T7oVC7Q28qgSncC_MOr5NX5F-S4AWPr7gzkUeZRgWmI
```

### 4. Redeploy

After adding environment variables:
- Go to **Deployments** tab
- Click **Redeploy** on latest deployment

## Configure Supabase

In Supabase Dashboard → **Authentication** → **URL Configuration**:
- **Site URL**: Your Vercel URL
- **Redirect URLs**: Add `https://your-vercel-url.vercel.app/auth/callback`

## Run Database Schema

In Supabase SQL Editor, run this single file:
- `supabase/schema.sql`

This includes all tables, policies, triggers, and functions.

## Create Admin User

Sign up on your site, then in Supabase SQL Editor:

```sql
-- Find your user
SELECT id, email FROM auth.users;

-- Make admin
INSERT INTO public.user_roles (id, role) 
VALUES ('your-user-id-here', 'admin');
```

---

## Troubleshooting

### Customer/Job Creation Fails with RLS Error

If you're getting permission errors when creating customers or jobs, run this fix:

**For existing databases:** Run `supabase/fix_customer_rls.sql` in the SQL Editor

This fix is already included in `schema.sql` for new databases.

**What it does:**
- Adds a `SECURITY DEFINER` trigger to auto-set `created_by` field
- Prevents RLS policy failures when the client doesn't provide `created_by`

---

That's it! Your CRM is now live. 🚀

