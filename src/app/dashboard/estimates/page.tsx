'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Estimate {
  id: number
  roofingType: string
  hasAcUnit: boolean
  hasFlatSection: boolean
  totalPrice: string
  createdAt: string
  customer: {
    name: string
    phone: string
  }
  jobAddress: {
    streetAddress: string
    city: string
    state: string
    zip: string
  }
}

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEstimates() {
      try {
        const res = await fetch('/api/estimates')
        const data = await res.json()
        setEstimates(data.estimates || [])
      } catch (error) {
        console.error('Error fetching estimates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEstimates()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this estimate?')) return

    try {
      const res = await fetch(`/api/estimates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEstimates(estimates.filter((e) => e.id !== id))
      }
    } catch (error) {
      console.error('Error deleting estimate:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Estimates</h1>
        <Link href="/dashboard/estimates/new" className="btn-primary">
          + New Estimate
        </Link>
      </div>

      {estimates.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No estimates yet.</p>
          <Link href="/dashboard/estimates/new" className="btn-primary">
            Create Your First Estimate
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Options
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">
                        {estimate.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {estimate.customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {estimate.jobAddress.streetAddress}
                    </div>
                    <div className="text-sm text-gray-500">
                      {estimate.jobAddress.city}, {estimate.jobAddress.state}{' '}
                      {estimate.jobAddress.zip}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {estimate.hasAcUnit && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          AC Unit
                        </span>
                      )}
                      {estimate.hasFlatSection && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          Flat Section
                        </span>
                      )}
                      {!estimate.hasAcUnit && !estimate.hasFlatSection && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          Standard
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-green-600">
                      ${parseFloat(estimate.totalPrice).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(estimate.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/estimates/${estimate.id}`}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(estimate.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
