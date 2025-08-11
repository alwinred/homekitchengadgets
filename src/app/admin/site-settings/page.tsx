import { SiteSettingsManager } from '@/components/site-settings-manager'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SiteSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-primary">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage your site&apos;s logo, social media links, and footer content
        </p>
      </div>
      
      <SiteSettingsManager />
    </div>
  )
}
