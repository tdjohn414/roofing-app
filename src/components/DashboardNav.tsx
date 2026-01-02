'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface User {
  businessName: string
  repName: string
  logoUrl?: string
}

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(console.error)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/customers', label: 'Customers' },
    { href: '/dashboard/estimates', label: 'Estimates' },
    { href: '/dashboard/estimates/new', label: 'New Estimate' },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {user?.logoUrl && (
              <img
                src={user.logoUrl}
                alt="Logo"
                className="h-10 w-auto mr-3"
              />
            )}
            <Link href="/dashboard" className="text-xl font-bold text-green-700">
              {user?.businessName || 'Roofing Estimate Pro'}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-l border-gray-300 h-6 mx-2"></div>
            <span className="text-sm text-gray-600">{user?.repName}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <span className="block px-3 py-2 text-sm text-gray-600">{user?.repName}</span>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
