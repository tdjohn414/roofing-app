import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { customerId, streetAddress, city, state, zip, aerialImage } = await request.json()

    if (!customerId || !streetAddress || !city || !state || !zip) {
      return NextResponse.json(
        { error: 'All address fields are required' },
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

    // Upload aerial image
    let aerialImageUrl = null
    if (aerialImage) {
      try {
        aerialImageUrl = await uploadImage(aerialImage, 'roofing-app/aerial-images')
      } catch (uploadError) {
        console.error('Aerial image upload error:', uploadError)
      }
    }

    const result = await query(
      `INSERT INTO job_addresses (customer_id, street_address, city, state, zip, aerial_image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [customerId, streetAddress, city, state, zip, aerialImageUrl]
    )

    const jobAddress = {
      id: result.rows[0].id,
      streetAddress: result.rows[0].street_address,
      city: result.rows[0].city,
      state: result.rows[0].state,
      zip: result.rows[0].zip,
      aerialImageUrl: result.rows[0].aerial_image_url
    }

    return NextResponse.json({ jobAddress }, { status: 201 })
  } catch (error) {
    console.error('Create job address error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
