'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star, ExternalLink } from 'lucide-react'

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedReviews.map((review) => (
          <Card key={review.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <img
                src={review.productImage}
                alt={review.productTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80'
                }}
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-bold text-lg mb-2 line-clamp-2">
                {review.productTitle}
              </h4>
              
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {review.rating}/5
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {review.reviewContent}
              </p>
              
              {/* Two Buttons Side by Side */}
              <div className="flex gap-2">
                <a
                  href={`/reviews/${review.id}`}
                  className="flex-1"
                >
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                    Read Review
                  </button>
                </a>

                <a
                  href={review.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                    View on Amazon
                  </button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        💡 These reviews are based on our hands-on testing and analysis.
      </p>
    </div>
  )
}
