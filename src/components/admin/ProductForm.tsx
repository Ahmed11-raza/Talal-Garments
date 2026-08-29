"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { X, Upload, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ProductFormProps {
  initialData?: any
  categories: any[]
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    comparePrice: initialData?.comparePrice || '',
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    stock: initialData?.stock || 0,
    isVisible: initialData?.isVisible ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  })

  // Parse JSON strings from SQLite if present
  const parsedImages = initialData?.images ? (typeof initialData.images === 'string' ? JSON.parse(initialData.images) : initialData.images) : []
  const parsedSizes = initialData?.sizes ? (typeof initialData.sizes === 'string' ? JSON.parse(initialData.sizes) : initialData.sizes) : ['S', 'M', 'L']
  const parsedColors = initialData?.colors ? (typeof initialData.colors === 'string' ? JSON.parse(initialData.colors) : initialData.colors) : [{ name: 'Default', hex: '#000000' }]

  const [images, setImages] = useState<string[]>(parsedImages)
  const [sizes, setSizes] = useState<string[]>(parsedSizes)
  const [newSize, setNewSize] = useState('')
  const [colors, setColors] = useState<{name: string, hex: string}[]>(parsedColors)
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#000000')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
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
    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price as string),
        comparePrice: formData.comparePrice ? parseInt(formData.comparePrice as string) : null,
        stock: parseInt(formData.stock as string),
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
      
      toast.success(`Product ${initialData ? 'updated' : 'created'}`)
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (PKR)</Label>
              <Input type="number" id="price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comparePrice">Compare at Price (optional)</Label>
              <Input type="number" id="comparePrice" value={formData.comparePrice} onChange={e => setFormData({ ...formData, comparePrice: e.target.value })} />
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-charcoal/10">
            <h3 className="font-medium">Images</h3>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square border border-charcoal/10 rounded-sm overflow-hidden group">
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
              <label className="aspect-square border-2 border-dashed border-charcoal/20 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-mist/50 transition-colors">
                <Upload className="w-6 h-6 text-charcoal/50 mb-2" />
                <span className="text-xs text-charcoal/50">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select 
              id="status"
              className="flex h-11 w-full rounded-sm border border-charcoal/20 bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-forest"
              value={formData.isVisible ? "true" : "false"}
              onChange={e => setFormData({ ...formData, isVisible: e.target.value === "true" })}
            >
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select 
              id="category"
              className="flex h-11 w-full rounded-sm border border-charcoal/20 bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-forest"
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

          <div className="space-y-4 pt-4 border-t border-charcoal/10">
            <h3 className="font-medium">Sizes</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {sizes.map(size => (
                <span key={size} className="bg-mist px-2 py-1 text-xs rounded-sm flex items-center">
                  {size}
                  <button type="button" onClick={() => setSizes(sizes.filter(s => s !== size))} className="ml-2 text-error"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="e.g. XL" className="h-9" />
              <Button type="button" size="sm" onClick={() => { if(newSize && !sizes.includes(newSize)) { setSizes([...sizes, newSize]); setNewSize('') } }}>Add</Button>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-charcoal/10">
            <h3 className="font-medium">Colors</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {colors.map(color => (
                <span key={color.name} className="bg-mist px-2 py-1 text-xs rounded-sm flex items-center">
                  <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color.hex }} />
                  {color.name}
                  <button type="button" onClick={() => setColors(colors.filter(c => c.name !== color.name))} className="ml-2 text-error"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="w-10 p-1 h-9" />
              <Input value={newColorName} onChange={e => setNewColorName(e.target.value)} placeholder="Color Name" className="h-9 flex-1" />
              <Button type="button" size="sm" onClick={() => { if(newColorName) { setColors([...colors, { name: newColorName, hex: newColorHex }]); setNewColorName('') } }}>Add</Button>
            </div>
          </div>
          
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-charcoal/10 space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
      </div>
    </form>
  )
}
