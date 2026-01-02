import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import { getScopeOfWork } from '@/lib/scopeOfWork'

export async function GET() {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await query(
      `SELECT e.*,
        json_build_object('name', c.name, 'phone', c.phone) as customer,
        json_build_object(
          'streetAddress', ja.street_address,
          'city', ja.city,
          'state', ja.state,
          'zip', ja.zip,
          'aerialImageUrl', ja.aerial_image_url
        ) as job_address
       FROM estimates e
       JOIN customers c ON c.id = e.customer_id
       JOIN job_addresses ja ON ja.id = e.job_address_id
       WHERE e.user_id = $1
       ORDER BY e.created_at DESC`,
      [authUser.userId]
    )

    const estimates = result.rows.map(row => ({
      id: row.id,
      roofingType: row.roofing_type,
      hasAcUnit: row.has_ac_unit,
      hasFlatSection: row.has_flat_section,
      pricingMethod: row.pricing_method,
      totalPrice: row.total_price,
      createdAt: row.created_at,
      customer: row.customer,
      jobAddress: row.job_address
    }))

    return NextResponse.json({ estimates })
  } catch (error) {
    console.error('Get estimates error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      customerId,
      jobAddressId,
      roofingType = 'shingles',
      hasAcUnit = false,
      hasFlatSection = false,
      pricingMethod,
      manualPrice,
      pricePerSquare,
      totalSquares,
      wastePercentage = 0,
    } = body

    if (!customerId || !jobAddressId || !pricingMethod) {
      return NextResponse.json(
        { error: 'Customer, job address, and pricing method are required' },
        { status: 400 }
      )
    }

    // Verify customer belongs to user
    const customerCheck = await query(
      'SELECT id FROM customers WHERE id = $1 AND user_id = $2',
      [customerId, authUser.userId]
    )

    if (customerCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Verify job address belongs to customer
    const addressCheck = await query(
      'SELECT id FROM job_addresses WHERE id = $1 AND customer_id = $2',
      [jobAddressId, customerId]
    )

    if (addressCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job address not found' },
        { status: 404 }
      )
    }

    // Calculate total price
    let totalPrice: number

    if (pricingMethod === 'manual') {
      if (!manualPrice || manualPrice <= 0) {
        return NextResponse.json(
          { error: 'Manual price must be provided and greater than 0' },
          { status: 400 }
        )
      }
      totalPrice = parseFloat(manualPrice)
    } else if (pricingMethod === 'calculated') {
      if (!pricePerSquare || !totalSquares) {
        return NextResponse.json(
          { error: 'Price per square and total squares are required' },
          { status: 400 }
        )
      }
      const basePrice = parseFloat(pricePerSquare) * parseFloat(totalSquares)
      const wasteAmount = basePrice * (parseFloat(wastePercentage) / 100)
      totalPrice = basePrice + wasteAmount
    } else {
      return NextResponse.json(
        { error: 'Invalid pricing method' },
        { status: 400 }
      )
    }

    const scopeOfWork = getScopeOfWork({ hasAcUnit, hasFlatSection })

    const result = await query(
      `INSERT INTO estimates (
        user_id, customer_id, job_address_id, roofing_type,
        has_ac_unit, has_flat_section, pricing_method,
        manual_price, price_per_square, total_squares,
        waste_percentage, total_price, scope_of_work
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        authUser.userId, customerId, jobAddressId, roofingType,
        hasAcUnit, hasFlatSection, pricingMethod,
        pricingMethod === 'manual' ? manualPrice : null,
        pricingMethod === 'calculated' ? pricePerSquare : null,
        pricingMethod === 'calculated' ? totalSquares : null,
        pricingMethod === 'calculated' ? wastePercentage : null,
        totalPrice, scopeOfWork
      ]
    )

    // Get full estimate with relations
    const fullResult = await query(
      `SELECT e.*,
        json_build_object('name', c.name, 'phone', c.phone) as customer,
        json_build_object(
          'streetAddress', ja.street_address,
          'city', ja.city,
          'state', ja.state,
          'zip', ja.zip,
          'aerialImageUrl', ja.aerial_image_url
        ) as job_address
       FROM estimates e
       JOIN customers c ON c.id = e.customer_id
       JOIN job_addresses ja ON ja.id = e.job_address_id
       WHERE e.id = $1`,
      [result.rows[0].id]
    )

    const row = fullResult.rows[0]
    const estimate = {
      id: row.id,
      roofingType: row.roofing_type,
      hasAcUnit: row.has_ac_unit,
      hasFlatSection: row.has_flat_section,
      totalPrice: row.total_price,
      createdAt: row.created_at,
      customer: row.customer,
      jobAddress: row.job_address
    }

    return NextResponse.json({ estimate }, { status: 201 })
  } catch (error) {
    console.error('Create estimate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
