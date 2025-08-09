'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star, ExternalLink } from 'lucide-react'
import { generateProductImageUrl } from '@/lib/unsplash'

interface Product {
  name: string
  price: string
  rating: number
  amazonLink: string
  description: string
  image?: string // Added optional image field
}

interface FeaturedProduct {
  id?: string
  productName: string
  productImage: string
  productLink: string
  price?: string
  rating: number
  description: string
}

interface ProductShowcaseProps {
  content: string
  featuredProducts?: FeaturedProduct[]
}



export function ProductShowcase({ content, featuredProducts = [] }: ProductShowcaseProps) {
  // Only show manually added featured products (no auto-detection)
  const displayProducts: Product[] = featuredProducts.map(fp => ({
    name: fp.productName,
    price: fp.price || 'Price varies',
    rating: fp.rating,
    amazonLink: fp.productLink,
    description: fp.description,
    image: fp.productImage // Use the provided image URL
  }))
  
  if (displayProducts.length === 0) {
    return null
  }
  
  return (
    <div className="my-12 p-6 bg-muted/30 rounded-xl border">
      <h3 className="text-2xl font-bold mb-6 text-center text-primary">
        🛍️ Featured Products in This Article
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <img
                src={product.image || generateProductImageUrl(product.name)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-bold text-lg mb-2 line-clamp-2">
                {product.name}
              </h4>
              
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < product.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating}/5
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between gap-4">
                <span className="text-base font-bold text-primary">
                  {product.price}
                </span>
                <a 
                  href={product.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                >
                  View on Amazon
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        💡 These are affiliate links. We may earn a commission at no extra cost to you.
      </p>
    </div>
  )
}
