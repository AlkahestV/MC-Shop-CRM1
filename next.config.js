/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only provide defaults if env vars are completely missing (for build testing)
  // Vercel's actual environment variables will override these
  env: process.env.NEXT_PUBLIC_SUPABASE_URL ? {} : {
    NEXT_PUBLIC_SUPABASE_URL: 'https://fejnfhmhqjzrzxfoiqfc.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlam5maG1ocWp6cnp4Zm9pcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjY1OTcsImV4cCI6MjA3NzI0MjU5N30.T7oVC7Q28qgSncC_MOr5NX5F-S4AWPr7gzkUeZRgWmI',
  },
}

module.exports = nextConfig

