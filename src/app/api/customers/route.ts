import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const customersResult = await query(
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
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [authUser.userId]
    )

    const customers = customersResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      jobAddresses: row.job_addresses || []
    }))

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Get customers error:', error)
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

    const { name, phone } = await request.json()

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO customers (user_id, name, phone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [authUser.userId, name, phone]
    )

    const customer = {
      ...result.rows[0],
      jobAddresses: []
    }

    return NextResponse.json({ customer }, { status: 201 })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
