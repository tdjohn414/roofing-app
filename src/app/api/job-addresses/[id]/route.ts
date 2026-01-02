import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

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
    const addressId = parseInt(id)

    // Verify address belongs to user's customer
    const addressCheck = await query(
      `SELECT ja.id FROM job_addresses ja
       JOIN customers c ON c.id = ja.customer_id
       WHERE ja.id = $1 AND c.user_id = $2`,
      [addressId, authUser.userId]
    )

    if (addressCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job address not found' },
        { status: 404 }
      )
    }

    await query('DELETE FROM job_addresses WHERE id = $1', [addressId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete job address error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
