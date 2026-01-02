'use client'

import { useState, useEffect } from 'react'

interface JobAddress {
  id: number
  streetAddress: string
  city: string
  state: string
  zip: string
  aerialImageUrl?: string
}

interface Customer {
  id: number
  name: string
  phone: string
  jobAddresses: JobAddress[]
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState<number | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  // New customer form
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' })

  // New address form
  const [newAddress, setNewAddress] = useState({
    streetAddress: '',
    city: '',
    state: 'AZ',
    zip: '',
    aerialImage: null as string | null,
  })

  const fetchCustomers = async () => {
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

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      })

      if (res.ok) {
        setNewCustomer({ name: '', phone: '' })
        setShowAddCustomer(false)
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error adding customer:', error)
    }
  }

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer) return

    try {
      const res = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingCustomer.name,
          phone: editingCustomer.phone,
        }),
      })

      if (res.ok) {
        setEditingCustomer(null)
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer? This will also delete all their job addresses and estimates.')) {
      return
    }

    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const handleAddAddress = async (e: React.FormEvent, customerId: number) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/job-addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          ...newAddress,
        }),
      })

      if (res.ok) {
        setNewAddress({
          streetAddress: '',
          city: '',
          state: 'AZ',
          zip: '',
          aerialImage: null,
        })
        setShowAddAddress(null)
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error adding address:', error)
    }
  }

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job address?')) return

    try {
      const res = await fetch(`/api/job-addresses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewAddress({ ...newAddress, aerialImage: reader.result as string })
      }
      reader.readAsDataURL(file)
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
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={() => setShowAddCustomer(true)}
          className="btn-primary"
        >
          + Add Customer
        </button>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="form-label">Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div>
                <label className="form-label">Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customers List */}
      {customers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No customers yet.</p>
          <button
            onClick={() => setShowAddCustomer(true)}
            className="btn-primary"
          >
            Add Your First Customer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{customer.name}</h3>
                  <p className="text-gray-600">{customer.phone}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCustomer(customer)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Job Addresses */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Job Addresses</h4>
                  <button
                    onClick={() => setShowAddAddress(customer.id)}
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    + Add Address
                  </button>
                </div>

                {customer.jobAddresses.length === 0 ? (
                  <p className="text-sm text-gray-500">No job addresses added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {customer.jobAddresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          {address.aerialImageUrl && (
                            <img
                              src={address.aerialImageUrl}
                              alt="Aerial view"
                              className="w-12 h-12 object-cover rounded mr-3"
                            />
                          )}
                          <div>
                            <p className="font-medium">{address.streetAddress}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zip}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address Form */}
                {showAddAddress === customer.id && (
                  <form
                    onSubmit={(e) => handleAddAddress(e, customer.id)}
                    className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3"
                  >
                    <div>
                      <label className="form-label">Street Address</label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={newAddress.streetAddress}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, streetAddress: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="form-label">ZIP</label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={newAddress.zip}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, zip: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Aerial Image (optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="input-field"
                        onChange={handleImageChange}
                      />
                    </div>
                    {newAddress.aerialImage && (
                      <img
                        src={newAddress.aerialImage}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                    )}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAddress(null)
                          setNewAddress({
                            streetAddress: '',
                            city: '',
                            state: 'AZ',
                            zip: '',
                            aerialImage: null,
                          })
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Add Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
