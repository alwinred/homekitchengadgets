import { Metadata } from 'next'
import { ReviewCard } from '@/components/review-card'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Product Reviews - BlogReview',
  description: 'Discover honest, in-depth product reviews with ratings and buying guides. Find the best products for your needs.',
  openGraph: {
    title: 'Product Reviews - BlogReview',
    description: 'Discover honest, in-depth product reviews with ratings and buying guides. Find the best products for your needs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Reviews - BlogReview',
    description: 'Discover honest, in-depth product reviews with ratings and buying guides. Find the best products for your needs.',
  },
}

export default async function ReviewsPage() {
  const reviews = await prisma.productReview.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Product Reviews',
    description: 'Honest, in-depth product reviews with ratings and buying guides',
    url: 'https://blogreview.com/reviews',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: reviews.map((review, index) => ({
        '@type': 'Review',
        position: index + 1,
        itemReviewed: {
          '@type': 'Product',
          name: review.productTitle,
          image: review.productImage,
        },
        author: {
          '@type': 'Organization',
          name: 'BlogReview Team',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: review.reviewContent,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center py-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Product Reviews
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Honest, in-depth reviews to help you make informed purchasing decisions. 
            Every product is thoroughly tested and rated by our expert team.
          </p>
        </header>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                No Reviews Yet
              </h2>
              <p className="text-muted-foreground mb-6">
                We&apos;re working hard to bring you comprehensive product reviews. 
                Check back soon for detailed insights on the latest products!
              </p>
              <div className="bg-muted/30 rounded-lg p-6">
                <p className="text-sm text-muted-foreground">
                  Want to see a specific product reviewed? Contact us with your suggestions!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Categories Section (Future Enhancement) */}
        <section className="mt-16 py-12 bg-muted/20 rounded-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Review Categories
            </h2>
            <p className="text-muted-foreground mb-8">
              Coming soon: Browse reviews by category
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {['Kitchen', 'Technology', 'Fitness', 'Home & Garden'].map((category) => (
                <div 
                  key={category}
                  className="bg-background rounded-lg p-4 shadow-sm border"
                >
                  <p className="font-medium text-primary">{category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

