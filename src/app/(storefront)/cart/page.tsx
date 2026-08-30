"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-border mb-6" />
        <h1 className="font-serif text-3xl text-primary mb-3">Your cart is empty</h1>
        <p className="text-muted mb-8 max-w-md">
          Looks like you haven&apos;t added anything to your cart yet. Start exploring our collections.
        </p>
        <Button asChild className="bg-primary hover:bg-accent rounded-sm h-12 px-8 text-xs tracking-[0.15em] uppercase font-semibold">
          <Link href="/collections/all">Continue Shopping</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <h1 className="font-serif text-4xl text-primary mb-12">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs uppercase tracking-wider font-medium text-muted">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Price</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          <div className="divide-y divide-border">
            {items.map(item => (
              <div key={`${item.id}-${item.color}-${item.size}`} className="grid grid-cols-12 gap-4 py-6 items-center">
                {/* Product info */}
                <div className="col-span-12 md:col-span-6 flex gap-4">
                  <div className="relative w-20 h-28 bg-ivory rounded-sm overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link href={`/product/${item.id}`} className="font-serif text-lg text-primary hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted mt-1">
                      {item.color} · {item.size}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-muted hover:text-error mt-2 flex items-center gap-1 w-fit transition-colors md:hidden"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-center">
                  <div className="flex items-center border border-border rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-ivory transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 h-9 flex items-center justify-center text-sm font-medium border-x border-border">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-ivory transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="col-span-4 md:col-span-2 text-right text-sm text-muted">
                  {formatPrice(item.price)}
                </div>

                {/* Total */}
                <div className="col-span-4 md:col-span-2 text-right">
                  <span className="font-medium text-primary">{formatPrice(item.price * item.quantity)}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="hidden md:block text-xs text-muted hover:text-error mt-1 ml-auto w-fit transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-[360px] shrink-0">
          <div className="bg-ivory p-8 rounded-sm sticky top-28">
            <h2 className="text-sm uppercase tracking-wider font-bold text-primary mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm border-b border-border pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="text-success font-medium">{getCartTotal() >= 5000 ? 'Free' : formatPrice(250)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <span className="text-sm uppercase tracking-wider font-bold text-primary">Total</span>
              <span className="text-xl font-medium text-accent">
                {formatPrice(getCartTotal() + (getCartTotal() >= 5000 ? 0 : 250))}
              </span>
            </div>

            <Button asChild size="lg" className="w-full h-14 bg-primary hover:bg-accent rounded-sm text-xs tracking-[0.15em] uppercase font-semibold">
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Link href="/collections/all" className="block text-center text-xs text-muted mt-6 hover:text-primary transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
