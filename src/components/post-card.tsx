import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import HeroImage from '@/components/hero-image'

interface PostCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt: string
    heroImage: string
    createdAt: Date
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/posts/${post.slug}`}>
        <div className="relative h-48 w-full">
          <HeroImage
            src={post.heroImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6">
          <CardTitle className="mb-2 line-clamp-2 hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <CardDescription className="mb-4 line-clamp-3">
            {post.excerpt}
          </CardDescription>
          <p className="text-sm text-muted-foreground">
            {formatDate(post.createdAt)}
          </p>
        </CardContent>
      </Link>
    </Card>
  )
}
