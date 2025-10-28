# Motorshop CRM

A modern, full-featured Customer Relationship Management system designed specifically for motorcycle shops. Built with Next.js 14, Supabase, and TypeScript.

## Features

### ✨ Core Functionality

- **Customer Management**: Create and manage customer profiles with complete contact information
- **Motorcycle Unit Tracking**: Track multiple motorcycles per customer with brand, model, year, and plate number
- **Job Management**: Record service jobs with detailed work items and product usage
- **Customer Profiles**: View complete customer history including all motorcycles and service jobs
- **Search Functionality**: Fast, real-time customer search with autocomplete
- **Role-Based Access Control**: 
  - **Staff**: Can create customers and jobs, view all profiles
  - **Admin**: Full access including edit/delete capabilities

### 🎨 User Experience

- Beautiful, modern UI with gradient backgrounds and smooth animations
- Responsive design that works on all devices
- Clean, intuitive navigation
- Real-time search with dropdown suggestions
- Form validation and error handling
- Success notifications

### 🔒 Security

- Supabase authentication with email/password
- Row Level Security (RLS) policies on all database tables
- Role-based access control for sensitive operations
- Secure session management with HTTP-only cookies

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with SSR
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd motorshop-crm
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
   - Copy \`.env.local\` and update with your Supabase credentials:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
\`\`\`

4. Set up the database:
   - Go to your Supabase project
   - Run the SQL files in the \`supabase/schemas/\` directory in order:
     - \`01_user_roles.sql\`
     - \`02_customers.sql\`
     - \`03_units.sql\`
     - \`04_jobs.sql\`
     - \`05_functions.sql\`

5. Create your first admin user:
   - Sign up through Supabase Auth
   - In Supabase SQL Editor, run:
\`\`\`sql
INSERT INTO public.user_roles (id, role) 
VALUES ('your-user-id', 'admin');
\`\`\`

6. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables

- **user_roles**: Maps users to their roles (staff/admin)
- **customers**: Customer contact information
- **units**: Motorcycle units owned by customers
- **jobs**: Service job records
- **job_items**: Individual work items within a job

### Functions

- \`search_customers()\`: Fast customer search with unit count
- \`get_customer_profile()\`: Retrieve complete customer profile with units and job history
- \`get_user_role()\`: Get user's role
- \`is_admin()\`: Check if user is admin

## Project Structure

\`\`\`
motorshop-crm/
├── app/
│   ├── dashboard/           # Main dashboard and features
│   │   ├── customers/       # Customer management
│   │   ├── jobs/            # Job creation
│   │   └── profiles/        # Customer profiles
│   ├── login/               # Authentication
│   └── auth/                # Auth callback
├── components/              # Reusable React components
├── lib/
│   ├── supabase/           # Supabase client utilities
│   ├── types/              # TypeScript type definitions
│   └── auth/               # Authentication helpers
├── supabase/
│   └── schemas/            # Database schema files
└── middleware.ts           # Auth middleware
\`\`\`

## Usage Guide

### For Staff Users

1. **Create a New Customer**:
   - Navigate to Customer Management
   - Click "New Customer"
   - Fill in customer details and at least one motorcycle unit
   - Click "Create Customer"

2. **Create a Job**:
   - Click "Create Job" from dashboard
   - Search and select a customer
   - Select the motorcycle unit
   - Enter job date, duration, and work items
   - Add multiple work items if needed
   - Click "Save Job"

3. **View Customer Profiles**:
   - Click "Customer Profiles"
   - Search for a customer
   - View their complete information, motorcycles, and service history

### For Admin Users

All staff features plus:
- Edit customer profiles
- Delete jobs (with confirmation)
- Manage user roles (via database)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Setup in Production

1. Ensure your Supabase project is in production mode
2. Run all schema files in order
3. Set up appropriate RLS policies (already included in schema files)
4. Create admin users as needed

## Security Notes

- Jobs can only be edited/deleted by admins (as per requirements)
- All database operations are protected by Row Level Security
- User sessions are managed securely with HTTP-only cookies
- Middleware ensures authentication on all protected routes

## Future Enhancements

- Inventory management system
- Reports and analytics
- Email notifications
- PDF invoice generation
- Parts catalog integration
- Service reminders
- Mobile app

## Contributing

This is a production CRM system. Please test thoroughly before making changes.

## License

Proprietary - All rights reserved

## Support

For support or questions, please contact the development team.

---

Built with ❤️ for motorcycle shops everywhere

