import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const estimateId = parseInt(id)

    const result = await query(
      `SELECT e.*,
        json_build_object('name', c.name, 'phone', c.phone) as customer,
        json_build_object(
          'streetAddress', ja.street_address,
          'city', ja.city,
          'state', ja.state,
          'zip', ja.zip,
          'aerialImageUrl', ja.aerial_image_url
        ) as job_address,
        json_build_object(
          'businessName', u.business_name,
          'businessAddress', u.business_address,
          'businessPhone', u.business_phone,
          'repName', u.rep_name,
          'logoUrl', u.logo_url
        ) as "user"
       FROM estimates e
       JOIN customers c ON c.id = e.customer_id
       JOIN job_addresses ja ON ja.id = e.job_address_id
       JOIN users u ON u.id = e.user_id
       WHERE e.id = $1 AND e.user_id = $2`,
      [estimateId, authUser.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      )
    }

    const row = result.rows[0]
    const estimate = {
      id: row.id,
      roofingType: row.roofing_type,
      hasAcUnit: row.has_ac_unit,
      hasFlatSection: row.has_flat_section,
      pricingMethod: row.pricing_method,
      manualPrice: row.manual_price,
      pricePerSquare: row.price_per_square,
      totalSquares: row.total_squares,
      wastePercentage: row.waste_percentage,
      totalPrice: row.total_price,
      scopeOfWork: row.scope_of_work,
      createdAt: row.created_at,
      customer: row.customer,
      jobAddress: row.job_address,
      user: row.user
    }

    return NextResponse.json({ estimate })
  } catch (error) {
    console.error('Get estimate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const estimateId = parseInt(id)

    const result = await query(
      'DELETE FROM estimates WHERE id = $1 AND user_id = $2 RETURNING id',
      [estimateId, authUser.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete estimate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
