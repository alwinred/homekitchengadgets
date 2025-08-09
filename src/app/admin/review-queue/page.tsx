'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Post, ProductReview } from '@prisma/client'
import { Edit, Eye, Trash2, CheckCircle } from 'lucide-react'

type PostWithReviews = Post & {
  productReviews: ProductReview[]
}

export default function ReviewQueuePage() {
  const [posts, setPosts] = useState<PostWithReviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/review-queue')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (postId: string, status: 'PUBLISHED' | 'DRAFT') => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      // Refresh the posts list
      fetchPosts()
    } catch (error) {
      console.error('Error updating post:', error)
      setError('Failed to update post')
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

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      // Refresh the posts list
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      setError('Failed to delete post')
    }
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
          <h1 className="text-3xl font-bold text-primary">Review Queue</h1>
          <p className="text-muted-foreground">
            Posts waiting for your review and approval
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No posts in review queue</h3>
            <p className="text-muted-foreground mb-4">
              All posts have been reviewed. Generate new content to see items here.
            </p>
            <Link href="/admin/generate">
              <Button>Generate New Post</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{post.title}</CardTitle>
                    <CardDescription className="mb-4">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created: {formatDate(post.createdAt)}</span>
                      {post.productReviews.length > 0 && (
                        <span>• {post.productReviews.length} product reviews</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <img
                      src={post.heroImage}
                      alt={post.title}
                      className="w-32 h-20 object-cover rounded-md"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Link href={`/posts/${post.slug}`} target="_blank">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </Link>
                  
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleStatusUpdate(post.id, 'PUBLISHED')}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Publish
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
