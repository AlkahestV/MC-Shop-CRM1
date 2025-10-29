'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CustomerSearchResult, Unit } from '@/lib/types/database'

interface JobItem {
  description: string
  products_used: string
}

export default function CreateJobPage() {
  const router = useRouter()
  const supabase = createClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSearchResult | null>(null)
  const [customerUnits, setCustomerUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<string>('')
  const [workDate, setWorkDate] = useState('')
  const [duration, setDuration] = useState('')
  const [remarks, setRemarks] = useState('')
  const [jobItems, setJobItems] = useState<JobItem[]>([
    { description: '', products_used: '' }
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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

  // Load customer units when customer is selected
  useEffect(() => {
    const loadUnits = async () => {
      if (!selectedCustomer) return

      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('customer_id', selectedCustomer.id)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setCustomerUnits(data)
        // Auto-select if only one unit
        if (data.length === 1) {
          setSelectedUnit(data[0].id)
        }
      }
    }

    loadUnits()
  }, [selectedCustomer, supabase])

  const selectCustomer = (customer: CustomerSearchResult) => {
    setSelectedCustomer(customer)
    setSearchQuery(`${customer.first_name} ${customer.last_name}`)
    setShowDropdown(false)
  }

  const addJobItem = () => {
    setJobItems([...jobItems, { description: '', products_used: '' }])
  }

  const removeJobItem = (index: number) => {
    if (jobItems.length > 1) {
      setJobItems(jobItems.filter((_, i) => i !== index))
    }
  }

  const updateJobItem = (index: number, field: keyof JobItem, value: string) => {
    const newItems = [...jobItems]
    newItems[index][field] = value
    setJobItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!selectedCustomer) {
        throw new Error('Please select a customer')
      }

      if (!selectedUnit) {
        throw new Error('Please select a unit')
      }

      // Validate job items
      const validItems = jobItems.filter(item => item.description.trim())
      if (validItems.length === 0) {
        throw new Error('Please add at least one job item')
      }

      // Create job
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          customer_id: selectedCustomer.id,
          unit_id: selectedUnit,
          work_date: workDate,
          duration_hours: parseFloat(duration),
          remarks: remarks || null,
        })
        .select()
        .single()

      if (jobError) throw jobError

      // Create job items
      const itemsToInsert = validItems.map(item => ({
        job_id: job.id,
        description: item.description,
        products_used: item.products_used || null,
      }))

      const { error: itemsError } = await supabase
        .from('job_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the job')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Created!</h2>
          <p className="text-slate-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create Job</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Customer Selection */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Customer Selection</h2>
            
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Customer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedCustomer(null)
                  setSelectedUnit('')
                }}
                placeholder="Type customer name..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
              />
              
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => selectCustomer(customer)}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b last:border-b-0"
                      >
                        <div className="font-medium text-slate-900">
                          {customer.first_name} {customer.middle_initial ? customer.middle_initial + '. ' : ''}{customer.last_name}
                        </div>
                        <div className="text-sm text-slate-600">
                          {customer.email} • {customer.unit_count} unit(s)
                        </div>
                      </button>
                    ))
                  ) : (
                    <Link
                      href="/dashboard/customers/new"
                      className="block w-full px-4 py-3 text-center text-blue-600 hover:bg-blue-50"
                    >
                      + New Customer
                    </Link>
                  )}
                </div>
              )}
            </div>

            {selectedCustomer && customerUnits.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium"
                >
                  <option value="">Select a unit...</option>
                  {customerUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.year} {unit.brand} {unit.model} ({unit.plate_number})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Job Details */}
          {selectedCustomer && selectedUnit && (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Job Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Work Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={workDate}
                      onChange={(e) => setWorkDate(e.target.value)}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duration (hours) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                      placeholder="Additional notes or observations..."
                    />
                  </div>
                </div>
              </div>

              {/* Job Items */}
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-xl font-semibold text-slate-900">Work Items</h2>
                  <button
                    type="button"
                    onClick={addJobItem}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    + Add Item
                  </button>
                </div>

                {jobItems.map((item, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-slate-900">Item {index + 1}</h3>
                      {jobItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeJobItem(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Work Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateJobItem(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                          placeholder="Describe the work performed..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Products Used
                        </label>
                        <input
                          type="text"
                          value={item.products_used}
                          onChange={(e) => updateJobItem(index, 'products_used', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                          placeholder="List products or parts used..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Job...' : 'Save Job'}
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  )
}

