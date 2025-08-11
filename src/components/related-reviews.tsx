'use client'

import { ReviewCard } from '@/components/review-card'

interface ProductReview {
  id: string
  productTitle: string
  productImage: string
  productLink: string
  rating: number
  reviewContent: string
  status: string
}

interface RelatedReviewsProps {
  reviews: ProductReview[]
}

export function RelatedReviews({ reviews }: RelatedReviewsProps) {
  // Only show published reviews
  const publishedReviews = reviews.filter(review => review.status === 'PUBLISHED')
  
  if (publishedReviews.length === 0) {
    return null
  }
  
  return (
    <div className="my-12 p-6 bg-muted/30 rounded-xl border">
      <h3 className="text-2xl font-bold mb-6 text-center text-primary">
        📝 Related Reviews
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {publishedReviews.slice(0, 6).map((review) => (
          <ReviewCard key={review.id} review={review} stackedButtons={true} />
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        💡 These reviews are based on our hands-on testing and analysis. Showing top 4 related reviews.
      </p>
    </div>
  )
}
