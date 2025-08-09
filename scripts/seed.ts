import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim() // Remove leading/trailing whitespace
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminEmail = 'admin@example.com'
  const adminPassword = 'admin123'
  
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
  } else {
    // Hash the password
    const passwordHash = await bcrypt.hash(adminPassword, 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        name: 'Admin User',
      }
    })

    console.log('✅ Admin user created:', {
      id: admin.id,
      email: admin.email,
      role: admin.role
    })
  }

  // Create sample published post
  const existingPost = await prisma.post.findFirst({
    where: { status: 'PUBLISHED' }
  })

  if (!existingPost) {
    const postTitle = 'Welcome to BlogReview - Your Ultimate Product Review Destination'
    const samplePost = await prisma.post.create({
      data: {
        title: postTitle,
        slug: generateSlug(postTitle),
        excerpt: 'Discover honest, in-depth product reviews that help you make informed purchasing decisions. From kitchen gadgets to tech gear, we test everything so you don\'t have to.',
        content: `# Welcome to BlogReview

Welcome to BlogReview, your trusted source for comprehensive product reviews and buying guides!

## What We Do

At BlogReview, we're passionate about helping you make informed purchasing decisions. Our team thoroughly tests and reviews products across various categories to provide you with honest, detailed insights.

## Our Review Process

1. **Thorough Testing**: We use each product extensively in real-world conditions
2. **Honest Assessment**: We highlight both pros and cons of every product
3. **Value Analysis**: We consider price-to-performance ratios
4. **User Experience**: We evaluate ease of use and practical benefits

## Categories We Cover

- **Kitchen & Cooking**: From stand mixers to coffee makers
- **Technology**: Gadgets, accessories, and smart home devices  
- **Fitness & Health**: Workout equipment and wellness products
- **Home & Garden**: Tools and equipment for your living space

## Why Trust Our Reviews?

Our reviews are:
- ✅ **Independent**: We're not influenced by manufacturers
- ✅ **Detailed**: Every aspect is thoroughly evaluated
- ✅ **Practical**: Real-world testing in everyday conditions
- ✅ **Honest**: We tell you what works and what doesn't

## Get Started

Browse our latest reviews and find the perfect products for your needs. Have a product you'd like us to review? We'd love to hear from you!

Happy shopping! 🛍️`,
        heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1024&h=1024&fit=crop',
        status: 'PUBLISHED'
      }
    })

    // Create sample product reviews for the post
    await prisma.productReview.createMany({
      data: [
        {
          productTitle: 'KitchenAid Artisan Stand Mixer',
          productImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
          productLink: 'https://amazon.com/dp/B00005UP2P',
          rating: 5,
          reviewContent: 'The KitchenAid Artisan Stand Mixer is a kitchen powerhouse that has completely transformed my baking experience. After six months of regular use, I can confidently say this mixer lives up to its legendary reputation. The 5-quart bowl is perfect for most home baking needs, easily handling everything from single batches of cookies to large bread doughs. The planetary mixing action ensures thorough ingredient incorporation, and the tilt-head design makes it easy to add ingredients or change attachments. While the price point is higher than basic mixers, the build quality and performance justify the investment.',
          status: 'PUBLISHED',
          postId: samplePost.id
        },
        {
          productTitle: 'Breville Bambino Plus Espresso Machine',
          productImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
          productLink: 'https://amazon.com/dp/B07JBQZPX7',
          rating: 4,
          reviewContent: 'The Breville Bambino Plus strikes an excellent balance between performance and compactness. This machine delivers café-quality espresso shots with impressive consistency, thanks to its precise temperature control and 15-bar pump. The automatic milk frothing is a standout feature - it creates silky microfoam perfect for latte art. Setup is straightforward, and the machine heats up in just 3 seconds. The only drawbacks are the small water tank capacity and the need for frequent descaling in hard water areas. Overall, it\'s an excellent choice for espresso enthusiasts with limited counter space.',
          status: 'PUBLISHED',
          postId: samplePost.id
        }
      ]
    })

    console.log('✅ Sample post and reviews created')
  } else {
    console.log('✅ Sample content already exists')
  }

  console.log('🎉 Database seed completed!')
  console.log('\n📝 Admin credentials:')
  console.log(`Email: ${adminEmail}`)
  console.log(`Password: ${adminPassword}`)
  console.log('\n🚀 You can now run: npm run dev')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
