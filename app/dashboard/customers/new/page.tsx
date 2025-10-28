'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Unit {
  brand: string
  model: string
  year: string
  plate_number: string
}

export default function NewCustomerPage() {
  const router = useRouter()
  const supabase = createClient()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleInitial, setMiddleInitial] = useState('')
  const [address, setAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [units, setUnits] = useState<Unit[]>([
    { brand: '', model: '', year: '', plate_number: '' }
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const addUnit = () => {
    setUnits([...units, { brand: '', model: '', year: '', plate_number: '' }])
  }

  const removeUnit = (index: number) => {
    if (units.length > 1) {
      setUnits(units.filter((_, i) => i !== index))
    }
  }

  const updateUnit = (index: number, field: keyof Unit, value: string) => {
    const newUnits = [...units]
    newUnits[index][field] = value
    setUnits(newUnits)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate units
      const validUnits = units.filter(u => u.brand && u.model && u.year && u.plate_number)
      if (validUnits.length === 0) {
        setError('Please add at least one complete motorcycle unit')
        setLoading(false)
        return
      }

      // Create customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          first_name: firstName,
          last_name: lastName,
          middle_initial: middleInitial || null,
          address,
          phone_number: phoneNumber,
          email,
        })
        .select()
        .single()

      if (customerError) throw customerError

      // Create units
      const unitsToInsert = validUnits.map(unit => ({
        customer_id: customer.id,
        brand: unit.brand,
        model: unit.model,
        year: parseInt(unit.year),
        plate_number: unit.plate_number,
      }))

      const { error: unitsError } = await supabase
        .from('units')
        .insert(unitsToInsert)

      if (unitsError) throw unitsError

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/customers')
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the customer')
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Customer Created!</h2>
          <p className="text-slate-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-avmoto-blue to-avmoto-blue-dark shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard/customers" className="text-white/80 hover:text-white text-sm font-medium mb-2 inline-block transition-colors">
            ← Back to Customer Management
          </Link>
          <h1 className="text-3xl font-bold text-white">New Customer</h1>
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

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">Customer Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Middle Initial
                </label>
                <input
                  type="text"
                  value={middleInitial}
                  onChange={(e) => setMiddleInitial(e.target.value.slice(0, 1))}
                  maxLength={1}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Motorcycle Units */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-slate-900">Motorcycle Units</h2>
              <button
                type="button"
                onClick={addUnit}
                className="px-4 py-2 bg-gradient-to-r from-avmoto-blue to-avmoto-blue-dark hover:from-avmoto-blue-dark hover:to-avmoto-blue text-white text-sm font-bold rounded-lg transition-all shadow-md"
              >
                + Add Unit
              </button>
            </div>

            {units.map((unit, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-slate-900">Unit {index + 1}</h3>
                  {units.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={unit.brand}
                      onChange={(e) => updateUnit(index, 'brand', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={unit.model}
                      onChange={(e) => updateUnit(index, 'model', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={unit.year}
                      onChange={(e) => updateUnit(index, 'year', e.target.value)}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Plate Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={unit.plate_number}
                      onChange={(e) => updateUnit(index, 'plate_number', e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-avmoto-blue focus:border-avmoto-blue outline-none text-avmoto-gray font-medium placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard/customers"
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-avmoto-blue to-avmoto-blue-dark hover:from-avmoto-blue-dark hover:to-avmoto-blue text-white font-bold rounded-lg transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
            >
              {loading ? 'Creating Customer...' : 'Create Customer'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

