'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getWoodPriceList } from '@/lib/scopeOfWork'

interface Estimate {
  id: number
  roofingType: string
  hasAcUnit: boolean
  hasFlatSection: boolean
  pricingMethod: string
  manualPrice: string | null
  pricePerSquare: string | null
  totalSquares: string | null
  wastePercentage: string | null
  totalPrice: string
  scopeOfWork: string
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
    aerialImageUrl?: string
  }
  user: {
    businessName: string
    businessAddress: string
    businessPhone: string
    repName: string
    logoUrl?: string
  }
}

export default function EstimateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    async function fetchEstimate() {
      try {
        const res = await fetch(`/api/estimates/${params.id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error)
        }

        setEstimate(data.estimate)
      } catch (error) {
        console.error('Error fetching estimate:', error)
        router.push('/dashboard/estimates')
      } finally {
        setLoading(false)
      }
    }

    fetchEstimate()
  }, [params.id, router])

  const generatePDF = async () => {
    if (!estimate) return
    setGenerating(true)

    try {
      // Dynamically import jsPDF
      const { default: jsPDF } = await import('jspdf')
      
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      let yPos = margin

      // Helper function to add text and track position
      const addText = (text: string, x: number, y: number, options?: any) => {
        doc.text(text, x, y, options)
      }

      // Header with green bar
      doc.setFillColor(34, 197, 94) // green-500
      doc.rect(0, 0, pageWidth, 8, 'F')

      // Company Info (Right side)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      addText(estimate.user.businessName, pageWidth - margin, yPos + 15, { align: 'right' })
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(80, 80, 80)
      addText(estimate.user.businessAddress, pageWidth - margin, yPos + 22, { align: 'right' })
      addText(estimate.user.businessPhone || '', pageWidth - margin, yPos + 28, { align: 'right' })

      // Date and Rep
      yPos = 45
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      addText(`Date: ${new Date(estimate.createdAt).toLocaleDateString()}`, pageWidth - margin, yPos, { align: 'right' })
      addText(`Rep: ${estimate.user.repName}`, pageWidth - margin, yPos + 6, { align: 'right' })

      // Customer and Job Address boxes
      yPos = 60
      
      // Draw boxes
      doc.setDrawColor(200, 200, 200)
      doc.setFillColor(249, 250, 251)
      doc.rect(margin, yPos, 80, 30, 'FD')
      doc.rect(margin + 85, yPos, 80, 30, 'FD')

      // Customer box header
      doc.setFillColor(34, 197, 94)
      doc.rect(margin, yPos, 80, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      addText('CUSTOMER', margin + 40, yPos + 5, { align: 'center' })

      // Customer info
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      addText(estimate.customer.name, margin + 5, yPos + 15)
      addText(estimate.customer.phone, margin + 5, yPos + 22)

      // Job Address box header
      doc.setFillColor(34, 197, 94)
      doc.rect(margin + 85, yPos, 80, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      addText('JOB ADDRESS', margin + 125, yPos + 5, { align: 'center' })

      // Job Address info
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      addText(estimate.jobAddress.streetAddress, margin + 90, yPos + 15)
      addText(`${estimate.jobAddress.city}, ${estimate.jobAddress.state} ${estimate.jobAddress.zip}`, margin + 90, yPos + 22)

      // Scope of Work Title
      yPos = 100
      doc.setFillColor(34, 197, 94)
      doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      addText('Scope of Work', margin + 5, yPos + 6)

      // Parse and render scope of work
      yPos = 115
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)

      const lines = estimate.scopeOfWork.split('\n')
      
      for (const line of lines) {
        // Check if we need a new page
        if (yPos > pageHeight - 40) {
          doc.addPage()
          yPos = margin
        }

        if (line.startsWith('SCOPE OF WORK')) {
          // Skip the title since we already have a header
          continue
        } else if (line.startsWith('Phase')) {
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(22, 101, 52) // green-800
          addText(line, margin, yPos)
          yPos += 6
        } else if (line.startsWith('•')) {
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(0, 0, 0)
          
          // Word wrap for bullet points
          const bulletText = line.substring(2)
          const splitText = doc.splitTextToSize(bulletText, pageWidth - margin * 2 - 10)
          
          addText('•', margin + 3, yPos)
          for (let i = 0; i < splitText.length; i++) {
            if (yPos > pageHeight - 40) {
              doc.addPage()
              yPos = margin
            }
            addText(splitText[i], margin + 8, yPos)
            yPos += 4.5
          }
        } else if (line.trim() === '') {
          yPos += 3
        }
      }

      // Add new page for pricing and wood list
      doc.addPage()
      yPos = margin

      // Total Price Box
      doc.setFillColor(34, 197, 94)
      doc.rect(margin, yPos, pageWidth - margin * 2, 15, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      addText(
        `Total: $${parseFloat(estimate.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        pageWidth / 2,
        yPos + 10,
        { align: 'center' }
      )

      // Wood Price List
      yPos += 30
      doc.setFillColor(34, 197, 94)
      doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      addText('Wood Price List', margin + 5, yPos + 6)

      yPos += 15
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')

      const woodPriceList = getWoodPriceList()
      const woodLines = woodPriceList.split('\n')

      for (const line of woodLines) {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = margin
        }

        if (line.startsWith('Wood Price List') || line.startsWith('Wood Schedule') || line.startsWith('FASCIA')) {
          doc.setFont('helvetica', 'bold')
          yPos += 3
          addText(line, margin, yPos)
          yPos += 5
        } else if (line.startsWith('--')) {
          doc.setFont('helvetica', 'normal')
          const cleanLine = line.replace(/--/g, '').trim()
          addText(`• ${cleanLine}`, margin + 5, yPos)
          yPos += 5
        } else if (line.trim()) {
          doc.setFont('helvetica', 'normal')
          const splitText = doc.splitTextToSize(line, pageWidth - margin * 2)
          for (const textLine of splitText) {
            addText(textLine, margin, yPos)
            yPos += 4.5
          }
        } else {
          yPos += 2
        }
      }

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | ${estimate.user.businessName}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )

      // Save the PDF
      const fileName = `Estimate_${estimate.customer.name.replace(/\s+/g, '_')}_${new Date(estimate.createdAt).toLocaleDateString().replace(/\//g, '-')}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!estimate) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Estimate not found.</p>
        <Link href="/dashboard/estimates" className="btn-primary mt-4">
          Back to Estimates
        </Link>
      </div>
    )
  }

  // Parse scope of work for display
  const scopeLines = estimate.scopeOfWork.split('\n')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Estimate Details</h1>
        <div className="flex space-x-3">
          <Link href="/dashboard/estimates" className="btn-secondary">
            ← Back
          </Link>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="btn-primary disabled:opacity-50"
          >
            {generating ? 'Generating...' : '📄 Download PDF'}
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div className="card">
        {/* Header */}
        <div className="border-b-4 border-green-500 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {estimate.user.logoUrl && (
                <img
                  src={estimate.user.logoUrl}
                  alt="Company Logo"
                  className="h-16 w-auto mr-4"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {estimate.user.businessName}
                </h2>
                <p className="text-gray-600">{estimate.user.businessAddress}</p>
                <p className="text-gray-600">{estimate.user.businessPhone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600">
                Date: {new Date(estimate.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Rep: {estimate.user.repName}</p>
            </div>
          </div>
        </div>

        {/* Customer and Job Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-green-700 uppercase mb-2">
              Customer
            </h3>
            <p className="font-medium">{estimate.customer.name}</p>
            <p className="text-gray-600">{estimate.customer.phone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-green-700 uppercase mb-2">
              Job Address
            </h3>
            <p className="font-medium">{estimate.jobAddress.streetAddress}</p>
            <p className="text-gray-600">
              {estimate.jobAddress.city}, {estimate.jobAddress.state}{' '}
              {estimate.jobAddress.zip}
            </p>
          </div>
          {estimate.jobAddress.aerialImageUrl && (
            <div>
              <h3 className="text-sm font-semibold text-green-700 uppercase mb-2">
                Aerial View
              </h3>
              <img
                src={estimate.jobAddress.aerialImageUrl}
                alt="Aerial view"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Options Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {estimate.roofingType.charAt(0).toUpperCase() + estimate.roofingType.slice(1)} Roof
          </span>
          {estimate.hasAcUnit && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              AC Unit Included
            </span>
          )}
          {estimate.hasFlatSection && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Flat Roof Section
            </span>
          )}
        </div>

        {/* Total */}
        <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-3xl font-bold">
              ${parseFloat(estimate.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Scope of Work */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 border-b-2 border-green-500 pb-2 mb-4">
            Scope of Work
          </h3>
          <div className="space-y-4">
            {scopeLines.map((line, index) => {
              if (line.startsWith('SCOPE OF WORK')) {
                return null
              } else if (line.startsWith('Phase')) {
                return (
                  <h4 key={index} className="font-bold text-green-800 mt-4">
                    {line}
                  </h4>
                )
              } else if (line.startsWith('•')) {
                return (
                  <p key={index} className="ml-4 text-gray-700">
                    {line}
                  </p>
                )
              } else if (line.trim()) {
                return (
                  <p key={index} className="text-gray-700">
                    {line}
                  </p>
                )
              }
              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
