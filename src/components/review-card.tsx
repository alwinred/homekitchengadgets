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
    createdAt?: Date
  }
  stackedButtons?: boolean
}

export function ReviewCard({ review, stackedButtons = false }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
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
      <CardContent className="p-4">
        <CardTitle className="mb-1 line-clamp-2 hover:text-primary transition-colors text-base">
          {review.productTitle}
        </CardTitle>
        <div className="flex items-center gap-1 mb-1">
          {renderStars(review.rating)}
          <span className="ml-1 text-xs text-muted-foreground">
            {review.rating}/5
          </span>
        </div>
        <CardDescription className="mb-2 line-clamp-2 text-xs">
          {review.reviewContent}
        </CardDescription>
        {review.createdAt && (
          <p className="text-xs text-muted-foreground mb-3">
            {formatDate(review.createdAt)}
          </p>
        )}
        
        {/* Buttons - Side by side or stacked */}
        <div className={stackedButtons ? "space-y-2" : "flex gap-2"}>
          <Link
            href={`/reviews/${review.id}`}
            className="block flex-1"
          >
            <button className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Review
            </button>
          </Link>

          <Link
            href={review.productLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block flex-[1.67]"
          >
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              View on Amazon
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
