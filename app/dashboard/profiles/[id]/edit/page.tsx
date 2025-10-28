import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getUserRole } from '@/lib/auth/user-role'
import EditProfileForm from '@/components/EditProfileForm'

export const dynamic = 'force-dynamic'

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = await getUserRole()
  if (role !== 'admin') {
    redirect('/dashboard')
  }

  const { id } = await params

  // Get customer and units
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (customerError || !customer) {
    notFound()
  }

  const { data: units } = await supabase
    .from('units')
    .select('*')
    .eq('customer_id', id)
    .order('created_at', { ascending: true })

  return <EditProfileForm customer={customer} units={units || []} />
}

