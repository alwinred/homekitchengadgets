import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Star, ExternalLink, ArrowLeft, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

interface ReviewPageProps {
  params: Promise<{ id: string }>
}

async function getReview(id: string) {
  const review = await prisma.productReview.findUnique({
    where: { 
      id: id,
      status: 'PUBLISHED'
    },
    include: {
      post: {
        select: {
          title: true,
          slug: true
        }
      }
    }
  })

  return review
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { id } = await params
  const review = await getReview(id)

  if (!review) {
    return {
      title: 'Review Not Found',
    }
  }

  const title = `${review.productTitle} Review - ${review.rating}/5 Stars`
  const description = review.reviewContent.length > 160 
    ? review.reviewContent.substring(0, 157) + '...'
    : review.reviewContent

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [review.productImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [review.productImage],
    },
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params
  const review = await getReview(id)

  if (!review) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const readingTime = Math.ceil(review.reviewContent.split(' ').length / 200)

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: review.productTitle,
      image: review.productImage,
      url: review.productLink,
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
    datePublished: review.createdAt.toISOString(),
    dateModified: review.updatedAt.toISOString(),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/reviews" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reviews
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            {review.productTitle} Review
          </h1>
          
          {/* Rating */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < review.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
              <span className="ml-2 text-xl font-semibold text-primary">
                {review.rating}/5 Stars
              </span>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Reviewed {formatDate(review.createdAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
            <span>•</span>
            <span>by BlogReview Team</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Product Image */}
            <div className="mb-8">
              <img
                src={review.productImage}
                alt={review.productTitle}
                className="w-full max-w-md mx-auto h-64 object-contain rounded-lg bg-muted"
              />
            </div>

            {/* Review Content */}
            <article className="prose prose-lg max-w-none">
              <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {review.reviewContent}
              </div>
            </article>

            {/* Related Post */}
            {review.post && (
              <div className="mt-12 p-6 bg-muted/30 rounded-xl border">
                <h3 className="text-xl font-bold mb-2">Featured In</h3>
                <p className="text-muted-foreground mb-4">
                  This review was featured in our comprehensive article:
                </p>
                <Link 
                  href={`/posts/${review.post.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  📰 {review.post.title}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Product Information Card */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Product Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        Product
                      </p>
                      <p className="font-semibold">
                        {review.productTitle}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        Our Rating
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-primary">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
                        Get This Product
                      </p>
                      <Link 
                        href={review.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          View on Amazon
                        </button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Summary */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Review Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Rating</span>
                      <span className="font-bold text-primary">{review.rating}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Review Date</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Reading Time</span>
                      <span className="text-sm text-muted-foreground">
                        {readingTime} min
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
