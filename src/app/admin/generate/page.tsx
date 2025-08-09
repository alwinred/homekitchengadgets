'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'

export default function GeneratePostPage() {
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/admin/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      await response.json()
      
      // Redirect to review queue or edit page
      router.push('/admin/review-queue')
    } catch (error) {
      console.error('Error generating post:', error)
      setError('Failed to generate post. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const exampleTopics = [
    'Best Kitchen Gadgets for 2024',
    'Ultimate Coffee Making Guide',
    'Home Workout Equipment Reviews',
    'Smart Home Technology Trends',
    'Sustainable Living Products',
    'Photography Equipment for Beginners'
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8" />
          Generate New Post
        </h1>
        <p className="text-muted-foreground">
          Use AI to create comprehensive blog posts with product reviews and affiliate links
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Topic</CardTitle>
          <CardDescription>
            Enter a topic or product category you&apos;d like to write about. 
            Our AI will generate a comprehensive post with related product reviews.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium mb-2">
                Topic or Product Category
              </label>
              <Input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Best Kitchen Appliances for Small Kitchens"
                disabled={isGenerating}
                required
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isGenerating || !topic.trim()}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Post...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Post
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Example Topics */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Example Topics</CardTitle>
          <CardDescription>
            Click on any topic below to use it as a starting point
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleTopics.map((exampleTopic, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start h-auto p-3 text-left"
                onClick={() => setTopic(exampleTopic)}
                disabled={isGenerating}
              >
                {exampleTopic}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Process Info */}
      {isGenerating && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generation in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Creating hero image with DALL-E 3...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Generating blog post content...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Finding related Amazon products...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Writing product reviews...</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This process may take 1-2 minutes. Please don&apos;t close this page.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

