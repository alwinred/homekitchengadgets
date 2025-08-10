import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Facebook, Twitter, Instagram } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Kitchen Cursor',
  description: 'Get in touch with Kitchen Cursor. We\'re here to help with your questions about kitchen products and reviews.',
  openGraph: {
    title: 'Contact Us - Kitchen Cursor',
    description: 'Get in touch with Kitchen Cursor. We\'re here to help with your questions about kitchen products and reviews.',
    type: 'website',
  },
}

export default function ContactPage() {
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
                We're passionate about helping you make informed decisions when it comes to your kitchen investments.
              </p>
              <p>
                Our team of experts thoroughly tests and reviews a wide range of kitchen appliances, gadgets, and tools 
                to provide you with honest, detailed assessments that you can rely on.
              </p>
              <p>
                Whether you're looking for the perfect coffee maker, air fryer, or any other kitchen essential, 
                we're here to guide you through the selection process with comprehensive reviews and buying guides.
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
                  Have a question, suggestion, or feedback? We'd love to hear from you!
                </p>
                <a 
                  href="mailto:contact@kitchencursor.com" 
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  <Mail className="h-5 w-5" />
                  contact@kitchencursor.com
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                <p className="text-muted-foreground mb-4">
                  Stay updated with our latest reviews, tips, and kitchen insights.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://facebook.com/kitchencursor" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://twitter.com/kitchencursor" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://instagram.com/kitchencursor" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Response Time</h3>
                <p className="text-muted-foreground">
                  We typically respond to all inquiries within 24-48 hours during business days. 
                  For urgent matters, please include "URGENT" in your email subject line.
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
