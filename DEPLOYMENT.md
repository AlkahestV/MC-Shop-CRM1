# Deployment Guide for Vercel

## ✅ Issues Fixed

The following issues have been resolved:

1. ✅ Added `package.json` with all required dependencies
2. ✅ Added `@types/node` to fix TypeScript errors with `process.env`
3. ✅ Added `@supabase/ssr` dependency
4. ✅ Added `next/server` types
5. ✅ Created `tsconfig.json` for TypeScript configuration
6. ✅ Created `next.config.js` for Next.js configuration
7. ✅ Created `tailwind.config.js` for Tailwind CSS
8. ✅ Created `postcss.config.js` for PostCSS
9. ✅ Created `app/layout.tsx` root layout
10. ✅ Created `app/globals.css` with Tailwind directives
11. ✅ Created `.gitignore` to exclude `context and guides/` folder

## 🚀 Before Deploying to Vercel

### 1. Install Dependencies Locally

```bash
npm install
```

This will install all the required packages:
- `next` (^15.0.3)
- `react` (^19.0.0)
- `react-dom` (^19.0.0)
- `@supabase/ssr` (^0.5.2)
- `@supabase/supabase-js` (^2.45.4)
- `typescript` (^5.6.3)
- `@types/node` (^22.8.6)
- `@types/react` (^18.3.12)
- `@types/react-dom` (^18.3.1)
- `tailwindcss` (^3.4.14)
- And more...

### 2. Create Environment Variables File

Copy the example file and add your Supabase credentials:

```bash
cp env.example .env.local
```

Then edit `.env.local` and add your actual Supabase URL and key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

Get these values from: https://supabase.com/dashboard/project/_/settings/api

### 3. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 to ensure everything works.

### 4. Build Test (Optional but Recommended)

```bash
npm run build
```

This ensures there are no build errors before deploying.

## 📤 Deploying to Vercel

### Option 1: Deploy via Git (Recommended)

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add configuration files and fix Vercel deployment"
   git push origin main
   ```

2. **Vercel will automatically detect the push and start building**

3. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project in Vercel
   - Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Click "Save"

4. **Redeploy** (if already deployed):
   - Go to Deployments tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Deploy
vercel

# Add environment variables when prompted or via dashboard
```

## 🔧 Supabase Configuration

After deploying, update your Supabase redirect URLs:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Authentication → URL Configuration
4. Add your Vercel deployment URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: 
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local development)

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site loads without errors
- [ ] Login page is accessible
- [ ] Can sign in with credentials
- [ ] Redirects work properly
- [ ] Dashboard loads for authenticated users
- [ ] All navigation works
- [ ] Database operations work (create customer, create job, etc.)

## 🐛 Troubleshooting

### Build Fails with "Cannot find module"

- Ensure `package.json` is committed
- Check that all dependencies are listed
- Try: `npm install` locally to verify

### Environment Variables Not Found

- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Authentication Issues

- Check Supabase redirect URLs are correct
- Verify environment variables are correct
- Check Supabase project is active

### TypeScript Errors

- Run `npm run build` locally to see detailed errors
- Ensure `tsconfig.json` is committed
- Check that `@types/node` is in devDependencies

## 📁 What NOT to Commit

The following are automatically excluded via `.gitignore`:

- `node_modules/`
- `.next/`
- `.env.local`
- `context and guides/` (local documentation only)

## 🎉 Success!

Once deployed, your Motorshop CRM will be live at:
`https://your-app.vercel.app`

For local development, continue using:
`http://localhost:3000`

---

**Need help?** Check the main README.md and SETUP_GUIDE.md for more information.

