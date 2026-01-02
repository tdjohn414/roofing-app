import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, businessName, businessAddress, businessPhone, repName, logo } = body

    if (!email || !password || !businessName || !businessAddress || !repName) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existing = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Upload logo
    let logoUrl = null
    if (logo) {
      try {
        logoUrl = await uploadImage(logo, 'roofing-app/logos')
      } catch (uploadError) {
        console.error('Logo upload error:', uploadError)
      }
    }

    const passwordHash = await hashPassword(password)

    const result = await query(
      `INSERT INTO users (email, password_hash, business_name, business_address, business_phone, rep_name, logo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, business_name, rep_name`,
      [email.toLowerCase(), passwordHash, businessName, businessAddress, businessPhone || null, repName, logoUrl]
    )

    const user = result.rows[0]
    const token = generateToken({ userId: user.id, email: user.email })
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.business_name,
        repName: user.rep_name,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
