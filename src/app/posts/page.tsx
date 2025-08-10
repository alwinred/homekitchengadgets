import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/post-card'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Articles - Kitchen Cursor',
  description: 'Browse all our in-depth product reviews, expert insights, and buying guides.',
  openGraph: {
    title: 'All Articles - Kitchen Cursor',
    description: 'Browse all our in-depth product reviews, expert insights, and buying guides.',
    type: 'website',
  },
}

interface PostsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1')
  const postsPerPage = 12 // 4 per row × 3 rows
  const skip = (currentPage - 1) * postsPerPage

  // Get total count for pagination
  const totalPosts = await prisma.post.count({
    where: { status: 'PUBLISHED' },
  })

  const totalPages = Math.ceil(totalPosts / postsPerPage)

  // Get posts for current page
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    skip,
    take: postsPerPage,
    select: { 
      id: true, 
      slug: true, 
      title: true, 
      excerpt: true, 
      heroImage: true, 
      createdAt: true 
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <section className="text-center py-12 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          All Articles
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our complete collection of in-depth product reviews, expert insights, and comprehensive buying guides.
        </p>
      </section>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {currentPage > 1 && (
                <Link href={`/posts?page=${currentPage - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link key={pageNum} href={`/posts?page=${pageNum}`}>
                    <Button
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      className="w-10 h-10"
                    >
                      {pageNum}
                    </Button>
                  </Link>
                ))}
              </div>

              {currentPage < totalPages && (
                <Link href={`/posts?page=${currentPage + 1}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No articles published yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Check back soon for amazing content!
          </p>
        </div>
      )}

      {/* Back to Home */}
      <div className="text-center mt-12">
        <Link href="/">
          <Button variant="outline">
            ← Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
