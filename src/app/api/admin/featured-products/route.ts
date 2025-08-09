import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/admin/featured-products - Create a new featured product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      productName, 
      productImage, 
      productLink, 
      price,
      rating = 5, 
      description, 
      postId 
    } = body

    // Validate required fields
    if (!productName || !productImage || !productLink || !description || !postId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    const featuredProduct = await prisma.featuredProduct.create({
      data: {
        productName,
        productImage,
        productLink,
        price,
        rating: rating || 5,
        description,
        postId,
      },
    })

    return NextResponse.json(featuredProduct)
  } catch (error) {
    console.error('Error creating featured product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

