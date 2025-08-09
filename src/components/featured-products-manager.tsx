'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Trash2, Plus, Edit2, Save, X, Star, ExternalLink } from 'lucide-react'

export interface FeaturedProduct {
  id?: string
  productName: string
  productImage: string
  productLink: string
  price?: string
  rating: number
  description: string
}

interface FeaturedProductsManagerProps {
  postId: string
  featuredProducts: FeaturedProduct[]
  onFeaturedProductsChange: (products: FeaturedProduct[]) => void
  readonly?: boolean
}

export function FeaturedProductsManager({ 
  postId, 
  featuredProducts, 
  onFeaturedProductsChange, 
  readonly = false 
}: FeaturedProductsManagerProps) {
  const [editingProduct, setEditingProduct] = useState<FeaturedProduct | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const defaultProduct: FeaturedProduct = {
    productName: '',
    productImage: '',
    productLink: '',
    price: '',
    rating: 5,
    description: ''
  }

  const handleEdit = (product: FeaturedProduct) => {
    setEditingProduct({ ...product })
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setEditingProduct({ ...defaultProduct })
    setIsAddingNew(true)
  }

  const handleSave = async () => {
    if (!editingProduct) return

    try {
      if (isAddingNew) {
        // Add new featured product
        const response = await fetch('/api/admin/featured-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editingProduct, postId }),
        })

        if (!response.ok) throw new Error('Failed to add featured product')
        
        const newProduct = await response.json()
        onFeaturedProductsChange([...featuredProducts, newProduct])
      } else {
        // Update existing featured product
        const response = await fetch(`/api/admin/featured-products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        })

        if (!response.ok) throw new Error('Failed to update featured product')
        
        const updatedProduct = await response.json()
        onFeaturedProductsChange(featuredProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p))
      }

      setEditingProduct(null)
      setIsAddingNew(false)
    } catch (error) {
      console.error('Error saving featured product:', error)
      alert('Failed to save featured product')
    }
  }

  const handleDelete = async (product: FeaturedProduct) => {
    if (!product.id) return
    
    if (!confirm(`Are you sure you want to delete "${product.productName}"?`)) return

    try {
      const response = await fetch(`/api/admin/featured-products/${product.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete featured product')
      
      onFeaturedProductsChange(featuredProducts.filter(p => p.id !== product.id))
    } catch (error) {
      console.error('Error deleting featured product:', error)
      alert('Failed to delete featured product')
    }
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setIsAddingNew(false)
  }

  const updateEditingProduct = (field: keyof FeaturedProduct, value: string | number) => {
    if (!editingProduct) return
    setEditingProduct({ ...editingProduct, [field]: value })
  }



  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>🛍️ Featured Products in This Article</CardTitle>
            <CardDescription>
              Manually add products that will appear in the &quot;Featured Products in This Article&quot; section. You have full control over which products are displayed.
            </CardDescription>
          </div>
          {!readonly && (
            <Button onClick={handleAddNew} disabled={!!editingProduct} className="gap-2 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              Add Featured Product
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Editing Form */}
        {editingProduct && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">
                {isAddingNew ? 'Add New Featured Product' : 'Edit Featured Product'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name *
                  </label>
                  <Input
                    value={editingProduct.productName}
                    onChange={(e) => updateEditingProduct('productName', e.target.value)}
                    placeholder="e.g., Ninja AF161 Max XL Air Fryer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amazon Link *
                  </label>
                  <Input
                    value={editingProduct.productLink}
                    onChange={(e) => updateEditingProduct('productLink', e.target.value)}
                    placeholder="https://amazon.com/dp/..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Image URL *
                  </label>
                  <Input
                    value={editingProduct.productImage}
                    onChange={(e) => updateEditingProduct('productImage', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <Input
                    value={editingProduct.price || ''}
                    onChange={(e) => updateEditingProduct('price', e.target.value)}
                    placeholder="$99.99"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Rating (1-5 stars)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={editingProduct.rating}
                    onChange={(e) => updateEditingProduct('rating', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1">
                    {renderStars(editingProduct.rating)}
                    <span className="ml-2 text-sm">{editingProduct.rating}/5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Description *
                </label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => updateEditingProduct('description', e.target.value)}
                  placeholder="Brief description of the product features and benefits..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Product
                </Button>
                <Button variant="outline" onClick={handleCancel} className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        {featuredProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No featured products added yet.</p>
            {!readonly && (
              <p className="text-sm mt-2">
                Add products that will appear in the &quot;Featured Products in This Article&quot; section.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {featuredProducts.map((product, index) => (
              <Card key={product.id || index} className="overflow-hidden">
                <div className="flex">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-1">{product.productName}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(product.rating)}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {product.rating}/5
                          </span>
                          {product.price && (
                            <span className="ml-4 text-sm font-medium text-primary">
                              {product.price}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {product.description}
                        </p>
                        <a
                          href={product.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View on Amazon
                        </a>
                      </div>
                      {!readonly && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            disabled={!!editingProduct}
                            className="gap-1"
                          >
                            <Edit2 className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product)}
                            disabled={!!editingProduct}
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
