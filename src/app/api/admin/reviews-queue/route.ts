import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviews = await prisma.productReview.findMany({
      where: { status: 'REVIEW' },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          select: { id: true, title: true },
        },
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews queue:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

