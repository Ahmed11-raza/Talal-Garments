"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useWishlistStore } from '@/lib/wishlist'
import { useCartStore } from '@/lib/cart'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addCartItem = useCartStore(s => s.addItem)

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-24 text-center">
        <Heart className="w-16 h-16 text-border mb-6" />
        <h1 className="font-serif text-3xl text-primary mb-3">Your wishlist is empty</h1>
        <p className="text-muted mb-8 max-w-md">Save pieces you love to revisit later.</p>
        <Button asChild className="bg-primary hover:bg-accent rounded-sm h-12 px-8 text-xs tracking-[0.15em] uppercase font-semibold">
          <Link href="/collections/all">Explore Collection</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <h1 className="font-serif text-4xl text-primary mb-12">Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {items.map(item => (
          <div key={item.productId} className="group relative">
            <Link href={`/product/${item.slug}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden bg-ivory rounded-sm mb-4">
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <h3 className="font-serif text-lg text-primary group-hover:text-accent transition-colors">{item.name}</h3>
              <p className="text-sm font-medium text-accent mt-1">{formatPrice(item.price)}</p>
            </Link>
            <button
              onClick={() => { removeItem(item.productId); toast.success('Removed from wishlist') }}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-muted hover:text-error transition-colors z-10"
              aria-label="Remove from wishlist"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
