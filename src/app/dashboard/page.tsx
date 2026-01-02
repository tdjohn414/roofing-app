'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  totalCustomers: number
  totalEstimates: number
  totalValue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalEstimates: 0,
    totalValue: 0,
  })
  const [recentEstimates, setRecentEstimates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [customersRes, estimatesRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/estimates'),
        ])

        const customersData = await customersRes.json()
        const estimatesData = await estimatesRes.json()

        const customers = customersData.customers || []
        const estimates = estimatesData.estimates || []

        const totalValue = estimates.reduce(
          (sum: number, est: any) => sum + parseFloat(est.totalPrice || 0),
          0
        )

        setStats({
          totalCustomers: customers.length,
          totalEstimates: estimates.length,
          totalValue,
        })

        setRecentEstimates(estimates.slice(0, 5))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/dashboard/estimates/new" className="btn-primary">
          + New Estimate
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Estimates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEstimates}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/customers"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-green-600 mr-3">→</span>
              Manage Customers
            </Link>
            <Link
              href="/dashboard/estimates/new"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-green-600 mr-3">→</span>
              Create New Estimate
            </Link>
            <Link
              href="/dashboard/estimates"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-green-600 mr-3">→</span>
              View All Estimates
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Estimates</h2>
          {recentEstimates.length > 0 ? (
            <div className="space-y-3">
              {recentEstimates.map((estimate) => (
                <Link
                  key={estimate.id}
                  href={`/dashboard/estimates/${estimate.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{estimate.customer.name}</p>
                    <p className="text-sm text-gray-600">
                      {estimate.jobAddress.city}, {estimate.jobAddress.state}
                    </p>
                  </div>
                  <p className="font-semibold text-green-600">
                    ${parseFloat(estimate.totalPrice).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No estimates yet. Create your first estimate!</p>
          )}
        </div>
      </div>
    </div>
  )
}
