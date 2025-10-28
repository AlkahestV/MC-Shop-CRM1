# Deploy to Vercel BEFORE Setting Up Supabase

## ✅ Build Test: PASSED

Your project now builds successfully! You can deploy to Vercel first, then set up Supabase afterward.

---

## 🚀 Deployment Steps (In Order)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Fix: Add all config files and resolve build errors"
git push origin main
```

**Note:** The "context and guides" folder will NOT be pushed (it's excluded in `.gitignore`).

---

### Step 2: Deploy to Vercel

#### Option A: Automatic (if already connected)
- Vercel will automatically detect your push and start building
- The build will use placeholder environment variables
- Your site will be live (but won't work fully until Supabase is set up)

#### Option B: Manual Deployment
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your project: **MC-Shop-CRM1**
3. Click **Redeploy** on the latest deployment

---

### Step 3: Get Your Vercel URL

After deployment completes:
- Note your Vercel URL (e.g., `https://mc-shop-crm1.vercel.app`)
- You'll need this for Supabase configuration

---

### Step 4: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait ~2 minutes for the project to initialize
3. Go to **SQL Editor** in Supabase Dashboard
4. Run each SQL file in order from `supabase/schemas/`:
   - `01_user_roles.sql`
   - `02_customers.sql`
   - `03_units.sql`
   - `04_jobs.sql`
   - `05_functions.sql`

---

### Step 5: Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

---

### Step 6: Configure Supabase Redirect URLs

In Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

---

### Step 7: Add Environment Variables to Vercel

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add these TWO variables:

| Variable Name | Value | Where to Find |
|--------------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key | Supabase → Settings → API |

4. Click **Save**

---

### Step 8: Redeploy with Real Credentials

1. Go to **Deployments** tab in Vercel
2. Click the three dots (**•••**) on the latest deployment
3. Click **Redeploy**
4. Wait for build to complete

---

### Step 9: Create Your First User

1. Visit your live site: `https://your-app.vercel.app`
2. Click on the login page
3. Use Supabase Dashboard → **Authentication** → **Users** → **Invite user**
4. Or sign up if you've enabled it

---

### Step 10: Make Your First User an Admin

In Supabase **SQL Editor**, run:

```sql
-- Find your user ID
SELECT id, email FROM auth.users;

-- Make them an admin (replace 'your-user-id' with actual ID from above)
INSERT INTO public.user_roles (id, role) 
VALUES ('your-user-id', 'admin');
```

---

## 🎉 Done!

Your Motorshop CRM is now fully functional!

---

## 📝 Summary of What Was Fixed

### Build Errors Resolved:
1. ✅ Removed deprecated `swcMinify` from `next.config.js`
2. ✅ Fixed async params in Next.js 15 (dynamic routes)
3. ✅ Added `export const dynamic = 'force-dynamic'` to auth pages
4. ✅ Added fallback environment variables for build process

### Files Modified:
- `next.config.js` - Removed deprecated option, added env fallbacks
- `app/dashboard/page.tsx` - Added dynamic export
- `app/dashboard/customers/page.tsx` - Added dynamic export
- `app/dashboard/profiles/[id]/page.tsx` - Fixed async params, added dynamic export
- `app/dashboard/profiles/[id]/edit/page.tsx` - Fixed async params, added dynamic export

---

## 🔄 Local Development Setup (Later)

After setting up Supabase, to work locally:

1. **Copy environment template:**
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local`** and add your real Supabase credentials

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Visit:** http://localhost:3000

---

## 🆘 Troubleshooting

### Build succeeds but app doesn't work
- You need to add real Supabase credentials to Vercel
- Follow Steps 4-8 above

### Can't log in
- Check Supabase redirect URLs are correct
- Verify environment variables in Vercel match your Supabase project
- Check Supabase project is active and not paused

### Database errors
- Ensure all SQL files were run in order
- Check RLS policies are enabled
- View Supabase logs for details

---

## ✅ Build Test Results

```
✓ Compiled successfully in 3.3s
✓ Linting and checking validity of types
✓ Generating static pages (9/9)

Route (app)                                 Size  First Load JS
┌ ○ /                                      126 B         102 kB
├ ○ /_not-found                            993 B         103 kB
├ ƒ /auth/callback                         126 B         102 kB
├ ƒ /dashboard                             535 B         158 kB
├ ƒ /dashboard/customers                   161 B         106 kB
├ ○ /dashboard/customers/new             2.27 kB         160 kB
├ ○ /dashboard/jobs/create               2.79 kB         160 kB
├ ○ /dashboard/profiles                   1.5 kB         159 kB
├ ƒ /dashboard/profiles/[id]               872 B         158 kB
├ ƒ /dashboard/profiles/[id]/edit        1.73 kB         159 kB
└ ○ /login                               1.25 kB         155 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

✅ BUILD SUCCESSFUL
```

Your project is ready to deploy! 🚀

