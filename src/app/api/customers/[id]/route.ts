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
    const customerId = parseInt(id)

    const result = await query(
      `SELECT c.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', ja.id,
              'streetAddress', ja.street_address,
              'city', ja.city,
              'state', ja.state,
              'zip', ja.zip,
              'aerialImageUrl', ja.aerial_image_url
            )
          ) FILTER (WHERE ja.id IS NOT NULL), '[]'
        ) as job_addresses
       FROM customers c
       LEFT JOIN job_addresses ja ON ja.customer_id = c.id
       WHERE c.id = $1 AND c.user_id = $2
       GROUP BY c.id`,
      [customerId, authUser.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    const row = result.rows[0]
    const customer = {
      id: row.id,
      name: row.name,
      phone: row.phone,
      jobAddresses: row.job_addresses || []
    }

    return NextResponse.json({ customer })
  } catch (error) {
    console.error('Get customer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const customerId = parseInt(id)
    const { name, phone } = await request.json()

    const result = await query(
      `UPDATE customers 
       SET name = $1, phone = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [name, phone, customerId, authUser.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ customer: result.rows[0] })
  } catch (error) {
    console.error('Update customer error:', error)
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
    const customerId = parseInt(id)

    const result = await query(
      'DELETE FROM customers WHERE id = $1 AND user_id = $2 RETURNING id',
      [customerId, authUser.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete customer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
