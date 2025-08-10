'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { JoditWysiwygEditor } from './jodit-editor'
import { Trash2, Plus, Edit2, Save, X, Star } from 'lucide-react'

// Markdown to HTML conversion function for admin display
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^(\\d+)\\. (.*$)/gm, '<li>$2</li>')
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.includes('<h') || paragraph.includes('<li>')) {
        return paragraph;
      }
      if (paragraph.includes('<li>')) {
        return '<ul>' + paragraph + '</ul>';
      }
      return paragraph ? `<p>${paragraph}</p>` : '';
    })
    .join('')
    .replace(/<li>/g, '<ul><li>')
    .replace(/<\/li>(?!\s*<li>)/g, '</li></ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>)/g, '$1')
    .replace(/(<\/h[1-6]>)<\/p>/g, '$1');
}

export interface ManagedProduct {
  id?: string
  productTitle: string
  productImage: string
  productLink: string
  rating: number
  reviewContent: string
  status: 'REVIEW' | 'PUBLISHED'
}

interface ProductManagerProps {
  postId: string
  products: ManagedProduct[]
  onProductsChange: (products: ManagedProduct[]) => void
  readonly?: boolean
}

export function ProductManager({ postId, products, onProductsChange, readonly = false }: ProductManagerProps) {
  const [editingProduct, setEditingProduct] = useState<ManagedProduct | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const defaultProduct: ManagedProduct = {
    productTitle: '',
    productImage: '',
    productLink: '',
    rating: 5,
    reviewContent: '',
    status: 'PUBLISHED'
  }

  const handleEdit = (product: ManagedProduct) => {
    // Convert markdown to HTML when editing
    const htmlContent = markdownToHtml(product.reviewContent)
    setEditingProduct({ ...product, reviewContent: htmlContent })
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
        // Add new product
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editingProduct, postId }),
        })

        if (!response.ok) throw new Error('Failed to add product')
        
        const newProduct = await response.json()
        onProductsChange([...products, newProduct])
      } else {
        // Update existing product
        const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        })

        if (!response.ok) throw new Error('Failed to update product')
        
        const updatedProduct = await response.json()
        onProductsChange(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
      }

      setEditingProduct(null)
      setIsAddingNew(false)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    }
  }

  const handleDelete = async (product: ManagedProduct) => {
    if (!product.id) return
    
    if (!confirm(`Are you sure you want to delete "${product.productTitle}"?`)) return

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete product')
      
      onProductsChange(products.filter(p => p.id !== product.id))
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setIsAddingNew(false)
  }

  const updateEditingProduct = (field: keyof ManagedProduct, value: string | number) => {
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
            <CardTitle>📝 Related Reviews</CardTitle>
            <CardDescription>
              Manage detailed product reviews that appear in the &quot;Related Reviews&quot; section
            </CardDescription>
          </div>
          {!readonly && (
            <Button onClick={handleAddNew} disabled={!!editingProduct} className="gap-2 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              Add Product
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
                {isAddingNew ? 'Add New Product' : 'Edit Product'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Title *
                  </label>
                  <Input
                    value={editingProduct.productTitle}
                    onChange={(e) => updateEditingProduct('productTitle', e.target.value)}
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
                  Rating (1-5 stars)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={editingProduct.rating}
                    onChange={(e) => updateEditingProduct('rating', parseFloat(e.target.value))}
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
                  Review Content *
                </label>
                <JoditWysiwygEditor
                  value={editingProduct.reviewContent}
                  onChange={(value) => updateEditingProduct('reviewContent', value)}
                  placeholder="Write a detailed review with pros, cons, and verdict..."
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
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No products added yet.</p>
            {!readonly && (
              <p className="text-sm mt-2">
                Add products manually or they will be auto-detected from your article content.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <Card key={product.id || index} className="overflow-hidden">
                <div className="flex">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <img
                      src={product.productImage}
                      alt={product.productTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-1">{product.productTitle}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(product.rating)}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {product.rating}/5
                          </span>
                        </div>
                        <div 
                          className="text-sm text-muted-foreground mt-2 line-clamp-2"
                          dangerouslySetInnerHTML={{ 
                            __html: markdownToHtml(product.reviewContent) 
                          }}
                        />
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

