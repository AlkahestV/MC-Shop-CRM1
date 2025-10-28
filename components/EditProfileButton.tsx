'use client'

import Link from 'next/link'

export default function EditProfileButton({ customerId }: { customerId: string }) {
  return (
    <Link
      href={`/dashboard/profiles/${customerId}/edit`}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
    >
      Edit Profile
    </Link>
  )
}

