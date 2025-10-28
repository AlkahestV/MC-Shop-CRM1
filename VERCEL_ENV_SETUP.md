# ✅ Vercel Environment Variables Setup

## 🎯 Your Supabase Project is Ready!

Based on your environment variables, here's what you need to add to Vercel.

---

## 📝 Add These TWO Variables to Vercel

Go to your Vercel project → **Settings** → **Environment Variables**

### Variable 1: Supabase URL
```
Name:  NEXT_PUBLIC_SUPABASE_URL
Value: https://fejnfhmhqjzrzxfoiqfc.supabase.co
```

### Variable 2: Supabase Anon Key (Public Key)
```
Name:  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlam5maG1ocWp6cnp4Zm9pcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjY1OTcsImV4cCI6MjA3NzI0MjU5N30.T7oVC7Q28qgSncC_MOr5NX5F-S4AWPr7gzkUeZRgWmI
```

---

## 🔐 Important: Variable Names Matter!

Your project uses these specific variable names:
- `NEXT_PUBLIC_SUPABASE_URL` (not AVMOTO_SUPABASE_URL)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not AVMOTOSUPABASE_ANON_KEY)

The `NEXT_PUBLIC_` prefix is **required** for Next.js to expose these variables to the client-side code.

---

## ✅ Step-by-Step: Add to Vercel

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on **MC-Shop-CRM1**

### 3. Go to Settings
Click **Settings** in the top menu

### 4. Environment Variables
Click **Environment Variables** in the left sidebar

### 5. Add First Variable
- Click **Add New**
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://fejnfhmhqjzrzxfoiqfc.supabase.co`
- **Environments:** Check all (Production, Preview, Development)
- Click **Save**

### 6. Add Second Variable
- Click **Add New** again
- **Key:** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlam5maG1ocWp6cnp4Zm9pcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjY1OTcsImV4cCI6MjA3NzI0MjU5N30.T7oVC7Q28qgSncC_MOr5NX5F-S4AWPr7gzkUeZRgWmI`
- **Environments:** Check all (Production, Preview, Development)
- Click **Save**

---

## 🔄 Redeploy After Adding Variables

After adding both variables:

1. Go to the **Deployments** tab
2. Click the three dots (**•••**) on the latest deployment
3. Click **Redeploy**
4. Wait for the build to complete

---

## 🗄️ Configure Supabase Redirect URLs

In your Supabase Dashboard:

1. Go to https://supabase.com/dashboard
2. Select your project (fejnfhmhqjzrzxfoiqfc)
3. **Authentication** → **URL Configuration**
4. Set **Site URL:** `https://your-vercel-url.vercel.app`
5. Add to **Redirect URLs:**
   - `https://your-vercel-url.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)
6. Click **Save**

---

## 📊 Database Setup

If you haven't already, run these SQL files in Supabase SQL Editor (in order):

1. `supabase/schemas/01_user_roles.sql`
2. `supabase/schemas/02_customers.sql`
3. `supabase/schemas/03_units.sql`
4. `supabase/schemas/04_jobs.sql`
5. `supabase/schemas/05_functions.sql`

---

## 👤 Create Your First Admin User

### Step 1: Sign Up
Visit your deployed site and try to sign up (or use Supabase Dashboard → Authentication → Users)

### Step 2: Make Them Admin
In Supabase SQL Editor:

```sql
-- Find your user ID
SELECT id, email FROM auth.users;

-- Make them an admin (replace 'your-user-id' with the actual ID)
INSERT INTO public.user_roles (id, role) 
VALUES ('your-user-id', 'admin');
```

---

## ✅ Verification

After redeploying:
- [ ] Site loads without errors
- [ ] Login page appears
- [ ] Can sign in/sign up
- [ ] Redirects work properly
- [ ] Dashboard loads
- [ ] Can create customers
- [ ] Can create jobs
- [ ] Can view profiles

---

## 🆘 Troubleshooting

### "Invalid API key" or similar errors
- Double-check the variable names are exactly:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Make sure there are no extra spaces in the values
- Redeploy after adding/updating variables

### Authentication doesn't work
- Check Supabase redirect URLs include your Vercel domain
- Verify both environment variables are set in Vercel
- Check Supabase project is active (not paused)

### Can't access database
- Ensure all SQL schema files were run in Supabase
- Check RLS policies are enabled
- View Supabase logs for errors

---

## 🎉 You're Almost Done!

Once you:
1. ✅ Add the two environment variables to Vercel
2. ✅ Redeploy
3. ✅ Configure Supabase redirect URLs
4. ✅ Run the database schema files
5. ✅ Create an admin user

Your Motorshop CRM will be fully functional! 🚀

