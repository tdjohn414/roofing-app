'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    repName: '',
  })
  const [logo, setLogo] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          logo,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800">Roofing Estimate Pro</h1>
          <p className="mt-2 text-gray-600">Create your contractor account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="businessName" className="form-label">
                  Business Name *
                </label>
                <input
                  id="businessName"
                  type="text"
                  required
                  className="input-field"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="businessAddress" className="form-label">
                  Business Address *
                </label>
                <input
                  id="businessAddress"
                  type="text"
                  required
                  placeholder="123 Main St, City, State ZIP"
                  className="input-field"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="businessPhone" className="form-label">
                  Business Phone *
                </label>
                <input
                  id="businessPhone"
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                  className="input-field"
                  value={formData.businessPhone}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="repName" className="form-label">
                  Your Name (Sales Rep) *
                </label>
                <input
                  id="repName"
                  type="text"
                  required
                  className="input-field"
                  value={formData.repName}
                  onChange={(e) => setFormData({ ...formData, repName: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="logo" className="form-label">
                  Business Logo
                </label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="input-field"
                  onChange={handleLogoChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className="input-field"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            {logo && (
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={logo}
                    alt="Logo preview"
                    className="h-24 w-auto object-contain rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setLogo(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
