import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-avmoto-blue to-avmoto-blue-dark shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/dashboard" className="text-white/80 hover:text-white text-sm font-medium mb-2 inline-block transition-colors">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-white">Customer Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* New Customer */}
          <Link
            href="/dashboard/customers/new"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border-2 border-gray-100 hover:border-avmoto-blue"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-avmoto-blue to-avmoto-blue-dark rounded-xl flex items-center justify-center mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-avmoto-gray mb-3 group-hover:text-avmoto-blue transition-colors">
              New Customer
            </h3>
            <p className="text-avmoto-gray-light font-medium leading-relaxed">
              Add a new customer profile with motorcycle unit information
            </p>
          </Link>

          {/* Create Job */}
          <Link
            href="/dashboard/jobs/create"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border-2 border-gray-100 hover:border-green-500"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-avmoto-gray mb-3 group-hover:text-green-600 transition-colors">
              Create Job
            </h3>
            <p className="text-avmoto-gray-light font-medium leading-relaxed">
              Record new service jobs for customer motorcycles
            </p>
          </Link>

          {/* View Profiles */}
          <Link
            href="/dashboard/profiles"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border-2 border-gray-100 hover:border-purple-500"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-avmoto-gray mb-3 group-hover:text-purple-600 transition-colors">
              Profiles
            </h3>
            <p className="text-avmoto-gray-light font-medium leading-relaxed">
              Search and view existing customer profiles and their job history
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}

