'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="px-4 py-2 bg-gradient-to-r from-avmoto-gray to-avmoto-gray-dark hover:from-avmoto-gray-dark hover:to-avmoto-gray text-white text-sm font-bold rounded-lg transition-all shadow-lg"
    >
      Sign Out
    </motion.button>
  )
}

