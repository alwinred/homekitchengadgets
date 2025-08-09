'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { ProductReview, Post } from '@prisma/client'
import { CheckCircle, Trash2, Star, ArrowLeft } from 'lucide-react'

type ReviewWithPost = ProductReview & {
  post: { id: string; title: string } | null
}

export default function ReviewsQueuePage() {
  const [reviews, setReviews] = useState<ReviewWithPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews-queue')
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve review')
      }

      // Refresh the reviews list
      fetchReviews()
    } catch (error) {
      console.error('Error approving review:', error)
      setError('Failed to approve review')
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete review')
      }

      // Refresh the reviews list
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
      setError('Failed to delete review')
    }
  }

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Product Reviews Queue</h1>
          <p className="text-muted-foreground">
            Product reviews waiting for your approval
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No reviews in queue</h3>
            <p className="text-muted-foreground mb-4">
              All product reviews have been approved. Generate new content to see items here.
            </p>
            <Link href="/admin/generate">
              <Button>Generate New Post</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{review.productTitle}</CardTitle>
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">
                        {review.rating}/5 stars
                      </span>
                    </div>
                    <CardDescription className="mb-4">
                      {review.reviewContent.slice(0, 200)}...
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created: {formatDate(review.createdAt)}</span>
                      {review.post && (
                        <>
                          <span>•</span>
                          <span>From post: {review.post.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <img
                      src={review.productImage}
                      alt={review.productTitle}
                      className="w-32 h-20 object-cover rounded-md"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Full Review Content */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Full Review:</h4>
                    <p className="text-sm whitespace-pre-wrap">{review.reviewContent}</p>
                  </div>
                  
                  {/* Product Link */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Product Link:</p>
                    <a
                      href={review.productLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {review.productLink}
                    </a>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleApprove(review.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve & Publish
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

