"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { X, Upload, Link as LinkIcon, Percent, Tag, Calculator } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'

interface ProductFormProps {
  initialData?: any
  categories: any[]
}

const parseSafeJson = (data: any, fallback: any) => {
  if (!data) return fallback
  if (Array.isArray(data)) return data
  if (typeof data === 'object') return data
  try {
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) || typeof parsed === 'object' ? parsed : fallback
  } catch {
    return typeof data === 'string' && data.startsWith('http') ? [data] : fallback
  }
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price !== undefined ? String(initialData.price) : '',
    comparePrice: initialData?.comparePrice !== undefined && initialData?.comparePrice !== null ? String(initialData.comparePrice) : '',
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    stock: initialData?.stock !== undefined ? String(initialData.stock) : '10',
    isVisible: initialData?.isVisible ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  })

  // Safe parsing for images, sizes, colors
  const parsedImages = parseSafeJson(initialData?.images, [])
  const parsedSizes = parseSafeJson(initialData?.sizes, ['S', 'M', 'L', 'XL'])
  const parsedColors = parseSafeJson(initialData?.colors, [{ name: 'Default', hex: '#000000' }])

  const [images, setImages] = useState<string[]>(Array.isArray(parsedImages) ? parsedImages : [])
  const [imageUrl, setImageUrl] = useState('')
  const [sizes, setSizes] = useState<string[]>(Array.isArray(parsedSizes) ? parsedSizes : ['S', 'M', 'L'])
  const [newSize, setNewSize] = useState('')
  const [colors, setColors] = useState<{name: string, hex: string}[]>(Array.isArray(parsedColors) ? parsedColors : [{ name: 'Default', hex: '#000000' }])
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#000000')

  // Interactive single-product discount helper state
  const [quickDiscountType, setQuickDiscountType] = useState<'percent' | 'flat'>('percent')
  const [quickDiscountVal, setQuickDiscountVal] = useState('')

  const handleApplyQuickDiscount = () => {
    const val = parseFloat(quickDiscountVal)
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid discount value')
      return
    }

    // Base price is comparePrice if set, otherwise current price
    const base = parseFloat(formData.comparePrice) || parseFloat(formData.price) || 0
    if (base <= 0) {
      toast.error('Please enter a base price first')
      return
    }

    let discountedPrice = base
    if (quickDiscountType === 'percent') {
      if (val >= 100) {
        toast.error('Discount percentage must be less than 100%')
        return
      }
      discountedPrice = Math.round(base * (1 - val / 100))
    } else {
      discountedPrice = Math.max(100, Math.round(base - val))
    }

    setFormData({
      ...formData,
      comparePrice: String(base),
      price: String(discountedPrice)
    })

    toast.success(`Discount calculated! Sale Price: Rs. ${discountedPrice}, Original Price: Rs. ${base}`)
  }

  const handleClearDiscount = () => {
    const original = formData.comparePrice || formData.price
    setFormData({
      ...formData,
      price: String(original),
      comparePrice: ''
    })
    setQuickDiscountVal('')
    toast.success('Discount cleared. Restored regular price.')
  }

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return
    setImages([...images, imageUrl.trim()])
    setImageUrl('')
    toast.success('Image URL added')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setImages([...images, data.url])
      toast.success('Image uploaded')
    } catch (error: any) {
      toast.error(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) {
      toast.error('Please add at least one product image')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price as string) || 0,
        comparePrice: formData.comparePrice ? parseInt(formData.comparePrice as string) : null,
        stock: parseInt(formData.stock as string) || 0,
        images,
        sizes,
        colors
      }

      const url = initialData ? `/api/products/${initialData.id}` : '/api/products'
      const method = initialData ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      toast.success(`Product ${initialData ? 'updated' : 'created'} successfully`)
      router.push('/admin/products')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => {
                const name = e.target.value
                setFormData({ ...formData, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') })
              }} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              rows={5}
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              required 
            />
          </div>

          {/* Pricing & Interactive Discount Calculator */}
          <div className="bg-ivory/60 border border-border p-4 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-accent" />
                <h4 className="text-xs uppercase font-bold tracking-wider text-primary">Pricing & Item Discount</h4>
              </div>
              {formData.comparePrice && (
                <button
                  type="button"
                  onClick={handleClearDiscount}
                  className="text-xs text-error hover:underline"
                >
                  Clear Discount
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs">
                  Selling Price (PKR) <span className="text-accent font-bold">*</span>
                </Label>
                <Input 
                  type="number" 
                  id="price" 
                  value={formData.price} 
                  onChange={e => setFormData({ ...formData, price: e.target.value })} 
                  placeholder="e.g. 3500"
                  required 
                />
                <span className="text-[11px] text-muted block">The actual price the customer pays.</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="comparePrice" className="text-xs">
                  Original / Compare at Price (Optional)
                </Label>
                <Input 
                  type="number" 
                  id="comparePrice" 
                  value={formData.comparePrice} 
                  onChange={e => setFormData({ ...formData, comparePrice: e.target.value })} 
                  placeholder="e.g. 5000"
                />
                <span className="text-[11px] text-muted block">Crossed-out original price to show savings.</span>
              </div>
            </div>

            {/* Quick Single-Item Discount Calculator Tool */}
            <div className="bg-white p-3 rounded-sm border border-border/80 space-y-2">
              <span className="text-[11px] font-semibold text-primary block">
                Quick Calculate Discount for this item:
              </span>
              <div className="flex gap-2 items-center">
                <select
                  value={quickDiscountType}
                  onChange={e => setQuickDiscountType(e.target.value as any)}
                  className="h-9 text-xs border border-border rounded-sm px-2 bg-ivory"
                >
                  <option value="percent">% Discount</option>
                  <option value="flat">Flat Rs. OFF</option>
                </select>

                <Input
                  type="number"
                  placeholder={quickDiscountType === 'percent' ? 'e.g. 25 for 25% OFF' : 'e.g. 500'}
                  value={quickDiscountVal}
                  onChange={e => setQuickDiscountVal(e.target.value)}
                  className="h-9 text-xs flex-1"
                />

                <Button
                  type="button"
                  size="sm"
                  onClick={handleApplyQuickDiscount}
                  className="bg-primary hover:bg-accent text-white text-xs h-9"
                >
                  Apply to Item
                </Button>
              </div>

              {formData.comparePrice && parseFloat(formData.comparePrice) > parseFloat(formData.price) && (
                <p className="text-[11px] text-success font-medium pt-1">
                  ✓ Active Discount: Customer saves {formatPrice(parseFloat(formData.comparePrice) - parseFloat(formData.price))} ({Math.round(((parseFloat(formData.comparePrice) - parseFloat(formData.price)) / parseFloat(formData.comparePrice)) * 100)}% OFF badge on store).
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-primary">Product Images</h3>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square border border-border rounded-sm overflow-hidden group bg-ivory">
                  <Image src={img} alt="" fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 bg-error text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-ivory transition-colors">
                <Upload className="w-6 h-6 text-muted mb-2" />
                <span className="text-xs text-muted">{uploading ? 'Uploading...' : 'Upload File'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>

            <div className="flex gap-2 items-center">
              <Input 
                placeholder="Or paste image URL (e.g. Unsplash image link)" 
                value={imageUrl} 
                onChange={e => setImageUrl(e.target.value)} 
                className="h-10 text-xs"
              />
              <Button type="button" size="sm" onClick={handleAddImageUrl} variant="outline">
                <LinkIcon className="w-3.5 h-3.5 mr-1" /> Add URL
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status">Visibility Status</Label>
            <select 
              id="status"
              className="flex h-11 w-full rounded-sm border border-border bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={formData.isVisible ? "true" : "false"}
              onChange={e => setFormData({ ...formData, isVisible: e.target.value === "true" })}
            >
              <option value="true">Visible in Store</option>
              <option value="false">Hidden from Store</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isFeatured">Featured Product</Label>
            <select 
              id="isFeatured"
              className="flex h-11 w-full rounded-sm border border-border bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={formData.isFeatured ? "true" : "false"}
              onChange={e => setFormData({ ...formData, isFeatured: e.target.value === "true" })}
            >
              <option value="false">Normal Product</option>
              <option value="true">Show in Featured Section</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select 
              id="category"
              className="flex h-11 w-full rounded-sm border border-border bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="" disabled>Select category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Inventory Stock</Label>
            <Input type="number" id="stock" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-primary">Sizes Options</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {sizes.map(size => (
                <span key={size} className="bg-ivory border border-border px-2 py-1 text-xs rounded-sm flex items-center">
                  {size}
                  <button type="button" onClick={() => setSizes(sizes.filter(s => s !== size))} className="ml-2 text-error"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="e.g. XL or Unstitched" className="h-9 text-xs" />
              <Button type="button" size="sm" onClick={() => { if(newSize && !sizes.includes(newSize)) { setSizes([...sizes, newSize]); setNewSize('') } }}>Add</Button>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-primary">Colors & Swatches</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {colors.map(color => (
                <span key={color.name} className="bg-ivory border border-border px-2 py-1 text-xs rounded-sm flex items-center font-medium">
                  <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color.hex || '#000' }} />
                  {color.name}
                  <button type="button" onClick={() => setColors(colors.filter(c => c.name !== color.name))} className="ml-2 text-error"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="w-10 p-1 h-9 cursor-pointer" />
              <Input value={newColorName} onChange={e => setNewColorName(e.target.value)} placeholder="Color Name" className="h-9 flex-1 text-xs" />
              <Button type="button" size="sm" onClick={() => { if(newColorName) { setColors([...colors, { name: newColorName, hex: newColorHex }]); setNewColorName('') } }}>Add</Button>
            </div>
          </div>
          
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-accent text-white">{loading ? 'Saving...' : 'Save Product'}</Button>
      </div>
    </form>
  )
}
