"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Percent, Tag, Zap, RotateCcw, Loader2, Sparkles, ShoppingBag, Layers, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/format'

interface BulkDiscountManagerProps {
  categories: { id: string; name: string }[]
  products?: { id: string; name: string; price: number; comparePrice?: number | null; categoryId?: string }[]
}

export function BulkDiscountManager({ categories, products = [] }: BulkDiscountManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Controls
  const [scopeType, setScopeType] = useState<'store' | 'category' | 'product'>('store')
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '')
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '')
  const [campaignName, setCampaignName] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage')
  const [discountValue, setDiscountValue] = useState('20')

  // Selected product object for live preview
  const activeProduct = products.find(p => p.id === selectedProductId)
  const previewOriginalPrice = activeProduct 
    ? (activeProduct.comparePrice || activeProduct.price) 
    : 4000

  const numVal = parseFloat(discountValue) || 0
  let previewDiscountedPrice = previewOriginalPrice
  if (discountType === 'percentage') {
    previewDiscountedPrice = Math.max(100, Math.round(previewOriginalPrice * (1 - numVal / 100)))
  } else {
    previewDiscountedPrice = Math.max(100, Math.round(previewOriginalPrice - numVal))
  }
  const previewSavings = previewOriginalPrice - previewDiscountedPrice
  const previewPercent = Math.round((previewSavings / previewOriginalPrice) * 100)

  const handleApplyDiscount = async (action: 'apply' | 'remove') => {
    let targetType: 'all' | 'category' | 'product' = 'all'
    let targetId = 'all'
    let targetLabel = 'Entire Store'

    if (scopeType === 'category') {
      targetType = 'category'
      targetId = selectedCategoryId
      targetLabel = categories.find(c => c.id === selectedCategoryId)?.name || 'Selected Category'
    } else if (scopeType === 'product') {
      targetType = 'product'
      targetId = selectedProductId
      targetLabel = products.find(p => p.id === selectedProductId)?.name || 'Selected Product'
    }

    if (action === 'apply') {
      if (!discountValue || numVal <= 0) {
        toast.error('Please enter a valid discount value greater than 0')
        return
      }
      const desc = discountType === 'percentage' ? `${discountValue}% OFF` : `Flat Rs. ${discountValue} OFF`
      const confirmMsg = `Apply ${desc} ${campaignName ? `("${campaignName}") ` : ''}to ${targetLabel}?`
      if (!confirm(confirmMsg)) return
    } else {
      if (!confirm(`Reset and remove all discounts from ${targetLabel}?`)) return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/products/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          discountType,
          value: discountValue,
          campaignName: campaignName.trim(),
          action
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success(data.message)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-border rounded-sm shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-accent rounded-sm text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold">Discounts & Promotions Control Center</h2>
            <p className="text-xs text-white/70">Create custom sales, apply discounts to single items, categories, or storewide with custom percentages and names.</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Step 1: Target Scope Selection */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider font-semibold text-primary block">
            1. Where do you want to apply the discount?
          </Label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setScopeType('product')}
              className={`p-4 border rounded-sm text-left transition-all flex items-start gap-3 ${
                scopeType === 'product'
                  ? 'border-accent bg-accent/5 ring-1 ring-accent'
                  : 'border-border hover:bg-ivory'
              }`}
            >
              <ShoppingBag className={`w-5 h-5 shrink-0 mt-0.5 ${scopeType === 'product' ? 'text-accent' : 'text-muted'}`} />
              <div>
                <span className="font-semibold text-sm text-primary block">Specific Single Item</span>
                <span className="text-xs text-muted">Apply discount to one chosen product</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScopeType('category')}
              className={`p-4 border rounded-sm text-left transition-all flex items-start gap-3 ${
                scopeType === 'category'
                  ? 'border-accent bg-accent/5 ring-1 ring-accent'
                  : 'border-border hover:bg-ivory'
              }`}
            >
              <Layers className={`w-5 h-5 shrink-0 mt-0.5 ${scopeType === 'category' ? 'text-accent' : 'text-muted'}`} />
              <div>
                <span className="font-semibold text-sm text-primary block">Entire Category</span>
                <span className="text-xs text-muted">e.g. All Men's Stitched, Caps, etc.</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScopeType('store')}
              className={`p-4 border rounded-sm text-left transition-all flex items-start gap-3 ${
                scopeType === 'store'
                  ? 'border-accent bg-accent/5 ring-1 ring-accent'
                  : 'border-border hover:bg-ivory'
              }`}
            >
              <Sparkles className={`w-5 h-5 shrink-0 mt-0.5 ${scopeType === 'store' ? 'text-accent' : 'text-muted'}`} />
              <div>
                <span className="font-semibold text-sm text-primary block">Entire Store</span>
                <span className="text-xs text-muted">Storewide flat or % discount</span>
              </div>
            </button>
          </div>

          {/* Conditional Dropdown for Product or Category */}
          {scopeType === 'product' && (
            <div className="pt-2">
              <Label htmlFor="product-select" className="text-xs font-medium text-primary mb-1.5 block">
                Select the Product:
              </Label>
              <select
                id="product-select"
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="w-full h-11 border border-border rounded-sm px-3 text-sm bg-white focus:outline-none focus:border-accent"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Current Price: {formatPrice(p.price)} {p.comparePrice ? `(Original: ${formatPrice(p.comparePrice)})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {scopeType === 'category' && (
            <div className="pt-2">
              <Label htmlFor="category-select" className="text-xs font-medium text-primary mb-1.5 block">
                Select the Category:
              </Label>
              <select
                id="category-select"
                value={selectedCategoryId}
                onChange={e => setSelectedCategoryId(e.target.value)}
                className="w-full h-11 border border-border rounded-sm px-3 text-sm bg-white focus:outline-none focus:border-accent"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Step 2: Discount Configuration & Custom Details */}
        <div className="pt-4 border-t border-border space-y-4">
          <Label className="text-xs uppercase tracking-wider font-semibold text-primary block">
            2. Configure Discount Name, Type & Percentage / Amount
          </Label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Custom Promotion / Sale Name */}
            <div className="space-y-1.5">
              <Label htmlFor="campaign-name" className="text-xs text-muted">
                Sale / Campaign Name (Optional)
              </Label>
              <Input
                id="campaign-name"
                placeholder="e.g. Azadi Sale, Winter Special, Flash Deal"
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                className="h-11 text-xs"
              />
            </div>

            {/* Discount Type Toggle */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted">Discount Type</Label>
              <div className="grid grid-cols-2 gap-1 bg-ivory p-1 rounded-sm border border-border h-11 items-center">
                <button
                  type="button"
                  onClick={() => { setDiscountType('percentage'); setDiscountValue('25') }}
                  className={`h-full text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1 transition-colors ${
                    discountType === 'percentage' ? 'bg-accent text-white shadow-xs' : 'text-primary hover:bg-white/60'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" /> % OFF
                </button>
                <button
                  type="button"
                  onClick={() => { setDiscountType('flat'); setDiscountValue('500') }}
                  className={`h-full text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1 transition-colors ${
                    discountType === 'flat' ? 'bg-accent text-white shadow-xs' : 'text-primary hover:bg-white/60'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" /> Flat Rs.
                </button>
              </div>
            </div>

            {/* Discount Value (Percentage or Flat Amount) */}
            <div className="space-y-1.5">
              <Label htmlFor="discount-val" className="text-xs text-muted">
                {discountType === 'percentage' ? 'Enter Percentage (% OFF)' : 'Enter Flat Discount (Rs. OFF)'}
              </Label>
              <div className="relative">
                <Input
                  id="discount-val"
                  type="number"
                  placeholder={discountType === 'percentage' ? 'e.g. 15, 25, 30, 40' : 'e.g. 500, 1000'}
                  value={discountValue}
                  onChange={e => setDiscountValue(e.target.value)}
                  className="h-11 pr-12 text-sm font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-accent">
                  {discountType === 'percentage' ? '%' : 'PKR'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        <div className="bg-ivory/80 border border-border/80 p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
            <div>
              <span className="text-xs font-semibold text-primary block">
                Live Price Calculation Preview:
              </span>
              <p className="text-xs text-muted">
                Original Price: <span className="line-through">{formatPrice(previewOriginalPrice)}</span> ➔{' '}
                <strong className="text-accent text-sm font-bold">{formatPrice(previewDiscountedPrice)}</strong>
                {' '}(Customer Saves: {formatPrice(previewSavings)} / {previewPercent}% OFF)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              disabled={loading}
              onClick={() => handleApplyDiscount('apply')}
              className="flex-1 sm:flex-none h-11 bg-accent hover:bg-accent-light text-white text-xs font-semibold uppercase tracking-wider px-6 rounded-sm shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Discount Now'}
            </Button>

            <Button
              type="button"
              disabled={loading}
              onClick={() => handleApplyDiscount('remove')}
              variant="outline"
              className="h-11 border-border hover:bg-error/10 hover:text-error hover:border-error text-xs px-3 rounded-sm"
              title="Reset and remove discounts from selected target"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
