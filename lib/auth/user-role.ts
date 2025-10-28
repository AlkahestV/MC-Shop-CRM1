import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/types/database'

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !data) return null
  return data.role as UserRole
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'admin'
}

