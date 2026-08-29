"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useWishlistStore } from '@/lib/wishlist'
import { useCartStore } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import { Heart, ShoppingBag, X, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore(state => state.addItem)

  if (items.length === 0) {
    return (
      <section className="container mx-auto px-4 py-24 text-center space-y-6">
        <Heart className="w-16 h-16 text-charcoal/20 mx-auto" />
        <h1 className="font-serif text-3xl text-forest">Your wishlist is empty</h1>
        <p className="text-charcoal/60 max-w-md mx-auto">Save items you love for later by tapping the heart icon on any product.</p>
        <Button asChild size="lg">
          <Link href="/collections/all">
            Browse Collection
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl text-forest mb-12">Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.productId} className="group">
            <Link href={`/product/${item.slug}`} className="block">
              <div className="relative aspect-[3/4] bg-mist rounded-sm overflow-hidden mb-4">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif text-2xl text-charcoal/20">T</span>
                  </div>
                )}
                <button
                  onClick={(e) => { e.preventDefault(); removeItem(item.productId) }}
                  className="absolute top-3 right-3 w-8 h-8 bg-sand/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-sand transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <X className="w-4 h-4 text-charcoal" />
                </button>
              </div>
              <h3 className="font-medium text-forest group-hover:text-gold transition-colors line-clamp-1">{item.name}</h3>
              <p className="font-medium text-forest">{formatPrice(item.price)}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
