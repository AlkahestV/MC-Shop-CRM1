# ⚡ Quick Start - Get Running in 5 Minutes!

## Step 1: Install Dependencies (1 min)
\`\`\`bash
cd motorshop-crm
npm install
\`\`\`

## Step 2: Set Up Supabase (2 min)

### A. Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Wait for project to initialize (~2 minutes)

### B. Get Credentials
- Project Settings → API
- Copy:
  - Project URL
  - Anon/Public key

### C. Update `.env.local`
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
\`\`\`

## Step 3: Create Database (2 min)

In Supabase → SQL Editor, run these files **in order**:

1. Copy/paste `supabase/schemas/01_user_roles.sql` → Run
2. Copy/paste `supabase/schemas/02_customers.sql` → Run  
3. Copy/paste `supabase/schemas/03_units.sql` → Run
4. Copy/paste `supabase/schemas/04_jobs.sql` → Run
5. Copy/paste `supabase/schemas/05_functions.sql` → Run

✅ All should execute without errors

## Step 4: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000

## Step 5: Create First User

### Option A: Via Supabase Dashboard (Recommended)
1. Supabase → Authentication → Users → Invite User
2. Enter your email
3. Check email and set password
4. Make yourself admin:
\`\`\`sql
-- In Supabase SQL Editor
INSERT INTO public.user_roles (id, role) 
VALUES ('your-user-id-from-auth-users', 'admin');
\`\`\`

### Option B: Quick Dev Setup (Testing Only)
1. Temporarily disable auth check in `middleware.ts` (comment out redirect)
2. Visit http://localhost:3000/login
3. Try to sign in - it will fail but log errors
4. In Supabase → Authentication → Sign Up
5. Re-enable middleware
6. Add role via SQL (see above)

## 🎉 Done!

You can now:
- ✅ Login at http://localhost:3000/login
- ✅ Create customers with motorcycles
- ✅ Create service jobs
- ✅ View customer profiles and history

## Common Commands

\`\`\`bash
# Development
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Deploy to Vercel
npx vercel
\`\`\`

## Test the App

1. **Create a Test Customer**:
   - Dashboard → Customer Management → New Customer
   - Name: "John Smith"
   - Email: "john@example.com"
   - Phone: "555-1234"
   - Address: "123 Main St"
   - Add Unit: 2023 Honda CB500X, Plate: ABC123

2. **Create a Test Job**:
   - Dashboard → Create Job
   - Search "John Smith"
   - Select customer and unit
   - Date: Today
   - Duration: 2 hours
   - Add work: "Oil change and tire inspection"
   - Products: "10W-40 oil, oil filter"
   - Save

3. **View Profile**:
   - Dashboard → Customer Profiles
   - Search "John Smith"
   - See complete history!

## Troubleshooting

### "No function found"
→ Run all SQL files in `supabase/schemas/` in order

### "Access denied"  
→ Check user has role in `user_roles` table

### "Can't login"
→ Verify environment variables are correct

### "Redirect loop"
→ Clear cookies, check middleware.ts is correct

## Need Help?

- 📖 Full docs: `README.md`
- 🛠️ Detailed setup: `SETUP_GUIDE.md`  
- 📋 Project info: `PROJECT_SUMMARY.md`

---

**You're ready to go! Happy coding! 🚀**

