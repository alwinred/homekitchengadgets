import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/site-settings'

export async function GET() {
  try {
    const siteSettings = await getSiteSettings()
    return NextResponse.json(siteSettings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
