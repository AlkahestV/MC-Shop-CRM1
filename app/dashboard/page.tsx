import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/user-role'
import LogoutButton from '@/components/LogoutButton'
import DashboardCards from '@/components/DashboardCards'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = await getUserRole()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-avmoto-blue opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-avmoto-blue opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white shadow-sm border-b-2 border-avmoto-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-avmoto-blue to-avmoto-blue-dark bg-clip-text text-transparent">
              AVMOTO CRM
            </h1>
            <p className="text-sm text-avmoto-gray-light font-medium mt-1">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 ${role === 'admin' ? 'bg-gradient-to-r from-avmoto-blue to-avmoto-blue-dark' : 'bg-avmoto-gray'} text-white text-sm font-bold rounded-full shadow-lg`}>
              {role === 'admin' ? '⚡ Admin' : '👤 Staff'}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-avmoto-gray mb-2">Dashboard</h2>
          <p className="text-avmoto-gray-light text-lg">Suspension Engineering & Service Management</p>
        </div>

        {/* Animated Feature Cards */}
        <DashboardCards />
      </main>
    </div>
  )
}

