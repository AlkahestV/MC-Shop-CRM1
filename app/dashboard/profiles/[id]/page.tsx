import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getUserRole } from '@/lib/auth/user-role'
import EditProfileButton from '@/components/EditProfileButton'
import DeleteJobButton from '@/components/DeleteJobButton'

export const dynamic = 'force-dynamic'

export default async function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = await getUserRole()
  const { id } = await params

  // Get customer profile with jobs
  const { data: profile, error } = await supabase.rpc('get_customer_profile', {
    customer_id: id
  })

  if (error || !profile) {
    notFound()
  }

  // Supabase automatically parses JSON, so profile is already an object
  const customer = profile.customer
  const units = profile.units || []
  const jobs = profile.jobs || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard/profiles" className="text-purple-600 hover:text-purple-700 text-sm font-medium mb-2 inline-block">
            ← Back to Profiles
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Customer Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {customer.first_name} {customer.middle_initial ? customer.middle_initial + '. ' : ''}{customer.last_name}
            </h2>
            {role === 'admin' && (
              <EditProfileButton customerId={customer.id} />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Email</p>
              <p className="text-slate-900">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Phone Number</p>
              <p className="text-slate-900">{customer.phone_number}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-slate-600 mb-1">Address</p>
              <p className="text-slate-900">{customer.address}</p>
            </div>
          </div>
        </div>

        {/* Motorcycle Units */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b pb-2">Motorcycle Units</h2>
          
          {units.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {units.map((unit: any) => (
                <div key={unit.id} className="p-4 border border-slate-200 rounded-lg">
                  <h3 className="font-semibold text-slate-900 text-lg mb-2">
                    {unit.year} {unit.brand} {unit.model}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Plate Number: <span className="font-medium text-slate-900">{unit.plate_number}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No units registered</p>
          )}
        </div>

        {/* Job History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b pb-2">Job History</h2>
          
          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job: any) => (
                <div key={job.id} className="p-6 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-lg font-semibold text-slate-900">
                          {new Date(job.work_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {job.duration_hours} {job.duration_hours === 1 ? 'hour' : 'hours'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        Unit: {job.unit.year} {job.unit.brand} {job.unit.model} ({job.unit.plate_number})
                      </p>
                    </div>
                    {role === 'admin' && (
                      <DeleteJobButton jobId={job.id} />
                    )}
                  </div>

                  {/* Job Items */}
                  <div className="space-y-3 mb-3">
                    {job.items && job.items.map((item: any) => (
                      <div key={item.id} className="pl-4 border-l-2 border-blue-500">
                        <p className="text-slate-900 mb-1">{item.description}</p>
                        {item.products_used && (
                          <p className="text-sm text-slate-600">
                            Products: <span className="font-medium">{item.products_used}</span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Remarks */}
                  {job.remarks && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-700 mb-1">Remarks:</p>
                      <p className="text-sm text-slate-600">{job.remarks}</p>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-3">
                    Created: {new Date(job.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">No service history yet</p>
              <Link
                href="/dashboard/jobs/create"
                className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Create First Job
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

