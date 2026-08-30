"use client"

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/lib/cart'
import { useWishlistStore } from '@/lib/wishlist'
import { Button } from '@/components/ui/button'
import { Heart, Check, ChevronDown, ChevronUp, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import JsonLd from '@/components/seo/JsonLd'
import { ProductCard } from './ProductCard'

export function ProductDetailClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const [selectedImage, setSelectedImage] = useState(0)
  
  // Safe parsing for SQLite JSON strings
  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
  const sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes
  const colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors
  
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '')
  
  const [accordionOpen, setAccordionOpen] = useState({ details: true, shipping: false })

  const addItem = useCartStore(s => s.addItem)
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore()

  const inWishlist = wishlistItems.some(i => i.productId === product.id)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || '/placeholder.png',
      color: selectedColor,
      size: selectedSize,
      maxStock: product.stock,
    })
    toast.success('Added to cart')
  }

  const toggleWishlist = () => {
    if (inWishlist) {
      removeWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || '/placeholder.png',
        slug: product.slug,
      })
      toast.success('Added to wishlist')
    }
  }

  const jsonLdData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Talal Garments"
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_APP_URL || 'https://talal-garmentss.vercel.app'}/product/${product.slug}`,
      "priceCurrency": "PKR",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  }

  return (
    <>
      <JsonLd data={jsonLdData} />
      
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-24">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 h-fit sticky top-24">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 shrink-0">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-sm transition-all ${
                    selectedImage === idx ? 'ring-1 ring-primary opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-ivory rounded-sm">
              <Image 
                src={images[selectedImage] || '/placeholder.png'} 
                alt={product.name} 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-opacity duration-300"
              />
              {product.comparePrice && product.comparePrice > product.price && (
                <div className="absolute top-4 left-4 bg-accent text-white text-xs uppercase tracking-wider px-3 py-1.5 font-medium z-10">
                  Sale
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full lg:w-1/2 max-w-lg lg:pt-8">
            <div className="mb-2">
              <span className="text-xs tracking-[0.2em] uppercase text-muted font-bold">
                {product.category?.name || 'Talal Garments'}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl lg:text-5xl text-primary mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-medium text-accent">{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-muted line-through text-lg">{formatPrice(product.comparePrice)}</span>
              )}
            </div>

            {/* Colors */}
            {colors && colors.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm uppercase tracking-wider font-medium text-primary">Color: <span className="text-muted">{selectedColor}</span></span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c: any) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === c.name ? 'border-primary' : 'border-transparent hover:border-border'
                      }`}
                      title={c.name}
                    >
                      <span 
                        className="w-8 h-8 rounded-full border border-border" 
                        style={{ backgroundColor: c.hex || '#ccc' }} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes && sizes.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm uppercase tracking-wider font-medium text-primary">Size</span>
                  <button className="text-xs text-muted underline underline-offset-4 hover:text-primary transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-12 border rounded-sm flex items-center justify-center text-sm font-medium transition-all ${
                        selectedSize === s 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-border bg-white text-primary hover:border-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-12">
              <Button 
                size="lg" 
                className="flex-1 h-14 bg-primary hover:bg-accent rounded-sm text-xs tracking-[0.15em] uppercase font-semibold transition-colors"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className={`h-14 w-14 rounded-sm border-border ${inWishlist ? 'text-accent border-accent' : 'text-primary hover:border-primary'}`}
                onClick={toggleWishlist}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Accordions */}
            <div className="border-t border-border">
              {/* Details */}
              <div className="border-b border-border">
                <button 
                  className="w-full flex justify-between items-center py-5 text-sm uppercase tracking-wider font-medium text-primary"
                  onClick={() => setAccordionOpen({...accordionOpen, details: !accordionOpen.details})}
                >
                  Product Details
                  {accordionOpen.details ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {accordionOpen.details && (
                  <div className="pb-6 text-muted text-sm leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </div>
                )}
              </div>
              
              {/* Shipping */}
              <div className="border-b border-border">
                <button 
                  className="w-full flex justify-between items-center py-5 text-sm uppercase tracking-wider font-medium text-primary"
                  onClick={() => setAccordionOpen({...accordionOpen, shipping: !accordionOpen.shipping})}
                >
                  Shipping & Returns
                  {accordionOpen.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {accordionOpen.shipping && (
                  <div className="pb-6 text-muted text-sm leading-relaxed space-y-3">
                    <p>• Nationwide Cash on Delivery (COD) available.</p>
                    <p>• Free shipping on orders over Rs. 5,000.</p>
                    <p>• Standard delivery within 3-5 working days.</p>
                    <p>• 7-day hassle-free returns and exchanges for unwashed/unworn items.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Share */}
            <div className="mt-8 flex items-center gap-2 text-sm text-muted cursor-pointer hover:text-primary transition-colors w-fit">
              <Share2 className="w-4 h-4" />
              <span>Share this product</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="border-t border-border pt-16">
            <h2 className="font-serif text-3xl text-primary mb-10 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
