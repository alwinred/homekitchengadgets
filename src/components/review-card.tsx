import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import HeroImage from '@/components/hero-image'
import { Star, ExternalLink } from 'lucide-react'

interface ReviewCardProps {
  review: {
    id: string
    productTitle: string
    productImage: string
    productLink: string
    rating: number
    reviewContent: string
    createdAt: Date
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] w-full">
        <HeroImage
          src={review.productImage}
          alt={review.productTitle}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <CardTitle className="mb-2 line-clamp-2 hover:text-primary transition-colors">
          {review.productTitle}
        </CardTitle>
        <div className="flex items-center gap-1 mb-2">
          {renderStars(review.rating)}
          <span className="ml-2 text-sm text-muted-foreground">
            {review.rating}/5
          </span>
        </div>
        <CardDescription className="mb-4 line-clamp-3">
          {review.reviewContent}
        </CardDescription>
        <p className="text-sm text-muted-foreground mb-4">
          {formatDate(review.createdAt)}
        </p>
        
        {/* Two Buttons Side by Side */}
        <div className="flex gap-2">
          <Link
            href={`/reviews/${review.id}`}
            className="flex-1"
          >
                            <button className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  Read Review
                </button>
          </Link>

          <Link
            href={review.productLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
              View on Amazon
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
