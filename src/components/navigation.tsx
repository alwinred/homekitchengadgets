'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { 
  User, 
  Menu, 
  LogOut, 
  Settings, 
  Home, 
  FileText, 
  Star 
} from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navigation() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [siteSettings, setSiteSettings] = useState({
    logoText: 'Kitchen Cursor',
    logoImage: null,
    useLogoImage: false
  })

  const handleSignOut = () => {
    signOut()
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    // Fetch site settings for logo
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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            {siteSettings.useLogoImage && siteSettings.logoImage ? (
              <img 
                src={siteSettings.logoImage} 
                alt={siteSettings.logoText} 
                className="h-8 w-auto"
              />
            ) : (
              siteSettings.logoText
            )}
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/posts" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Articles
            </Link>
            <Link 
              href="/reviews" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Reviews
            </Link>
            
            {/* Desktop Sign In/Out Buttons */}
            {session?.user ? (
              <div className="flex items-center space-x-2">
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Link 
                    href="/" 
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                  <Link 
                    href="/posts" 
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Articles
                  </Link>
                  <Link 
                    href="/reviews" 
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Star className="h-4 w-4" />
                    Reviews
                  </Link>
                  
                  <div className="pt-4 border-t">
                    {session?.user ? (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground px-2">
                          Signed in as {session.user.name || session.user.email}
                        </div>
                        {session.user.role === 'ADMIN' && (
                          <Link 
                            href="/admin" 
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleSignOut}
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Link 
                        href="/auth/signin" 
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

