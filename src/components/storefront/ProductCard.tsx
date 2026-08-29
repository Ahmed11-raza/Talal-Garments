"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { useWishlistStore } from '@/lib/wishlist'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice: number | null
    images: string // JSON string
    stock: number
    category: { name: string; slug: string }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const images: string[] = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
  const firstImage = images.length > 0 ? images[0] : null
  const { addItem, removeItem, hasItem } = useWishlistStore()
  const isWishlisted = hasItem(product.id)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeItem(product.id)
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: firstImage || '',
        slug: product.slug,
      })
    }
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-mist rounded-sm overflow-hidden mb-4">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto border border-charcoal/10 rounded-full flex items-center justify-center">
                <span className="font-serif text-2xl text-charcoal/20">T</span>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 bg-sand/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sand"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn("w-4 h-4", isWishlisted ? "fill-error text-error" : "text-forest")} />
        </button>

        {/* Out of stock badge */}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-charcoal text-sand px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-sm">
            Sold Out
          </div>
        )}

        {/* Sale badge */}
        {product.comparePrice && product.comparePrice > product.price && (
          <div className="absolute top-3 left-3 bg-error text-sand px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-sm">
            Sale
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-charcoal/50 uppercase tracking-wider">{product.category.name}</p>
        <h3 className="font-medium text-forest group-hover:text-gold transition-colors line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-medium text-forest">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-charcoal/40 line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
