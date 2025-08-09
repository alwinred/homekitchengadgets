import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateBlogPost, generateHeroImage, generateProductReview } from '@/lib/openai'
import { searchAmazonProducts, AmazonProduct } from '@/lib/amazon'
import { generateSlug, ensureUniqueSlug } from '@/lib/slug'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { topic } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Generate hero image first
    let heroImageUrl = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1024&h=1024&fit=crop' // fallback image
    
    try {
      heroImageUrl = await generateHeroImage(topic)
    } catch (error) {
      console.error('Error generating hero image:', error)
      // Continue with fallback image
    }

    // Generate blog post content
    let blogPost
    try {
      blogPost = await generateBlogPost(topic)
    } catch (error) {
      console.error('Error generating blog post:', error)
      // Provide fallback content
      blogPost = {
        title: `Ultimate Guide to ${topic}`,
        excerpt: `Discover everything you need to know about ${topic} in this comprehensive guide.`,
        content: `# Ultimate Guide to ${topic}\n\nThis is a comprehensive guide about ${topic}. We'll cover everything you need to know.\n\n## What is ${topic}?\n\n${topic} is an important topic that many people are interested in learning about.\n\n## Key Features\n\n- Important feature 1\n- Important feature 2\n- Important feature 3\n\n## Conclusion\n\nIn conclusion, ${topic} is a fascinating subject with many applications and benefits.`
      }
    }

    // Generate slug and ensure it's unique
    const baseSlug = generateSlug(blogPost.title)
    const existingPosts = await prisma.post.findMany({
      select: { slug: true }
    })
    const existingSlugs = existingPosts.map(p => p.slug)
    const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs)

    // Create the post in the database with REVIEW status
    const post = await prisma.post.create({
      data: {
        title: blogPost.title,
        slug: uniqueSlug,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        heroImage: heroImageUrl,
        status: 'REVIEW',
      },
    })

    // Search for Amazon products related to the topic
    let products: AmazonProduct[] = []
    try {
      products = await searchAmazonProducts(topic)
    } catch (error) {
      console.error('Error fetching Amazon products:', error)
      // Continue without products
    }

    // Generate reviews for each product
    const productReviews = []
    for (const product of products.slice(0, 3)) { // Limit to 3 products
      try {
        const review = await generateProductReview(product.title, product.description)
        
        const productReview = await prisma.productReview.create({
          data: {
            productTitle: product.title,
            productImage: product.image,
            productLink: product.link,
            rating: review.rating,
            reviewContent: review.reviewContent,
            status: 'PUBLISHED',
            postId: post.id,
          },
        })
        
        productReviews.push(productReview)
      } catch (error) {
        console.error('Error generating product review:', error)
        // Continue with next product
      }
    }

    // Return the created post with its reviews
    const postWithReviews = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        productReviews: true,
      },
    })

    return NextResponse.json(postWithReviews)
  } catch (error) {
    console.error('Error generating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
