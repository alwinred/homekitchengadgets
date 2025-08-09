import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/featured-products/[id] - Get a single featured product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const featuredProduct = await prisma.featuredProduct.findUnique({
      where: { id },
    })

    if (!featuredProduct) {
      return NextResponse.json({ error: 'Featured product not found' }, { status: 404 })
    }

    return NextResponse.json(featuredProduct)
  } catch (error) {
    console.error('Error fetching featured product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/featured-products/[id] - Update a featured product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      rating, 
      description 
    } = body

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const { id } = await params
    const updatedProduct = await prisma.featuredProduct.update({
      where: { id },
      data: {
        ...(productName && { productName }),
        ...(productImage && { productImage }),
        ...(productLink && { productLink }),
        ...(price !== undefined && { price }),
        ...(rating && { rating }),
        ...(description && { description }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating featured product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/featured-products/[id] - Delete a featured product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    await prisma.featuredProduct.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting featured product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

