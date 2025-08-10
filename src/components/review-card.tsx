import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import HeroImage from '@/components/hero-image'
import { Star } from 'lucide-react'

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
      <Link href={`/reviews/${review.id}`}>
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
          <p className="text-sm text-muted-foreground">
            {formatDate(review.createdAt)}
          </p>
        </CardContent>
      </Link>
    </Card>
  )
}
