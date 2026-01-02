import { NextResponse } from 'next/server'
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

    const result = await query(
      `SELECT id, email, business_name, business_address, business_phone, rep_name, logo_url
       FROM users WHERE id = $1`,
      [authUser.userId]
    )

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        businessName: user.business_name,
        businessAddress: user.business_address,
        businessPhone: user.business_phone,
        repName: user.rep_name,
        logoUrl: user.logo_url,
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
