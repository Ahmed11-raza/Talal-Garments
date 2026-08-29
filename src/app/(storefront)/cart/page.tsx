"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore, type CartItem } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal, clearCart } = useCartStore()
  const subtotal = getCartTotal()
  const freeShippingThreshold = parseInt(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '3000')
  const standardShipping = parseInt(process.env.NEXT_PUBLIC_STANDARD_SHIPPING || '250')
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : standardShipping
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return (
      <section className="container mx-auto px-4 py-24 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 text-charcoal/20 mx-auto" />
        <h1 className="font-serif text-3xl text-forest">Your bag is empty</h1>
        <p className="text-charcoal/60 max-w-md mx-auto">Looks like you haven&apos;t added anything yet. Browse our collection to find something you love.</p>
        <Button asChild size="lg">
          <Link href="/collections/all">
            Start Shopping
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl text-forest mb-12">Shopping Bag</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item: CartItem) => (
            <div key={item.id} className="flex gap-4 border-b border-charcoal/10 pb-6">
              <div className="w-24 h-32 bg-mist rounded-sm overflow-hidden relative flex-shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="100px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif text-xl text-charcoal/20">T</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-forest">{item.name}</h3>
                    <p className="text-sm text-charcoal/50">{item.color} · {item.size}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-charcoal/40 hover:text-error transition-colors"
                    aria-label="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center border border-charcoal/20 rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-mist transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-charcoal/20">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-mist transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-medium text-forest">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-mist/50 rounded-sm p-8 sticky top-24 space-y-6">
            <h2 className="font-serif text-xl text-forest">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Shipping</span>
                <span className="font-medium">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-gold">Add {formatPrice(freeShippingThreshold - subtotal)} more for free shipping</p>
              )}
              <div className="border-t border-charcoal/10 pt-3 flex justify-between text-base">
                <span className="font-medium">Total</span>
                <span className="font-serif text-xl text-forest">{formatPrice(total)}</span>
              </div>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <p className="text-xs text-charcoal/40 text-center">Cash on Delivery available across Pakistan</p>
          </div>
        </div>
      </div>
    </section>
  )
}
