# Quick Vercel Setup Guide

## 🚨 IMPORTANT: Run This First

Before deploying or testing, install dependencies:

```bash
npm install
```

## ⚡ Quick Steps to Deploy

### 1. Set Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

### 2. Push to GitHub

```bash
git add .
git commit -m "Fix: Add all required config files for Vercel deployment"
git push origin main
```

### 3. Configure Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon key
5. Click **Save**

### 4. Redeploy

- Go to **Deployments** tab
- Click the three dots (**•••**) on the latest deployment
- Click **Redeploy**
- Wait for the build to complete ✅

## ✅ What Was Fixed

Your project was missing these critical files (now added):

| File | Purpose |
|------|---------|
| `package.json` | Lists all dependencies (Next.js, React, Supabase, etc.) |
| `tsconfig.json` | TypeScript configuration |
| `next.config.js` | Next.js settings |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS for Tailwind |
| `app/layout.tsx` | Root layout component (required) |
| `app/globals.css` | Global styles with Tailwind directives |
| `.gitignore` | Excludes `context and guides/` from Git |
| `env.example` | Template for environment variables |

## 🔍 Testing Locally

```bash
# Install dependencies
npm install

# Create .env.local with your Supabase credentials
cp env.example .env.local
# Edit .env.local and add your actual values

# Start development server
npm run dev

# Visit http://localhost:3000
```

## 📦 Dependencies Installed

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase SSR** - Authentication with server-side rendering
- **@types/node** - Node.js type definitions (fixes `process.env` errors)

## 🎯 The Original Error (Now Fixed)

```
middleware.ts(1,36): error TS2307: Cannot find module '@supabase/ssr'
middleware.ts(2,48): error TS2307: Cannot find module 'next/server'
middleware.ts(10,5): error TS2580: Cannot find name 'process'
```

**What was wrong:**
- No `package.json` → Vercel didn't know what to install
- No `@types/node` → TypeScript didn't recognize `process`
- No config files → Next.js couldn't build properly

**All fixed!** ✅

## 🔐 Important: Supabase Redirect URLs

After deploying, update Supabase settings:

1. Go to https://supabase.com/dashboard
2. Select your project
3. **Authentication** → **URL Configuration**
4. Update:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add `https://your-app.vercel.app/auth/callback`

## 🎉 Done!

Your deployment should now succeed. If you encounter any issues, check:

1. Environment variables are set in Vercel
2. Supabase redirect URLs are configured
3. Database schema is set up (run SQL files in Supabase)

---

**Pro Tip:** After deploying successfully, run `npm run build` locally before future deployments to catch build errors early.

