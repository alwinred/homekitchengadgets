import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'
import { Metadata } from 'next'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Contact Us - Kitchen Cursor',
  description: 'Get in touch with Kitchen Cursor. We\'re here to help with your questions about kitchen products and reviews.',
  openGraph: {
    title: 'Contact Us - Kitchen Cursor',
    description: 'Get in touch with Kitchen Cursor. We\'re here to help with your questions about kitchen products and reviews.',
    type: 'website',
  },
}

export default async function ContactPage() {
  const siteSettings = await getSiteSettings()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-primary">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">About Kitchen Cursor</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Welcome to Kitchen Cursor, your trusted source for in-depth kitchen product reviews and expert insights. 
                We&apos;re passionate about helping you make informed decisions when it comes to your kitchen investments.
              </p>
              <p>
                Our team of experts thoroughly tests and reviews a wide range of kitchen appliances, gadgets, and tools 
                to provide you with honest, detailed assessments that you can rely on.
              </p>
              <p>
                Whether you&apos;re looking for the perfect coffee maker, air fryer, or any other kitchen essential, 
                we&apos;re here to guide you through the selection process with comprehensive reviews and buying guides.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Email Us</h3>
                <p className="text-muted-foreground mb-4">
                  Have a question, suggestion, or feedback? We&apos;d love to hear from you!
                </p>
                <a 
                  href={`mailto:${siteSettings.contactEmail}`} 
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  <Mail className="h-5 w-5" />
                  {siteSettings.contactEmail}
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                <p className="text-muted-foreground mb-4">
                  Stay updated with our latest reviews, tips, and kitchen insights.
                </p>
                <div className="flex gap-4">
                  {siteSettings.facebookUrl && (
                    <a 
                      href={siteSettings.facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Follow us on Facebook"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  )}
                  {siteSettings.twitterUrl && (
                    <a 
                      href={siteSettings.twitterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Follow us on Twitter"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                  )}
                  {siteSettings.instagramUrl && (
                    <a 
                      href={siteSettings.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Follow us on Instagram"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {siteSettings.tiktokUrl && (
                    <a 
                      href={siteSettings.tiktokUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Follow us on TikTok"
                    >
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                  )}
                  {siteSettings.youtubeUrl && (
                    <a 
                      href={siteSettings.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Follow us on YouTube"
                    >
                      <Youtube className="h-6 w-6" />
                    </a>
                  )}
                  {siteSettings.linkedinUrl && (
                    <a 
                      href={siteSettings.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Follow us on LinkedIn"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Response Time</h3>
                <p className="text-muted-foreground">
                  We typically respond to all inquiries within 24-48 hours during business days. 
                  For urgent matters, please include &quot;URGENT&quot; in your email subject line.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 pt-8 border-t">
          <h3 className="text-xl font-semibold mb-4">Ready to Explore Our Reviews?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts">
              <Button size="lg" variant="outline">
                Browse All Articles
              </Button>
            </Link>
            <Link href="/reviews">
              <Button size="lg">
                View Product Reviews
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
