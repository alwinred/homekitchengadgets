'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              BlogReview
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/reviews" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Reviews
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

