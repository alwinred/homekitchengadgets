import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { FileText, Eye, PlusCircle, Star, Settings } from 'lucide-react'

export default async function AdminDashboard() {
  // Get statistics
  const [
    totalPosts,
    publishedPosts,
    postsInReview,
    totalReviews,
    reviewsInQueue
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'REVIEW' } }),
    prisma.productReview.count(),
    prisma.productReview.count({ where: { status: 'REVIEW' } })
  ])

  const stats = [
    {
      title: 'Total Posts',
      value: totalPosts,
      description: `${publishedPosts} published`,
      icon: FileText,
      href: '/admin/posts'
    },
    {
      title: 'Posts in Review',
      value: postsInReview,
      description: 'Waiting for approval',
      icon: Eye,
      href: '/admin/review-queue'
    },
    {
      title: 'Product Reviews',
      value: totalReviews,
      description: `${reviewsInQueue} pending`,
      icon: Star,
      href: '/admin/reviews-queue'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and product reviews
          </p>
        </div>
        <Link href="/admin/generate">
          <Button size="lg" className="gap-2 whitespace-nowrap">
            <PlusCircle className="h-5 w-5" />
            Generate New Post
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/review-queue" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Eye className="h-4 w-4" />
                Review Posts ({postsInReview})
              </Button>
            </Link>
            <Link href="/admin/reviews-queue" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Star className="h-4 w-4" />
                Review Product Reviews ({reviewsInQueue})
              </Button>
            </Link>
            <Link href="/admin/generate" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <PlusCircle className="h-4 w-4" />
                Generate New Content
              </Button>
            </Link>
            <Link href="/admin/site-settings" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                Site Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest posts and reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            {postsInReview > 0 || reviewsInQueue > 0 ? (
              <div className="space-y-2">
                {postsInReview > 0 && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Posts awaiting review</span>
                    <span className="text-sm font-medium text-orange-600">
                      {postsInReview}
                    </span>
                  </div>
                )}
                {reviewsInQueue > 0 && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Reviews awaiting approval</span>
                    <span className="text-sm font-medium text-orange-600">
                      {reviewsInQueue}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No pending items. Great job keeping up with the content!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

