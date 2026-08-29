"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice } from '@/lib/format'
import { PROVINCES, CITIES_BY_PROVINCE } from '@/lib/cities'
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const subtotal = getCartTotal()
  const freeShippingThreshold = parseInt(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '3000')
  const standardShipping = parseInt(process.env.NEXT_PUBLIC_STANDARD_SHIPPING || '250')
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : standardShipping
  const total = subtotal + shippingFee

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  })

  const cities = form.province ? (CITIES_BY_PROVINCE[form.province] || []) : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Your bag is empty')
      return
    }

    setLoading(true)
    try {
      const payload = {
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
        },
        address: {
          street: form.street,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode || undefined,
        },
        items: items.map(item => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        paymentMethod: 'cod' as const,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      clearCart()
      router.push(`/order-confirmed/${data.orderNumber}`)
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="container mx-auto px-4 py-24 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 text-charcoal/20 mx-auto" />
        <h1 className="font-serif text-3xl text-forest">Nothing to checkout</h1>
        <p className="text-charcoal/60">Add some items to your bag first.</p>
        <Button asChild size="lg">
          <Link href="/collections/all">Browse Collection</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl text-forest mb-12">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-10">
          {/* Contact */}
          <div className="space-y-6">
            <h2 className="font-serif text-xl text-forest">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="03XX XXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          {/* Delivery */}
          <div className="space-y-6">
            <h2 className="font-serif text-xl text-forest">Delivery Address</h2>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Textarea id="street" rows={2} value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <select
                  id="province"
                  className="flex h-11 w-full rounded-sm border border-charcoal/20 bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-forest"
                  value={form.province}
                  onChange={e => setForm({ ...form, province: e.target.value, city: '' })}
                  required
                >
                  <option value="">Select Province</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <select
                  id="city"
                  className="flex h-11 w-full rounded-sm border border-charcoal/20 bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-forest"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  required
                  disabled={!form.province}
                >
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-forest">Payment Method</h2>
            <div className="border-2 border-forest bg-forest/5 rounded-sm p-4 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-forest flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-forest" />
              </div>
              <div>
                <p className="font-medium text-forest">Cash on Delivery (COD)</p>
                <p className="text-sm text-charcoal/60">Pay when you receive your order</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (optional)</Label>
            <Textarea id="notes" rows={3} placeholder="Any special instructions for delivery..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-mist/50 rounded-sm p-8 sticky top-24 space-y-6">
            <h2 className="font-serif text-xl text-forest">Order Summary</h2>

            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-charcoal/70">{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal/10 pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
              </div>
              <div className="border-t border-charcoal/10 pt-3 flex justify-between text-base">
                <span className="font-medium">Total</span>
                <span className="font-serif text-xl text-forest">{formatPrice(total)}</span>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Placing Order...</>
              ) : (
                <>Place Order — {formatPrice(total)}</>
              )}
            </Button>

            <p className="text-xs text-charcoal/40 text-center">By placing this order you agree to our terms of service</p>
          </div>
        </div>
      </form>
    </section>
  )
}
