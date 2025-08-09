'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductManager, ManagedProduct } from '@/components/product-manager'
import { FeaturedProductsManager, FeaturedProduct } from '@/components/featured-products-manager'
import { JoditWysiwygEditor } from '@/components/jodit-editor'
import { Post, PostStatus, ProductReview, FeaturedProduct as PrismaFeaturedProduct } from '@prisma/client'
import { Save, Eye, ArrowLeft } from 'lucide-react'
import HeroImage from '@/components/hero-image'



interface EditPostPageProps {
  params: Promise<{ id: string }>
}

interface PostWithProducts extends Post {
  productReviews: ProductReview[]
  featuredProducts: PrismaFeaturedProduct[]
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [post, setPost] = useState<PostWithProducts | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [products, setProducts] = useState<ManagedProduct[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    heroImage: '',
    status: 'DRAFT' as PostStatus,
    // SEO Fields
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    focusKeyword: '',
    readingTime: 0
  })
  const router = useRouter()

  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    try {
      const { id } = await params
      const response = await fetch(`/api/admin/posts/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }
      const postData = await response.json()
      setPost(postData)
      setFormData({
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        heroImage: postData.heroImage,
        status: postData.status,
        // SEO Fields
        seoTitle: postData.seoTitle || '',
        seoDescription: postData.seoDescription || '',
        seoKeywords: postData.seoKeywords || '',
        focusKeyword: postData.focusKeyword || '',
        readingTime: postData.readingTime || 0
      })
      
      // Convert ProductReview to ManagedProduct format
      if (postData.productReviews) {
        const managedProducts: ManagedProduct[] = postData.productReviews.map((review: ProductReview) => ({
          id: review.id,
          productTitle: review.productTitle,
          productImage: review.productImage,
          productLink: review.productLink,
          rating: review.rating,
          reviewContent: review.reviewContent,
          status: review.status
        }))
        setProducts(managedProducts)
      }

      // Convert FeaturedProduct to FeaturedProduct format
      if (postData.featuredProducts) {
        const featuredProductsData: FeaturedProduct[] = postData.featuredProducts.map((fp: PrismaFeaturedProduct) => ({
          id: fp.id,
          productName: fp.productName,
          productImage: fp.productImage,
          productLink: fp.productLink,
          price: fp.price || undefined,
          rating: fp.rating,
          description: fp.description
        }))
        setFeaturedProducts(featuredProductsData)
      }


    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { id } = await params
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      // Redirect back to review queue or dashboard
      router.push('/admin/review-queue')
    } catch (error) {
      console.error('Error updating post:', error)
      setError('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  // Calculate reading time based on content (average 200 words per minute)
  const calculateReadingTime = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
    return Math.ceil(wordCount / 200)
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Auto-calculate reading time when content changes
      if (field === 'content') {
        newData.readingTime = calculateReadingTime(value)
      }
      
      return newData
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => router.push('/admin')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Edit Post</h1>
          <p className="text-muted-foreground">
            Make changes to your blog post
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                    Excerpt
                  </label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief description of the post"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="heroImage" className="block text-sm font-medium mb-2">
                    Hero Image URL
                  </label>
                  <Input
                    id="heroImage"
                    value={formData.heroImage}
                    onChange={(e) => handleInputChange('heroImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your post for search engines and social media sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium mb-2">
                    SEO Title
                    <span className="text-muted-foreground ml-1">(60 characters recommended)</span>
                  </label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    placeholder="Custom title for search engines"
                    maxLength={60}
                  />
                  <div className="text-right text-xs text-muted-foreground mt-1">
                    {formData.seoTitle.length}/60 characters
                  </div>
                </div>

                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium mb-2">
                    Meta Description
                    <span className="text-muted-foreground ml-1">(160 characters recommended)</span>
                  </label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    placeholder="Description that appears in search results"
                    maxLength={160}
                    rows={3}
                  />
                  <div className="text-right text-xs text-muted-foreground mt-1">
                    {formData.seoDescription.length}/160 characters
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="focusKeyword" className="block text-sm font-medium mb-2">
                      Focus Keyword
                    </label>
                    <Input
                      id="focusKeyword"
                      value={formData.focusKeyword}
                      onChange={(e) => handleInputChange('focusKeyword', e.target.value)}
                      placeholder="Primary keyword to target"
                    />
                  </div>

                  <div>
                    <label htmlFor="readingTime" className="block text-sm font-medium mb-2">
                      Reading Time (minutes)
                    </label>
                    <Input
                      id="readingTime"
                      type="number"
                      min="1"
                      max="60"
                      value={formData.readingTime}
                      onChange={(e) => handleInputChange('readingTime', parseInt(e.target.value) || 0)}
                      placeholder="Estimated reading time"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="seoKeywords" className="block text-sm font-medium mb-2">
                    SEO Keywords
                    <span className="text-muted-foreground ml-1">(comma separated)</span>
                  </label>
                  <Textarea
                    id="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    rows={2}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Use relevant keywords that people might search for. Separate with commas.
                  </div>
                </div>
              </CardContent>
            </Card>

            <JoditWysiwygEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Write your post content here..."
            />

            {/* Featured Products Management */}
            {post && (
              <FeaturedProductsManager
                postId={post.id}
                featuredProducts={featuredProducts}
                onFeaturedProductsChange={setFeaturedProducts}

              />
            )}

            {/* Product Reviews Management */}
            {post && (
              <ProductManager
                postId={post.id}
                products={products}
                onProductsChange={setProducts}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="REVIEW">Review</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={saving} className="gap-2">
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/posts/${post.id}`)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hero Image Preview */}
            {formData.heroImage && (
              <Card>
                <CardHeader>
                  <CardTitle>Hero Image Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-32 w-full bg-muted rounded-md overflow-hidden">
                    <HeroImage
                      src={formData.heroImage}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Preview of how the hero image will appear on the blog post
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
