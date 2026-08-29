"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/cart'
import { useWishlistStore } from '@/lib/wishlist'
import { formatPrice } from '@/lib/format'
import { ProductCard } from './ProductCard'
import { Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProductDetailClientProps {
  product: any
  relatedProducts: any[]
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const images: string[] = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
  const sizes: string[] = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes
  const colors: { name: string; hex: string }[] = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors

  const [selectedSize, setSelectedSize] = useState(sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const addItem = useCartStore(state => state.addItem)
  const { addItem: addWishlist, removeItem: removeWishlist, hasItem } = useWishlistStore()
  const isWishlisted = hasItem(product.id)

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (!selectedColor) {
      toast.error('Please select a color')
      return
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        image: images[0] || '',
        maxStock: product.stock,
      })
    }

    toast.success(`${product.name} added to bag`)
  }

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeWishlist(product.id)
      toast('Removed from wishlist')
    } else {
      addWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || '',
        slug: product.slug,
      })
      toast.success('Added to wishlist')
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center text-sm text-charcoal/50 space-x-2">
          <Link href="/" className="hover:text-forest transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/collections/${product.category.slug}`} className="hover:text-forest transition-colors">{product.category.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-forest">{product.name}</span>
        </nav>
      </div>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-mist rounded-sm overflow-hidden relative">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto border border-charcoal/10 rounded-full flex items-center justify-center">
                      <span className="font-serif text-4xl text-charcoal/20">T</span>
                    </div>
                    <p className="text-charcoal/30 text-sm">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      "aspect-square bg-mist rounded-sm overflow-hidden relative border-2 transition-colors",
                      selectedImageIndex === i ? "border-forest" : "border-transparent hover:border-charcoal/20"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-8 space-y-8">
            <div className="space-y-3">
              <p className="text-gold text-sm tracking-[0.3em] uppercase font-medium">{product.category.name}</p>
              <h1 className="font-serif text-3xl md:text-4xl text-forest">{product.name}</h1>
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl text-forest">{formatPrice(product.price)}</span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-lg text-charcoal/40 line-through">{formatPrice(product.comparePrice)}</span>
                )}
              </div>
            </div>

            <p className="text-charcoal/70 leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Color: <span className="text-charcoal/60">{selectedColor}</span></p>
                <div className="flex gap-3">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all",
                        selectedColor === color.name ? "border-forest scale-110" : "border-charcoal/20 hover:border-charcoal/40"
                      )}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Size: <span className="text-charcoal/60">{selectedSize}</span></p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[48px] h-12 px-4 border rounded-sm text-sm font-medium transition-all",
                        selectedSize === size
                          ? "border-forest bg-forest text-sand"
                          : "border-charcoal/20 text-charcoal hover:border-forest"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="space-y-4 pt-4">
              {product.stock > 0 ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-charcoal/20 rounded-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-mist transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 h-12 flex items-center justify-center font-medium border-x border-charcoal/20">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-mist transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-charcoal/50">{product.stock} in stock</p>
                  </div>

                  <div className="flex gap-3">
                    <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Add to Bag
                    </Button>
                    <Button size="lg" variant="outline" onClick={toggleWishlist}>
                      <Heart className={cn("w-5 h-5", isWishlisted && "fill-error text-error")} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-error font-medium">Out of Stock</p>
                  <Button size="lg" variant="outline" onClick={toggleWishlist} className="w-full">
                    <Heart className={cn("w-5 h-5 mr-2", isWishlisted && "fill-error text-error")} />
                    {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                  </Button>
                </div>
              )}
            </div>

            {/* Trust Signals */}
            <div className="border-t border-charcoal/10 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-charcoal/60">
                <Truck className="w-4 h-4 text-gold" />
                <span>Free delivery on orders above Rs 3,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-charcoal/60">
                <RotateCcw className="w-4 h-4 text-gold" />
                <span>7-day easy returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-3xl text-forest mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
