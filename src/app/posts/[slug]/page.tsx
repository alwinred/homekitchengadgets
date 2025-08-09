import { notFound } from 'next/navigation'
import { Metadata } from 'next'
// Removed ReactMarkdown - now using direct HTML rendering from Jodit editor
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ReviewCard } from '@/components/review-card'
import { ProductShowcase } from '@/components/product-showcase'
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
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.heroImage],
      type: 'article',
      url: `/posts/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.heroImage],
    },
    alternates: {
      canonical: `/posts/${slug}`,
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `/posts/${slug}`,
    author: {
      '@type': 'Organization',
      name: 'BlogReview Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BlogReview',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blogreview.com/logo.png',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.createdAt.toISOString()}>
              {formatDate(post.createdAt)}
            </time>
            <span>•</span>
            <span>BlogReview Team</span>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12 prose-headings:text-primary prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary prose-a:hover:underline prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:italic prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

                       {/* Product Showcase - Shows both manually curated and auto-detected products */}
               <ProductShowcase 
                 content={post.content} 
                 featuredProducts={post.featuredProducts.map(fp => ({
                   ...fp,
                   price: fp.price ?? undefined
                 }))}
               />

        {/* Google AdSense Placeholder */}
        <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center mb-12">
          <p className="text-muted-foreground">
            Google AdSense Ad Space
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Replace this with your actual AdSense code
          </p>
        </div>

        {/* Product Reviews */}
        {post.productReviews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Related Product Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {post.productReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}

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
