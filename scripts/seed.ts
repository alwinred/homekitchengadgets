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
        
        // SEO Fields
        seoTitle: 'Best Product Reviews 2024 | Honest Buying Guides | BlogReview',
        seoDescription: 'Find the best products with our honest, detailed reviews. Compare prices, features, and ratings for kitchen gadgets, tech gear, and more. Make informed buying decisions.',
        seoKeywords: 'product reviews, buying guides, kitchen gadgets, tech reviews, product comparisons, best products 2024',
        focusKeyword: 'product reviews',
        readingTime: 3,
        
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

    // Create a second SEO-optimized post
    const coffeePostTitle = 'Top Coffee Makers to Brew Perfect Coffee in 2025'
    const coffeePost = await prisma.post.create({
      data: {
        title: coffeePostTitle,
        slug: generateSlug(coffeePostTitle),
        excerpt: 'Discover the best coffee makers of 2025 with our comprehensive review guide. From drip coffee makers to espresso machines, find your perfect brewing companion.',
        
        // SEO Fields
        seoTitle: 'Best Coffee Makers 2025 | Top Rated Brewing Machines Review',
        seoDescription: 'Find the perfect coffee maker in 2025. Compare top-rated drip coffee makers, espresso machines, and French presses. Expert reviews, ratings, and buying guides.',
        seoKeywords: 'best coffee makers 2025, drip coffee maker reviews, espresso machine guide, coffee brewing equipment, top rated coffee makers',
        focusKeyword: 'best coffee makers 2025',
        readingTime: 8,
        
        content: `<h1>Top Coffee Makers to Brew Perfect Coffee in 2025</h1>

<p>Finding the perfect coffee maker can transform your daily routine. Whether you're a casual coffee drinker or a serious enthusiast, having the right brewing equipment makes all the difference. In this comprehensive guide, we'll explore the best coffee makers of 2025, covering everything from budget-friendly drip machines to high-end espresso makers.</p>

<h2>Our Testing Process</h2>
<p>We spent over 200 hours testing 25 different coffee makers, evaluating them on brew quality, ease of use, durability, and value for money. Each machine was tested with various coffee types and grind sizes to ensure consistent performance.</p>

<h2>Best Overall: Technivorm Moccamaster</h2>
<p>The Technivorm Moccamaster consistently delivers exceptional coffee with precise temperature control and optimal extraction time. Its handmade construction and 5-year warranty make it a worthwhile investment for serious coffee lovers.</p>

<h3>Key Features:</h3>
<ul>
<li>Precise 196-205°F brewing temperature</li>
<li>4-6 minute optimal extraction time</li>
<li>Thermal carafe keeps coffee hot for hours</li>
<li>Manual drip-stop brew-basket</li>
<li>SCAA certified</li>
</ul>

<h2>Best Budget Option: Hamilton Beach 12-Cup</h2>
<p>For those seeking quality coffee without breaking the bank, the Hamilton Beach 12-Cup offers excellent value. It features programmable brewing, auto shut-off, and a pause-and-serve function.</p>

<h2>Best for Espresso: Breville Barista Express</h2>
<p>The Breville Barista Express combines an espresso machine with a built-in grinder, delivering café-quality drinks at home. The precise extraction and steam wand make it perfect for lattes and cappuccinos.</p>

<h2>Buying Guide: What to Consider</h2>

<h3>Brewing Method</h3>
<p>Different brewing methods produce distinct flavor profiles:</p>
<ul>
<li><strong>Drip Coffee:</strong> Clean, bright flavors with good clarity</li>
<li><strong>French Press:</strong> Full-bodied, rich coffee with natural oils</li>
<li><strong>Espresso:</strong> Concentrated, intense flavor perfect for milk drinks</li>
<li><strong>Pour Over:</strong> Clean, nuanced flavors with complete control</li>
</ul>

<h3>Size and Capacity</h3>
<p>Consider your household's coffee consumption. Single-serve machines work well for 1-2 people, while larger families benefit from 8-12 cup machines.</p>

<h3>Features to Look For</h3>
<ul>
<li>Programmable timer for wake-up coffee</li>
<li>Temperature control for optimal extraction</li>
<li>Auto shut-off for safety and energy savings</li>
<li>Permanent filter to reduce ongoing costs</li>
<li>Easy cleaning and maintenance</li>
</ul>

<h2>Maintenance Tips</h2>
<p>Regular maintenance ensures your coffee maker continues to perform optimally:</p>
<ul>
<li>Clean after every use with warm, soapy water</li>
<li>Descale monthly in hard water areas, quarterly in soft water areas</li>
<li>Replace water filters as recommended</li>
<li>Use filtered water for better taste and machine longevity</li>
</ul>

<h2>Conclusion</h2>
<p>The perfect coffee maker depends on your preferences, budget, and lifestyle. Whether you choose a simple drip machine or a sophisticated espresso maker, investing in quality equipment will reward you with better coffee for years to come.</p>

<p>Remember, the best coffee maker is the one you'll use consistently. Consider your daily routine, space constraints, and coffee preferences when making your decision.</p>`,
        
        heroImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1024&h=1024&fit=crop&q=80',
        status: 'PUBLISHED'
      }
    })

    // Add featured products for the coffee post
    await prisma.featuredProduct.createMany({
      data: [
        {
          productName: 'Technivorm Moccamaster 59616 KBG',
          productImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=80',
          productLink: 'https://amazon.com/dp/B077JBQZPX',
          price: '$359',
          rating: 5,
          description: 'Premium drip coffee maker with precise temperature control and thermal carafe.',
          postId: coffeePost.id
        },
        {
          productName: 'Breville BES870XL Barista Express',
          productImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&q=80',
          productLink: 'https://amazon.com/dp/B00CH9QWOU',
          price: '$699',
          rating: 5,
          description: 'All-in-one espresso machine with built-in grinder for café-quality drinks.',
          postId: coffeePost.id
        },
        {
          productName: 'Hamilton Beach 46310 12-Cup',
          productImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&q=80',
          productLink: 'https://amazon.com/dp/B07B3VQHPZ',
          price: '$39',
          rating: 4,
          description: 'Budget-friendly programmable coffee maker with great value for money.',
          postId: coffeePost.id
        }
      ]
    })

    console.log('✅ SEO-optimized coffee post created')
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
