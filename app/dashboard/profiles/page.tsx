'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { CustomerSearchResult } from '@/lib/types/database'

export default function ProfilesPage() {
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  // Search customers
  useEffect(() => {
    const searchCustomers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        setShowDropdown(false)
        return
      }

      const { data, error } = await supabase.rpc('search_customers', {
        search_query: searchQuery
      })

      if (!error && data) {
        setSearchResults(data)
        setShowDropdown(true)
      }
    }

    const timeoutId = setTimeout(searchCustomers, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Customer Profiles</h1>
        </div>
      </header>

      {/* Search */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Search Customer</h2>
          
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type customer name to search..."
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-lg text-avmoto-gray font-medium placeholder:text-gray-400"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {showDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-slate-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((customer) => (
                    <Link
                      key={customer.id}
                      href={`/dashboard/profiles/${customer.id}`}
                      className="block w-full px-6 py-4 text-left hover:bg-purple-50 border-b last:border-b-0 transition-colors"
                    >
                      <div className="font-semibold text-slate-900 text-lg mb-1">
                        {customer.first_name} {customer.middle_initial ? customer.middle_initial + '. ' : ''}{customer.last_name}
                      </div>
                      <div className="text-sm text-slate-600 mb-1">
                        {customer.email}
                      </div>
                      <div className="text-sm text-slate-500">
                        {customer.phone_number} • {customer.unit_count} motorcycle unit{customer.unit_count !== 1 ? 's' : ''}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-slate-600">
                    <p className="mb-4">No customers found</p>
                    <Link
                      href="/dashboard/customers/new"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      + Create New Customer
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {!searchQuery && (
            <div className="mt-8 text-center text-slate-600">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Start typing to search for a customer profile</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

