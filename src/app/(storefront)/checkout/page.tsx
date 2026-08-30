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
import { ShoppingBag, Loader2, Shield, Truck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const subtotal = getCartTotal()
  const shippingFee = subtotal >= 5000 ? 0 : 250
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

  const selectClass = "flex h-12 w-full border border-border bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Your cart is empty')
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
          productId: item.id,
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
      <section className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-border mb-6" />
        <h1 className="font-serif text-3xl text-primary mb-3">Nothing to checkout</h1>
        <p className="text-muted mb-8">Add some items to your cart first.</p>
        <Button asChild className="bg-primary hover:bg-accent rounded-sm h-12 px-8 text-xs tracking-[0.15em] uppercase font-semibold">
          <Link href="/collections/all">Browse Collection</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <h1 className="font-serif text-4xl text-primary mb-12">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Form Fields */}
        <div className="flex-1 space-y-10">
          {/* Contact */}
          <div className="space-y-6">
            <h2 className="text-sm uppercase tracking-[0.15em] font-bold text-primary pb-3 border-b border-border">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" className="h-12 rounded-sm border-border" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="03XX XXXXXXX" className="h-12 rounded-sm border-border" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" className="h-12 rounded-sm border-border" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          {/* Delivery */}
          <div className="space-y-6">
            <h2 className="text-sm uppercase tracking-[0.15em] font-bold text-primary pb-3 border-b border-border">Delivery Address</h2>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Textarea id="street" rows={2} className="rounded-sm border-border" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <select
                  id="province"
                  className={selectClass}
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
                  className={selectClass}
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
                <Input id="postalCode" className="h-12 rounded-sm border-border" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-[0.15em] font-bold text-primary pb-3 border-b border-border">Payment Method</h2>
            <div className="border-2 border-accent bg-accent/5 rounded-sm p-5 flex items-center gap-4">
              <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              </div>
              <div>
                <p className="font-medium text-primary">Cash on Delivery (COD)</p>
                <p className="text-sm text-muted">Pay when you receive your order</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (optional)</Label>
            <Textarea id="notes" rows={3} className="rounded-sm border-border" placeholder="Any special instructions for delivery..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-[400px] shrink-0">
          <div className="bg-ivory p-8 rounded-sm sticky top-28 space-y-6">
            <h2 className="text-sm uppercase tracking-[0.15em] font-bold text-primary">Order Summary</h2>

            <div className="space-y-4">
              {items.map(item => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-white rounded-sm overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                    <p className="text-xs text-muted">{item.color} · {item.size} · Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-accent mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="font-medium text-success">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-sm uppercase tracking-wider font-bold text-primary">Total</span>
                <span className="text-xl font-medium text-accent">{formatPrice(total)}</span>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 bg-primary hover:bg-accent rounded-sm text-xs tracking-[0.15em] uppercase font-semibold" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Placing Order...</>
              ) : (
                <>Place Order — {formatPrice(total)}</>
              )}
            </Button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-6 text-xs text-muted pt-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>3-5 Day Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}
