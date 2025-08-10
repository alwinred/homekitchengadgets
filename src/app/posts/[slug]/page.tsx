import { notFound } from 'next/navigation'
import { Metadata } from 'next'
// Removed ReactMarkdown - now using direct HTML rendering from Jodit editor
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ReviewCard } from '@/components/review-card'
import { ProductShowcase } from '@/components/product-showcase'
import { RelatedReviews } from '@/components/related-reviews'
import { AdSenseAd } from '@/components/adsense-ad'
import HeroImage from '@/components/hero-image'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
  })

  if (!post) {
    return {
      title: 'Post Not Found | BlogReview',
      description: 'The requested blog post could not be found.',
    }
  }

  // Use SEO title if available, otherwise fallback to regular title with site name
  const title = post.seoTitle || `${post.title} | BlogReview`
  const description = post.seoDescription || post.excerpt
  const keywords = post.seoKeywords ? post.seoKeywords.split(',').map(k => k.trim()) : undefined

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'BlogReview Team' }],
    creator: 'BlogReview',
    publisher: 'BlogReview',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://yourdomain.com/posts/${slug}`,
      siteName: 'BlogReview',
      images: [
        {
          url: post.heroImage,
          width: 1024,
          height: 1024,
          alt: post.title,
        }
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      section: 'Product Reviews',
      tags: post.seoKeywords ? post.seoKeywords.split(',').map(k => k.trim()) : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.heroImage],
      creator: '@BlogReview',
      site: '@BlogReview',
    },
    alternates: {
      canonical: `https://yourdomain.com/posts/${slug}`,
    },
    other: {
      'article:author': 'BlogReview Team',
      'article:section': 'Product Reviews',
      'article:tag': post.focusKeyword || '',
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      productReviews: {
        where: { status: 'PUBLISHED' },
      },
      featuredProducts: true,
    },
  })

  if (!post) {
    notFound()
  }

  // Comprehensive structured data for SEO and rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: post.heroImage,
      width: 1024,
      height: 1024,
      alt: post.title,
    },
    author: {
      '@type': 'Organization',
      name: 'BlogReview Team',
      url: 'https://yourdomain.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BlogReview',
      url: 'https://yourdomain.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png',
        width: 600,
        height: 60,
      },
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yourdomain.com/posts/${slug}`,
    },
    url: `https://yourdomain.com/posts/${slug}`,
    articleSection: 'Product Reviews',
    keywords: post.seoKeywords || post.focusKeyword || '',
    wordCount: post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
    ...(post.readingTime && {
      timeRequired: `PT${post.readingTime}M`,
    }),
    ...(post.productReviews.length > 0 && {
      review: post.productReviews.map(review => ({
        '@type': 'Review',
        name: review.productTitle,
        reviewBody: review.reviewContent,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
        },
        itemReviewed: {
          '@type': 'Product',
          name: review.productTitle,
          image: review.productImage,
          url: review.productLink,
        },
      })),
    }),
  }

  // Breadcrumb structured data for navigation
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://yourdomain.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Product Reviews',
        item: 'https://yourdomain.com/#reviews',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://yourdomain.com/posts/${slug}`,
      },
    ],
  }

  return (
    <>
      {/* Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Image */}
        <div className="relative h-96 mb-8 rounded-xl overflow-hidden bg-muted">
          <HeroImage
            src={post.heroImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <time dateTime={post.createdAt.toISOString()}>
              📅 {formatDate(post.createdAt)}
            </time>
            <span>•</span>
            <span>✍️ BlogReview Team</span>
            {post.readingTime && (
              <>
                <span>•</span>
                <span>⏱️ {post.readingTime} min read</span>
              </>
            )}
            {post.focusKeyword && (
              <>
                <span>•</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  🎯 {post.focusKeyword}
                </span>
              </>
            )}
          </div>
          
          {/* SEO Keywords Display */}
          {post.seoKeywords && (
            <div className="mb-4">
              <span className="text-sm text-muted-foreground mb-2 block">
                📋 Related Topics:
              </span>
              <div className="flex flex-wrap gap-2">
                {post.seoKeywords.split(',').map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs hover:bg-muted/80 transition-colors"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* AdSense Ad Unit 1: After Related Topics */}
          <AdSenseAd adSlot="article-top-after-topics" />
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12 prose-headings:text-primary prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary prose-a:hover:underline prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:italic prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* AdSense Ad Unit 2: Before Conclusion */}
        <AdSenseAd adSlot="article-before-conclusion" />

                       {/* Product Showcase - Shows both manually curated and auto-detected products */}
               <ProductShowcase 
                 content={post.content} 
                 featuredProducts={post.featuredProducts.map(fp => ({
                   ...fp,
                   price: fp.price ?? undefined
                 }))}
               />

        {/* AdSense Ad Unit 3: Between Featured Products and Related Reviews */}
        <AdSenseAd adSlot="article-between-products-reviews" />

        {/* Related Reviews */}
        <RelatedReviews reviews={post.productReviews} />

        {/* Amazon Affiliate Disclaimer */}
        <div className="bg-muted/30 rounded-lg p-6 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Affiliate Disclaimer:</p>
          <p>
            This post may contain affiliate links. When you buy through links on our site, 
            we may earn an affiliate commission at no additional cost to you. This helps 
            support our content creation and allows us to continue providing valuable reviews 
            and insights.
          </p>
        </div>
      </article>
    </>
  )
}
