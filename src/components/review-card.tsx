import Link from 'next/link'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface ReviewCardProps {
  review: {
    id: string
    productTitle: string
    productImage: string
    productLink: string
    rating: number
    reviewContent: string
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <img
          src={review.productImage}
          alt={review.productTitle}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <CardTitle className="mb-2 line-clamp-2">
          {review.productTitle}
        </CardTitle>
        
        <div className="flex items-center mb-3">
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
        
        <CardDescription className="mb-4 line-clamp-3">
          {review.reviewContent}
        </CardDescription>
        
        {/* Two Buttons Side by Side */}
        <div className="flex gap-2">
          <Link 
            href={`/reviews/${review.id}`}
            className="flex-1"
          >
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
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
