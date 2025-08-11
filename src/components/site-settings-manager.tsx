'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Upload, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface SiteSettings {
  id: string
  logoText: string
  logoImage: string | null
  useLogoImage: boolean
  facebookUrl: string | null
  twitterUrl: string | null
  instagramUrl: string | null
  tiktokUrl: string | null
  youtubeUrl: string | null
  linkedinUrl: string | null
  footerAboutText: string
  contactEmail: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  heroTitle: string
  heroDescription: string
  termsContent: string
  privacyContent: string
}

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/site-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        toast.error('Failed to load site settings')
      }
    } catch (error) {
      toast.error('Failed to load site settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      // Handle logo upload if there's a new file
      let logoImageUrl = settings.logoImage
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          logoImageUrl = uploadData.url
        } else {
          toast.error('Failed to upload logo image')
          setSaving(false)
          return
        }
      }

      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          logoImage: logoImageUrl,
        }),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
        setLogoFile(null)
        toast.success('Site settings saved successfully')
      } else {
        toast.error('Failed to save site settings')
      }
    } catch (error) {
      toast.error('Failed to save site settings')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setSettings(prev => prev ? { ...prev, useLogoImage: true } : null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!settings) {
    return <div>Failed to load site settings</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo Settings</CardTitle>
          <CardDescription>
            Configure your site logo. You can use either text or an uploaded image.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-logo-image"
              checked={settings.useLogoImage}
              onCheckedChange={(checked) => 
                setSettings(prev => prev ? { ...prev, useLogoImage: checked } : null)
              }
            />
            <Label htmlFor="use-logo-image">Use logo image instead of text</Label>
          </div>

          {settings.useLogoImage ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="logo-upload">Upload Logo Image</Label>
                <div className="mt-2">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="cursor-pointer"
                  />
                </div>
                {settings.logoImage && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Current logo:</p>
                    <img 
                      src={settings.logoImage} 
                      alt="Current logo" 
                      className="h-12 mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="logo-text">Logo Text</Label>
              <Input
                id="logo-text"
                value={settings.logoText}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, logoText: e.target.value } : null)
                }
                placeholder="Enter logo text"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Add your social media profile URLs. These will appear in the footer and contact page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebook-url">Facebook URL</Label>
              <Input
                id="facebook-url"
                type="url"
                value={settings.facebookUrl || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, facebookUrl: e.target.value || null } : null)
                }
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <Label htmlFor="twitter-url">Twitter URL</Label>
              <Input
                id="twitter-url"
                type="url"
                value={settings.twitterUrl || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, twitterUrl: e.target.value || null } : null)
                }
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
            <div>
              <Label htmlFor="instagram-url">Instagram URL</Label>
              <Input
                id="instagram-url"
                type="url"
                value={settings.instagramUrl || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, instagramUrl: e.target.value || null } : null)
                }
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            <div>
              <Label htmlFor="tiktok-url">TikTok URL</Label>
              <Input
                id="tiktok-url"
                type="url"
                value={settings.tiktokUrl || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, tiktokUrl: e.target.value || null } : null)
                }
                placeholder="https://tiktok.com/@yourhandle"
              />
            </div>
            <div>
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                type="url"
                value={settings.youtubeUrl || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, youtubeUrl: e.target.value || null } : null)
                }
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
            <div>
              <Label htmlFor="linkedin-url">LinkedIn URL</Label>
              <Input
                id="linkedin-url"
                type="url"
                value={settings.linkedinUrl || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, linkedinUrl: e.target.value || null } : null)
                }
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer About Section</CardTitle>
          <CardDescription>
            Customize the about text that appears in the footer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="footer-about">About Text</Label>
            <Textarea
              id="footer-about"
              value={settings.footerAboutText}
              onChange={(e) => 
                setSettings(prev => prev ? { ...prev, footerAboutText: e.target.value } : null)
              }
              placeholder="Enter the about text for the footer"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>
            Customize the main heading and description that appears at the top of your homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Hero Title</Label>
              <Input
                id="hero-title"
                value={settings.heroTitle || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, heroTitle: e.target.value } : null)
                }
                placeholder="Discover Amazing Products"
                maxLength={100}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Main heading for the homepage hero section. Current: {settings.heroTitle?.length || 0} characters
              </p>
            </div>
            <div>
              <Label htmlFor="hero-description">Hero Description</Label>
              <Textarea
                id="hero-description"
                value={settings.heroDescription || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, heroDescription: e.target.value } : null)
                }
                placeholder="In-depth reviews, expert insights, and buying guides to help you make informed decisions on the products that matter most."
                rows={3}
                maxLength={300}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Subtitle text for the homepage hero section. Current: {settings.heroDescription?.length || 0} characters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>
            Configure SEO settings for the homepage including title, meta description, and keywords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="seo-title">SEO Title</Label>
              <Input
                id="seo-title"
                value={settings.seoTitle || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, seoTitle: e.target.value } : null)
                }
                placeholder="Kitchen Cursor - Product Reviews & Tech Blog"
                maxLength={60}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Recommended: 50-60 characters. Current: {settings.seoTitle?.length || 0} characters
              </p>
            </div>
            <div>
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                value={settings.seoDescription || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, seoDescription: e.target.value } : null)
                }
                placeholder="Discover in-depth product reviews, tech insights, and buying guides to help you make informed decisions."
                rows={3}
                maxLength={160}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Recommended: 150-160 characters. Current: {settings.seoDescription?.length || 0} characters
              </p>
            </div>
            <div>
              <Label htmlFor="seo-keywords">Meta Keywords</Label>
              <Input
                id="seo-keywords"
                value={settings.seoKeywords || ''}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, seoKeywords: e.target.value } : null)
                }
                placeholder="product reviews, tech blog, buying guides, affiliate marketing"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separate keywords with commas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Update the contact email that appears on the contact page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => 
                setSettings(prev => prev ? { ...prev, contactEmail: e.target.value } : null)
              }
              placeholder="contact@yourdomain.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal Pages Content</CardTitle>
          <CardDescription>
            Edit the content for Terms of Use and Privacy Policy pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="terms-content">Terms of Use Content</Label>
              <Textarea
                id="terms-content"
                value={settings.termsContent || ''}
                onChange={(e) =>
                  setSettings(prev => prev ? { ...prev, termsContent: e.target.value } : null)
                }
                placeholder="Enter your Terms of Use content here..."
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Use Markdown formatting for headings, lists, and links
              </p>
            </div>
            
            <div>
              <Label htmlFor="privacy-content">Privacy Policy Content</Label>
              <Textarea
                id="privacy-content"
                value={settings.privacyContent || ''}
                onChange={(e) =>
                  setSettings(prev => prev ? { ...prev, privacyContent: e.target.value } : null)
                }
                placeholder="Enter your Privacy Policy content here..."
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Use Markdown formatting for headings, lists, and links
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
