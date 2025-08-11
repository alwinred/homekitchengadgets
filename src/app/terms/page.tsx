import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { marked } from 'marked'

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await prisma.siteSettings.findFirst()
  
  return {
    title: 'Terms of Use - Kitchen Cursor',
    description: 'Terms of Use and conditions for using Kitchen Cursor website and services.',
    openGraph: {
      title: 'Terms of Use - Kitchen Cursor',
      description: 'Terms of Use and conditions for using Kitchen Cursor website and services.',
      type: 'website',
    },
  }
}

export default async function TermsPage() {
  const siteSettings = await prisma.siteSettings.findFirst()
  const termsContent = siteSettings?.termsContent || '## Terms of Use\n\nContent not available.'

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-primary">Terms of Use</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div 
            className="prose prose-lg max-w-none prose-headings:text-primary prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary prose-a:hover:underline"
            dangerouslySetInnerHTML={{ __html: marked(termsContent) }}
          />
        </div>
      </div>
    </div>
  )
}
