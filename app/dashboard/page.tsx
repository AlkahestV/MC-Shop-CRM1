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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-avmoto-blue to-avmoto-blue-dark shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              AVMOTO CRM
            </h1>
            <p className="text-sm text-white/80 font-medium mt-1">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 ${role === 'admin' ? 'bg-white/20' : 'bg-white/10'} text-white text-sm font-bold rounded-lg backdrop-blur-sm`}>
              {role === 'admin' ? '⚡ Admin' : '👤 Staff'}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-avmoto-gray mb-2">Dashboard</h2>
          <p className="text-avmoto-gray-light text-lg">Suspension Engineering & Service Management</p>
        </div>

        {/* Animated Feature Cards */}
        <DashboardCards />
      </main>
    </div>
  )
}

