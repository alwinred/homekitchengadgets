import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/post-card'
import { ReviewCard } from '@/components/review-card'
import { prisma } from '@/lib/prisma'
import HeroImage from '@/components/hero-image'
import { AdSenseAd } from '@/components/adsense-ad'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  // Get site settings for SEO
  const siteSettings = await prisma.siteSettings.findFirst()
  
  return {
    title: siteSettings?.seoTitle || 'Kitchen Cursor - Product Reviews & Tech Blog',
    description: siteSettings?.seoDescription || 'Discover in-depth product reviews, tech insights, and buying guides to help you make informed decisions.',
    keywords: siteSettings?.seoKeywords || 'product reviews, tech blog, buying guides, affiliate marketing',
    openGraph: {
      title: siteSettings?.seoTitle || 'Kitchen Cursor - Product Reviews & Tech Blog',
      description: siteSettings?.seoDescription || 'Discover in-depth product reviews, tech insights, and buying guides to help you make informed decisions.',
      type: 'website',
      url: 'https://kitchencursor.com',
      siteName: 'Kitchen Cursor',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteSettings?.seoTitle || 'Kitchen Cursor - Product Reviews & Tech Blog',
      description: siteSettings?.seoDescription || 'Discover in-depth product reviews, tech insights, and buying guides to help you make informed decisions.',
    },
  }
}

export default async function Home() {
  // Get site settings for hero section
  const siteSettings = await prisma.siteSettings.findFirst()
  
  // Get featured post (most recent published post)
  const featuredPost = await prisma.post.findFirst({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, title: true, excerpt: true, heroImage: true, createdAt: true },
  })

  // Get recent posts (excluding featured post) - 4 per row, max 3 rows = 12 posts
  const recentPosts = await prisma.post.findMany({
    where: { 
      status: 'PUBLISHED',
      ...(featuredPost && { id: { not: featuredPost.id } })
    },
    orderBy: { createdAt: 'desc' },
    take: 12,
    select: { id: true, slug: true, title: true, excerpt: true, heroImage: true, createdAt: true },
  })

  // Get recent reviews - 4 per row, max 3 rows = 12 reviews
  const recentReviews = await prisma.productReview.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 12,
    select: { 
      id: true, 
      productTitle: true, 
      productImage: true, 
      productLink: true, 
      rating: true, 
      reviewContent: true, 
      createdAt: true 
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          {siteSettings?.heroTitle || 'Discover Amazing Products'}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {siteSettings?.heroDescription || 'In-depth reviews, expert insights, and buying guides to help you make informed decisions on the products that matter most.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/reviews">
            <Button size="lg">
              Browse Reviews
            </Button>
          </Link>
          <Link href="#recent-posts">
            <Button variant="outline" size="lg">
              Read Articles
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Article</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-card rounded-xl p-8 shadow-lg">
            <div>
              <HeroImage
                src={featuredPost.heroImage}
                alt={featuredPost.title}
                className="w-full h-64 lg:h-80 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                {featuredPost.title}
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                {featuredPost.excerpt}
              </p>
              <Link href={`/posts/${featuredPost.slug}`}>
                <Button size="lg">
                  Read More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* AdSense Ad Unit - Between Featured Article and Latest Articles */}
      <AdSenseAd adSlot="homepage-between-featured-latest" />

      {/* Recent Posts */}
      <section id="recent-posts">
        <h2 className="text-3xl font-bold mb-6">Latest Articles</h2>
        {recentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/posts">
                <Button size="lg" variant="outline">
                  View All Articles
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No articles published yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Check back soon for amazing content!
            </p>
          </div>
        )}
      </section>

      {/* AdSense Ad Unit - Between Latest Articles and Latest Reviews */}
      <AdSenseAd adSlot="homepage-between-articles-reviews" />

      {/* Latest Reviews */}
      <section id="latest-reviews" className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Latest Reviews</h2>
        {recentReviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/reviews">
                <Button size="lg" variant="outline">
                  View All Reviews
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No reviews published yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Check back soon for amazing product reviews!
            </p>
          </div>
        )}
      </section>

      {/* AdSense Ad Unit - Below Latest Reviews */}
      <AdSenseAd adSlot="homepage-below-reviews" />
    </div>
  )
}
