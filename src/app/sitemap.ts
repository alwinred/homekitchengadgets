import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kitchencursor.com'
  
  // Get all published posts
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true }
  })
  
  // Get all published reviews
  const reviews = await prisma.productReview.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, updatedAt: true }
  })

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Add all posts
    ...posts.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    // Add all reviews
    ...reviews.map((review) => ({
      url: `${baseUrl}/reviews/${review.id}`,
      lastModified: review.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}