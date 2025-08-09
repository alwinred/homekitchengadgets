// Utility to get product images from Unsplash
// This provides realistic product photos instead of placeholders

interface UnsplashImage {
  url: string
  alt: string
}

// Curated product images for common categories
const PRODUCT_IMAGES: Record<string, UnsplashImage[]> = {
  'air-fryer': [
    {
      url: 'https://images.unsplash.com/photo-1585515656935-1b1b2e8956db?w=400&q=80',
      alt: 'Modern air fryer on kitchen counter'
    },
    {
      url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80',
      alt: 'Black air fryer with digital display'
    },
    {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
      alt: 'Kitchen appliance air fryer'
    }
  ],
  'kitchen-appliance': [
    {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
      alt: 'Modern kitchen appliance'
    },
    {
      url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80',
      alt: 'Stainless steel kitchen equipment'
    },
    {
      url: 'https://images.unsplash.com/photo-1585515656935-1b1b2e8956db?w=400&q=80',
      alt: 'Compact kitchen appliance'
    }
  ],
  'coffee-maker': [
    {
      url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80',
      alt: 'Professional coffee machine'
    },
    {
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
      alt: 'Espresso machine brewing coffee'
    },
    {
      url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80',
      alt: 'Modern coffee maker with glass carafe'
    },
    {
      url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
      alt: 'Single serve coffee maker'
    }
  ],
  'espresso-machine': [
    {
      url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80',
      alt: 'Professional espresso machine'
    },
    {
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
      alt: 'Espresso machine brewing coffee'
    }
  ],
  'stand-mixer': [
    {
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
      alt: 'Stand mixer in modern kitchen'
    }
  ]
}

export function getProductImage(productName: string, category?: string): UnsplashImage {
  // Determine the best image category based on product name
  const productLower = productName.toLowerCase()
  
  let imageCategory = 'kitchen-appliance' // default
  
  if (productLower.includes('air fryer') || productLower.includes('ninja af') || productLower.includes('cosori')) {
    imageCategory = 'air-fryer'
  } else if (productLower.includes('espresso') || productLower.includes('barista')) {
    imageCategory = 'espresso-machine'
  } else if (productLower.includes('coffee') || productLower.includes('keurig') || productLower.includes('ninja ce') || productLower.includes('technivorm') || productLower.includes('cuisinart')) {
    imageCategory = 'coffee-maker'
  } else if (productLower.includes('mixer') || productLower.includes('kitchenaid')) {
    imageCategory = 'stand-mixer'
  } else if (category) {
    imageCategory = category
  }
  
  const images = PRODUCT_IMAGES[imageCategory] || PRODUCT_IMAGES['kitchen-appliance']
  
  // Return a deterministic image based on product name hash
  const hash = productName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const index = Math.abs(hash) % images.length
  return images[index]
}

export function generateProductImageUrl(productName: string): string {
  const image = getProductImage(productName)
  return image.url
}

// Hero images for blog posts - high quality, professional images
const HERO_IMAGES: Record<string, UnsplashImage[]> = {
  'coffee': [
    {
      url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1024&h=1024&fit=crop&q=80',
      alt: 'Coffee beans and brewing equipment'
    },
    {
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1024&h=1024&fit=crop&q=80',
      alt: 'Fresh coffee being brewed'
    },
    {
      url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1024&h=1024&fit=crop&q=80',
      alt: 'Professional coffee machine'
    }
  ],
  'kitchen': [
    {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1024&h=1024&fit=crop&q=80',
      alt: 'Modern kitchen appliances'
    },
    {
      url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1024&h=1024&fit=crop&q=80',
      alt: 'Kitchen appliances setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1585515656935-1b1b2e8956db?w=1024&h=1024&fit=crop&q=80',
      alt: 'Sleek kitchen equipment'
    }
  ],
  'cooking': [
    {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1024&h=1024&fit=crop&q=80',
      alt: 'Cooking equipment and utensils'
    },
    {
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1024&h=1024&fit=crop&q=80',
      alt: 'Professional cooking setup'
    }
  ],
  'technology': [
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1024&h=1024&fit=crop&q=80',
      alt: 'Modern technology and gadgets'
    },
    {
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1024&h=1024&fit=crop&q=80',
      alt: 'Tech workspace and devices'
    }
  ],
  'fitness': [
    {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1024&h=1024&fit=crop&q=80',
      alt: 'Fitness equipment and workout gear'
    },
    {
      url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1024&h=1024&fit=crop&q=80',
      alt: 'Modern gym equipment'
    }
  ],
  'home': [
    {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1024&h=1024&fit=crop&q=80',
      alt: 'Modern home interior'
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1024&h=1024&fit=crop&q=80',
      alt: 'Stylish home decor'
    }
  ],
  'default': [
    {
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1024&h=1024&fit=crop&q=80',
      alt: 'Professional workspace'
    },
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1024&h=1024&fit=crop&q=80',
      alt: 'Modern technology setup'
    }
  ]
}

export function getHeroImage(topic: string): UnsplashImage {
  // Determine the best image category based on topic
  const topicLower = topic.toLowerCase()
  
  let imageCategory = 'default'
  
  if (topicLower.includes('coffee') || topicLower.includes('espresso') || topicLower.includes('brew')) {
    imageCategory = 'coffee'
  } else if (topicLower.includes('kitchen') || topicLower.includes('appliance') || topicLower.includes('culinary')) {
    imageCategory = 'kitchen'
  } else if (topicLower.includes('cook') || topicLower.includes('recipe') || topicLower.includes('food')) {
    imageCategory = 'cooking'
  } else if (topicLower.includes('tech') || topicLower.includes('smart') || topicLower.includes('device') || topicLower.includes('gadget')) {
    imageCategory = 'technology'
  } else if (topicLower.includes('fitness') || topicLower.includes('workout') || topicLower.includes('exercise') || topicLower.includes('gym')) {
    imageCategory = 'fitness'
  } else if (topicLower.includes('home') || topicLower.includes('house') || topicLower.includes('decor') || topicLower.includes('furniture')) {
    imageCategory = 'home'
  }
  
  const images = HERO_IMAGES[imageCategory] || HERO_IMAGES['default']
  
  // Return a deterministic image based on topic hash
  const hash = topic.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const index = Math.abs(hash) % images.length
  return images[index]
}

export function generateHeroImageUrl(topic: string): string {
  const image = getHeroImage(topic)
  return image.url
}
