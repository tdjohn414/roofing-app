import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
