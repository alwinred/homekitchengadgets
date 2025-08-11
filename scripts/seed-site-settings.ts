import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding site settings...')

  // Check if site settings already exist
  const existingSettings = await prisma.siteSettings.findFirst()
  
  if (existingSettings) {
    console.log('Site settings already exist, skipping...')
    return
  }

  // Create default site settings
  const siteSettings = await prisma.siteSettings.create({
    data: {
      logoText: 'Kitchen Cursor',
      logoImage: null,
      useLogoImage: false,
      facebookUrl: null,
      twitterUrl: null,
      instagramUrl: null,
      tiktokUrl: null,
      youtubeUrl: null,
      linkedinUrl: null,
      footerAboutText: 'Discover in-depth product reviews, expert insights, and buying guides to help you make informed decisions on the products that matter most. From kitchen gadgets to tech gear, we test everything so you don\'t have to.',
      contactEmail: 'contact@kitchencursor.com'
    }
  })

  console.log('Site settings created:', siteSettings)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
