'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Eye, Trash2, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import HeroImage from '@/components/hero-image'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  heroImage: string
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED'
  createdAt: string
  updatedAt: string
}

export default function AdminPostsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'REVIEW' | 'PUBLISHED'>('ALL')

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }

    fetchPosts()
  }, [session, status, router])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500'
      case 'REVIEW': return 'bg-yellow-500'
      case 'PUBLISHED': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredPosts = posts.filter(post => 
    filter === 'ALL' || post.status === filter
  )

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Posts</h1>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage all your blog posts
          </p>
        </div>
        <Link href="/admin/generate">
          <Button className="gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Generate New Post
          </Button>
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {['ALL', 'DRAFT', 'REVIEW', 'PUBLISHED'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status as 'ALL' | 'DRAFT' | 'REVIEW' | 'PUBLISHED')}
            size="sm"
          >
            {status}
            {status !== 'ALL' && (
              <Badge variant="secondary" className="ml-2">
                {posts.filter(p => p.status === status).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <HeroImage
                src={post.heroImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <Badge 
                className={`absolute top-2 right-2 text-white ${getStatusColor(post.status)}`}
              >
                {post.status}
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="line-clamp-2 text-lg">
                {post.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground mb-4">
                <div>Created: {formatDate(new Date(post.createdAt))}</div>
                <div>Updated: {formatDate(new Date(post.updatedAt))}</div>
              </div>
              
              <div className="flex gap-2">
                <Link href={`/admin/posts/${post.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                
                <Link href={`/posts/${post.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(post.id)}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No posts found
          </h3>
          <p className="text-muted-foreground mb-4">
            {filter === 'ALL' 
              ? 'Get started by generating your first post'
              : `No posts with status "${filter}"`
            }
          </p>
          <Link href="/admin/generate">
            <Button>Generate Your First Post</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

