# 🚀 Quick Deploy - Final Steps

## ✅ Your Project is Ready!

All configuration is complete. Here's what you need to do:

---

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Fix: Add public directory, vercel.json, and update env config"
git push origin main
```

---

## Step 2: Add Environment Variables to Vercel

Go to your Vercel project → **Settings** → **Environment Variables**

Add these **TWO** variables with the **EXACT** names below:

### Variable 1:
```
Name:  NEXT_PUBLIC_SUPABASE_URL
Value: https://fejnfhmhqjzrzxfoiqfc.supabase.co
```

### Variable 2:
```
Name:  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlam5maG1ocWp6cnp4Zm9pcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjY1OTcsImV4cCI6MjA3NzI0MjU5N30.T7oVC7Q28qgSncC_MOr5NX5F-S4AWPr7gzkUeZRgWmI
```

**Important:** Make sure the variable names start with `NEXT_PUBLIC_` - this is required!

---

## Step 3: Redeploy

After adding the variables:
1. Go to **Deployments** tab
2. Click the three dots (**•••**)
3. Click **Redeploy**

---

## Step 4: Configure Supabase

In Supabase Dashboard → Authentication → URL Configuration:

1. **Site URL:** Your Vercel deployment URL
2. **Redirect URLs:** Add `https://your-vercel-url.vercel.app/auth/callback`

---

## Step 5: Run Database Schema

In Supabase SQL Editor, run these files in order:
1. `supabase/schemas/01_user_roles.sql`
2. `supabase/schemas/02_customers.sql`
3. `supabase/schemas/03_units.sql`
4. `supabase/schemas/04_jobs.sql`
5. `supabase/schemas/05_functions.sql`

---

## Step 6: Create Admin User

Sign up on your site, then in Supabase SQL Editor:

```sql
-- Find your user
SELECT id, email FROM auth.users;

-- Make admin
INSERT INTO public.user_roles (id, role) 
VALUES ('your-user-id-here', 'admin');
```

---

## 🎉 Done!

Your Motorshop CRM will be live and fully functional!

**See `VERCEL_ENV_SETUP.md` for detailed instructions.**

