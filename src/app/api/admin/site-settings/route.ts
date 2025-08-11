import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create site settings
    let siteSettings = await prisma.siteSettings.findFirst()
    
    if (!siteSettings) {
      siteSettings = await prisma.siteSettings.create({
        data: {}
      })
    }

    return NextResponse.json(siteSettings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Get or create site settings
    let siteSettings = await prisma.siteSettings.findFirst()
    
    if (!siteSettings) {
      siteSettings = await prisma.siteSettings.create({
        data: body
      })
    } else {
      siteSettings = await prisma.siteSettings.update({
        where: { id: siteSettings.id },
        data: body
      })
    }

    return NextResponse.json(siteSettings)
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
