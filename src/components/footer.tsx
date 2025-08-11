'use client'

import Link from 'next/link'
import { FileText, Star, Facebook, Twitter, Instagram, Home, FileText as FileTextIcon, Shield, Mail, Youtube, Linkedin } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Footer() {
  const [siteSettings, setSiteSettings] = useState({
    logoText: 'Kitchen Cursor',
    useLogoImage: false,
    logoImage: null,
    facebookUrl: null,
    twitterUrl: null,
    instagramUrl: null,
    tiktokUrl: null,
    youtubeUrl: null,
    linkedinUrl: null,
    footerAboutText: 'Discover in-depth product reviews, expert insights, and buying guides to help you make informed decisions on the products that matter most. From kitchen gadgets to tech gear, we test everything so you don&apos;t have to.'
  })

  useEffect(() => {
    // Fetch site settings
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        setSiteSettings(data)
      })
      .catch(err => {
        console.error('Failed to load site settings:', err)
      })
  }, [])

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              {siteSettings.useLogoImage && siteSettings.logoImage ? (
                <img 
                  src={siteSettings.logoImage} 
                  alt={siteSettings.logoText} 
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">{siteSettings.logoText}</span>
              )}
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              {siteSettings.footerAboutText}
            </p>
            <div className="flex space-x-4">
              {siteSettings.facebookUrl && (
                <a 
                  href={siteSettings.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
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
                  <Twitter className="h-5 w-5" />
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
                  <Instagram className="h-5 w-5" />
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
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
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
                  <Youtube className="h-5 w-5" />
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
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Main Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/posts" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Articles
                </Link>
              </li>
              <li>
                <Link 
                  href="/reviews" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Reviews
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Additional Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/terms" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FileTextIcon className="h-4 w-4" />
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Kitchen Cursor. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Made with ❤️ for food lovers and tech enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
