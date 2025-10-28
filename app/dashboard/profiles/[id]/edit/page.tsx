import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getUserRole } from '@/lib/auth/user-role'
import EditProfileForm from '@/components/EditProfileForm'

export default async function EditProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = await getUserRole()
  if (role !== 'admin') {
    redirect('/dashboard')
  }

  // Get customer and units
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', params.id)
    .single()

  if (customerError || !customer) {
    notFound()
  }

  const { data: units } = await supabase
    .from('units')
    .select('*')
    .eq('customer_id', params.id)
    .order('created_at', { ascending: true })

  return <EditProfileForm customer={customer} units={units || []} />
}

