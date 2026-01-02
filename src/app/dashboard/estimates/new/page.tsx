'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface JobAddress {
  id: number
  streetAddress: string
  city: string
  state: string
  zip: string
}

interface Customer {
  id: number
  name: string
  phone: string
  jobAddresses: JobAddress[]
}

export default function NewEstimatePage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    customerId: '',
    jobAddressId: '',
    roofingType: 'shingles',
    hasAcUnit: false,
    hasFlatSection: false,
    pricingMethod: 'manual',
    manualPrice: '',
    pricePerSquare: '',
    totalSquares: '',
    wastePercentage: '0',
  })

  const selectedCustomer = customers.find((c) => c.id === parseInt(formData.customerId))

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/customers')
        const data = await res.json()
        setCustomers(data.customers || [])
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const calculateTotal = () => {
    if (formData.pricingMethod === 'manual') {
      return parseFloat(formData.manualPrice) || 0
    } else {
      const pricePerSquare = parseFloat(formData.pricePerSquare) || 0
      const totalSquares = parseFloat(formData.totalSquares) || 0
      const wastePercentage = parseFloat(formData.wastePercentage) || 0

      const basePrice = pricePerSquare * totalSquares
      const wasteAmount = basePrice * (wastePercentage / 100)
      return basePrice + wasteAmount
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: parseInt(formData.customerId),
          jobAddressId: parseInt(formData.jobAddressId),
          roofingType: formData.roofingType,
          hasAcUnit: formData.hasAcUnit,
          hasFlatSection: formData.hasFlatSection,
          pricingMethod: formData.pricingMethod,
          manualPrice: formData.pricingMethod === 'manual' ? formData.manualPrice : null,
          pricePerSquare:
            formData.pricingMethod === 'calculated' ? formData.pricePerSquare : null,
          totalSquares:
            formData.pricingMethod === 'calculated' ? formData.totalSquares : null,
          wastePercentage:
            formData.pricingMethod === 'calculated' ? formData.wastePercentage : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create estimate')
      }

      router.push(`/dashboard/estimates/${data.estimate.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create estimate')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">No Customers Yet</h2>
        <p className="text-gray-600 mb-6">
          You need to add a customer before creating an estimate.
        </p>
        <Link href="/dashboard/customers" className="btn-primary">
          Add Your First Customer
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Estimate</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Customer Selection */}
        <div>
          <label className="form-label">Select Customer *</label>
          <select
            required
            className="input-field"
            value={formData.customerId}
            onChange={(e) =>
              setFormData({ ...formData, customerId: e.target.value, jobAddressId: '' })
            }
          >
            <option value="">-- Select a customer --</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.phone}
              </option>
            ))}
          </select>
        </div>

        {/* Job Address Selection */}
        {selectedCustomer && (
          <div>
            <label className="form-label">Select Job Address *</label>
            {selectedCustomer.jobAddresses.length === 0 ? (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-yellow-800 text-sm mb-2">
                  This customer has no job addresses.
                </p>
                <Link
                  href="/dashboard/customers"
                  className="text-yellow-700 underline text-sm"
                >
                  Add a job address first
                </Link>
              </div>
            ) : (
              <select
                required
                className="input-field"
                value={formData.jobAddressId}
                onChange={(e) =>
                  setFormData({ ...formData, jobAddressId: e.target.value })
                }
              >
                <option value="">-- Select a job address --</option>
                {selectedCustomer.jobAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.streetAddress}, {address.city}, {address.state} {address.zip}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Roofing Type */}
        <div>
          <label className="form-label">Roofing Type *</label>
          <select
            required
            className="input-field"
            value={formData.roofingType}
            onChange={(e) => setFormData({ ...formData, roofingType: e.target.value })}
          >
            <option value="shingles">Shingles</option>
          </select>
        </div>

        {/* Options Checkboxes */}
        <div>
          <label className="form-label mb-3">Additional Options</label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                checked={formData.hasAcUnit}
                onChange={(e) =>
                  setFormData({ ...formData, hasAcUnit: e.target.checked })
                }
              />
              <span className="ml-3 text-gray-700">
                Rooftop AC Unit (includes disconnect/reconnect)
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                checked={formData.hasFlatSection}
                onChange={(e) =>
                  setFormData({ ...formData, hasFlatSection: e.target.checked })
                }
              />
              <span className="ml-3 text-gray-700">
                Flat Roof Section (includes membrane installation)
              </span>
            </label>
          </div>
        </div>

        {/* Pricing Method */}
        <div className="border-t pt-6">
          <label className="form-label mb-3">Pricing Method *</label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="pricingMethod"
                value="manual"
                className="w-5 h-5 text-green-600 focus:ring-green-500"
                checked={formData.pricingMethod === 'manual'}
                onChange={(e) =>
                  setFormData({ ...formData, pricingMethod: e.target.value })
                }
              />
              <span className="ml-3 text-gray-700">Enter Total Price Manually</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="pricingMethod"
                value="calculated"
                className="w-5 h-5 text-green-600 focus:ring-green-500"
                checked={formData.pricingMethod === 'calculated'}
                onChange={(e) =>
                  setFormData({ ...formData, pricingMethod: e.target.value })
                }
              />
              <span className="ml-3 text-gray-700">Calculate by Squares</span>
            </label>
          </div>
        </div>

        {/* Manual Pricing */}
        {formData.pricingMethod === 'manual' && (
          <div>
            <label className="form-label">Total Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="input-field pl-8"
                placeholder="0.00"
                value={formData.manualPrice}
                onChange={(e) =>
                  setFormData({ ...formData, manualPrice: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* Calculated Pricing */}
        {formData.pricingMethod === 'calculated' && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Price per Square *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="input-field pl-8"
                    placeholder="0.00"
                    value={formData.pricePerSquare}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerSquare: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Total Squares *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0"
                  value={formData.totalSquares}
                  onChange={(e) =>
                    setFormData({ ...formData, totalSquares: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Waste %</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="input-field pr-8"
                    placeholder="0"
                    value={formData.wastePercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, wastePercentage: e.target.value })
                    }
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Calculation Preview */}
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-600">
                Base: ${formData.pricePerSquare || '0'} × {formData.totalSquares || '0'} squares
                = ${((parseFloat(formData.pricePerSquare) || 0) * (parseFloat(formData.totalSquares) || 0)).toFixed(2)}
              </p>
              {parseFloat(formData.wastePercentage) > 0 && (
                <p className="text-sm text-gray-600">
                  + Waste ({formData.wastePercentage}%): $
                  {(
                    (parseFloat(formData.pricePerSquare) || 0) *
                    (parseFloat(formData.totalSquares) || 0) *
                    ((parseFloat(formData.wastePercentage) || 0) / 100)
                  ).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Total Display */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">Estimated Total:</span>
            <span className="text-3xl font-bold text-green-600">
              ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/dashboard/estimates" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || !formData.customerId || !formData.jobAddressId}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating...' : 'Create Estimate'}
          </button>
        </div>
      </form>
    </div>
  )
}
