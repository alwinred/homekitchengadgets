import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductReviewStatus } from '@prisma/client'

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      productTitle, 
      productImage, 
      productLink, 
      rating, 
      reviewContent, 
      status = 'PUBLISHED',
      postId 
    } = body

    // Validate required fields
    if (!productTitle || !productImage || !productLink || !reviewContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate status
    if (status && !Object.values(ProductReviewStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const product = await prisma.productReview.create({
      data: {
        productTitle,
        productImage,
        productLink,
        rating: rating || 5,
        reviewContent,
        status: status as ProductReviewStatus,
        postId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

