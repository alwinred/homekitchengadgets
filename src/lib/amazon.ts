import { generateProductImageUrl } from '@/lib/unsplash'

export interface AmazonProduct {
  title: string
  image: string
  link: string
  price?: string
  description?: string
}

// Function to generate realistic product images from Unsplash
function generateProductImage(productName: string): string {
  // Extract key product type for better image search
  const searchTerms = new Map([
    // Air Fryers
    ['ninja af161', 'air-fryer'],
    ['cosori air fryer', 'air-fryer'],
    ['philips airfryer', 'air-fryer'],
    ['instant pot air fryer', 'air-fryer'],
    ['air fryer', 'air-fryer'],
    
    // Coffee
    ['espresso machine', 'espresso-machine'],
    ['coffee maker', 'coffee-maker'],
    ['french press', 'french-press'],
    ['pour over', 'coffee-pour-over'],
    
    // Kitchen
    ['stand mixer', 'stand-mixer'],
    ['food processor', 'food-processor'],
    ['instant pot', 'pressure-cooker'],
    ['blender', 'blender'],
    ['toaster', 'toaster'],
    
    // General fallback
    ['kitchen', 'kitchen-appliance']
  ])
  
  const searchKey = productName.toLowerCase()
  let imageQuery = 'kitchen-appliance' // default
  
  for (const [key, value] of searchTerms) {
    if (searchKey.includes(key)) {
      imageQuery = value
      break
    }
  }
  
  return `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
}

// Mock Amazon products for development with realistic product data
const MOCK_PRODUCTS: Record<string, AmazonProduct[]> = {
  'air fryer': [
    {
      title: 'Ninja AF161 Max XL Air Fryer',
      image: generateProductImageUrl('Ninja AF161 Max XL Air Fryer'),
      link: 'https://amazon.com/dp/B07VT23JDM',
      price: '$129.99',
      description: 'Extra-large 5.5-quart capacity air fryer with even crisping technology'
    },
    {
      title: 'COSORI Pro LE 5-Qt Air Fryer',
      image: generateProductImageUrl('COSORI Pro LE 5-Qt Air Fryer'),
      link: 'https://amazon.com/dp/B077TKLR2W',
      price: '$99.99',
      description: 'Compact design with 13 cooking functions and app control'
    },
    {
      title: 'Philips 3000 Series Compact Air Fryer',
      image: generateProductImageUrl('Philips 3000 Series Compact Air Fryer'),
      link: 'https://amazon.com/dp/B077JBQZPX',
      price: '$179.99',
      description: 'Original air fryer technology with rapid air circulation'
    },
    {
      title: 'Instant Pot Duo Crisp Air Fryer',
      image: generateProductImageUrl('Instant Pot Duo Crisp Air Fryer'),
      link: 'https://amazon.com/dp/B07VT23JDM',
      price: '$199.99',
      description: '11-in-1 pressure cooker and air fryer combination'
    },
    {
      title: 'Breville Smart Oven Air Fryer Pro',
      image: generateProductImageUrl('Breville Smart Oven Air Fryer Pro'),
      link: 'https://amazon.com/dp/B01N5UPTZS',
      price: '$349.99',
      description: 'Countertop oven with air fry, bake, and toast functions'
    }
  ],
  'kitchen': [
    {
      title: 'KitchenAid Stand Mixer',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      link: 'https://amazon.com/dp/B00005UP2P',
      price: '$299.99',
      description: 'Professional 5-quart stand mixer with multiple attachments'
    },
    {
      title: 'Ninja Food Processor',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      link: 'https://amazon.com/dp/B01AXM4WV2',
      price: '$99.99',
      description: 'Versatile food processor for chopping, mixing, and pureeing'
    },
    {
      title: 'Instant Pot Pressure Cooker',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      link: 'https://amazon.com/dp/B00FLYWNYQ',
      price: '$79.99',
      description: '7-in-1 electric pressure cooker for quick and easy meals'
    }
  ],
  'coffee': [
    {
      title: 'Breville Espresso Machine',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      link: 'https://amazon.com/dp/B00I6JGGP0',
      price: '$699.99',
      description: 'Professional espresso machine with built-in grinder'
    },
    {
      title: 'Chemex Pour-Over Coffee Maker',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      link: 'https://amazon.com/dp/B0000YWF5E',
      price: '$44.99',
      description: 'Classic glass pour-over coffee maker'
    },
    {
      title: 'Baratza Coffee Grinder',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      link: 'https://amazon.com/dp/B007F183LK',
      price: '$139.99',
      description: 'Precision burr grinder for consistent coffee grounds'
    }
  ],
  'fitness': [
    {
      title: 'Peloton Exercise Bike',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      link: 'https://amazon.com/dp/B07JBQZPX7',
      price: '$1,495.00',
      description: 'Interactive fitness bike with live and on-demand classes'
    },
    {
      title: 'Bowflex Adjustable Dumbbells',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      link: 'https://amazon.com/dp/B001ARYU58',
      price: '$549.99',
      description: 'Space-saving adjustable dumbbells, 5-52.5 lbs per dumbbell'
    },
    {
      title: 'Yoga Mat Premium',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      link: 'https://amazon.com/dp/B01LZRFC11',
      price: '$69.99',
      description: 'Non-slip yoga mat with excellent cushioning and durability'
    }
  ]
}

function getKeywordsFromTopic(topic: string): string {
  // Extract relevant keywords from the topic
  const topicLower = topic.toLowerCase()
  
  // Specific product category matching
  if (topicLower.includes('air fryer') || topicLower.includes('airfryer')) return 'air fryer'
  if (topicLower.includes('coffee') || topicLower.includes('espresso')) return 'coffee'
  if (topicLower.includes('fitness') || topicLower.includes('workout') || topicLower.includes('exercise')) return 'fitness'
  
  // General category matching
  const words = topicLower.split(' ')
  const keywords = ['kitchen', 'cooking', 'tech', 'technology', 'home']
  
  for (const keyword of keywords) {
    if (words.some(word => word.includes(keyword) || keyword.includes(word))) {
      return keyword
    }
  }
  
  // Default to kitchen if no match found
  return 'kitchen'
}

export async function searchAmazonProducts(topic: string): Promise<AmazonProduct[]> {
  // In development, use mock data
  if (process.env.NODE_ENV === 'development' || !process.env.AMAZON_ACCESS_KEY) {
    const keyword = getKeywordsFromTopic(topic)
    return MOCK_PRODUCTS[keyword] || MOCK_PRODUCTS['kitchen']
  }

  // TODO: Implement real Amazon Product Advertising API integration
  // This would require proper API credentials and the amazon-paapi library
  try {
    // const CommonParameters = {
    //   AccessKey: process.env.AMAZON_ACCESS_KEY!,
    //   SecretKey: process.env.AMAZON_SECRET_KEY!,
    //   PartnerTag: process.env.AMAZON_ASSOCIATE_TAG!,
    //   PartnerType: 'Associates',
    //   Marketplace: 'www.amazon.com'
    // }
    
    // const searchRequest = {
    //   Keywords: topic,
    //   SearchIndex: 'All',
    //   ItemCount: 5,
    //   Resources: [
    //     'Images.Primary.Large',
    //     'ItemInfo.Title',
    //     'Offers.Listings.Price'
    //   ]
    // }
    
    // const client = new ProductAdvertisingAPIv1()
    // const response = await client.searchItems(CommonParameters, searchRequest)
    
    // return response.SearchResult.Items.map(item => ({
    //   title: item.ItemInfo.Title.DisplayValue,
    //   image: item.Images.Primary.Large.URL,
    //   link: item.DetailPageURL,
    //   price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount
    // }))
    
    // For now, return mock data
    const keyword = getKeywordsFromTopic(topic)
    return MOCK_PRODUCTS[keyword] || MOCK_PRODUCTS['kitchen']
  } catch (error) {
    console.error('Error fetching Amazon products:', error)
    // Fallback to mock data
    const keyword = getKeywordsFromTopic(topic)
    return MOCK_PRODUCTS[keyword] || MOCK_PRODUCTS['kitchen']
  }
}
