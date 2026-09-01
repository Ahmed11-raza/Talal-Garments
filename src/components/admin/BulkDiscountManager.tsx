"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Percent, Tag, Zap, RotateCcw, Loader2, Sparkles, Flame, Database } from 'lucide-react'
import { toast } from 'sonner'

interface BulkDiscountManagerProps {
  categories: { id: string; name: string }[]
}

export function BulkDiscountManager({ categories }: BulkDiscountManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage')
  const [value, setValue] = useState('30')

  // One-click preset campaign handler
  const handlePresetCampaign = async (name: string, cat: string, type: 'percentage' | 'flat', val: string) => {
    if (!confirm(`Launch "${name}" (${type === 'percentage' ? val + '% OFF' : 'Flat Rs. ' + val + ' OFF'})?`)) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/products/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: cat,
          discountType: type,
          value: val,
          action: 'apply'
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success(`🎉 ${name} Activated! ${data.message}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Campaign activation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyDiscount = async (action: 'apply' | 'remove') => {
    const categoryName = selectedCategory === 'all' 
      ? 'Entire Store' 
      : categories.find(c => c.id === selectedCategory)?.name || 'Category'

    if (action === 'apply') {
      const confirmMsg = `Apply ${discountType === 'percentage' ? value + '% OFF' : 'Flat Rs. ' + value + ' OFF'} to ${categoryName}?`
      if (!confirm(confirmMsg)) return
    } else {
      if (!confirm(`Reset and remove all discounts from ${categoryName}?`)) return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/products/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCategory,
          discountType,
          value,
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

  // Restore/populate full catalog of 20 products
  const handlePopulateDatabase = async () => {
    if (!confirm('Populate/Restore all 20 demo products across all 6 categories into database?')) return
    
    setSeeding(true)
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success(data.message)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to populate database')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Quick Festive & Event Campaigns */}
      <div className="bg-white p-6 rounded-sm border border-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" />
            <h3 className="font-serif text-lg font-bold text-primary">Quick Event & Festive Sales</h3>
          </div>
          <span className="text-xs text-muted">1-Click Storewide Promotions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handlePresetCampaign('🇵🇰 Azadi Sale (Flat 40% OFF)', 'all', 'percentage', '40')}
            className="p-3 bg-ivory hover:bg-accent/15 border border-border hover:border-accent rounded-sm text-left transition-all group"
          >
            <span className="text-base block mb-1">🇵🇰</span>
            <span className="text-xs font-bold text-primary block group-hover:text-accent">Azadi Sale</span>
            <span className="text-[11px] font-semibold text-error">Flat 40% OFF</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handlePresetCampaign('❄️ Winter Collection Sale (30% OFF)', 'all', 'percentage', '30')}
            className="p-3 bg-ivory hover:bg-accent/15 border border-border hover:border-accent rounded-sm text-left transition-all group"
          >
            <span className="text-base block mb-1">❄️</span>
            <span className="text-xs font-bold text-primary block group-hover:text-accent">Winter Sale</span>
            <span className="text-[11px] font-semibold text-accent">30% OFF Store</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handlePresetCampaign('🌙 Eid Festive Sale (25% OFF)', 'all', 'percentage', '25')}
            className="p-3 bg-ivory hover:bg-accent/15 border border-border hover:border-accent rounded-sm text-left transition-all group"
          >
            <span className="text-base block mb-1">🌙</span>
            <span className="text-xs font-bold text-primary block group-hover:text-accent">Eid Festive</span>
            <span className="text-[11px] font-semibold text-primary">25% OFF All</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handlePresetCampaign('🏷️ Flat Rs. 500 OFF', 'all', 'flat', '500')}
            className="p-3 bg-ivory hover:bg-accent/15 border border-border hover:border-accent rounded-sm text-left transition-all group"
          >
            <span className="text-base block mb-1">🏷️</span>
            <span className="text-xs font-bold text-primary block group-hover:text-accent">Flat Cash OFF</span>
            <span className="text-[11px] font-semibold text-success">Rs. 500 OFF</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleApplyDiscount('remove')}
            className="p-3 bg-ivory hover:bg-error/10 border border-border hover:border-error rounded-sm text-left transition-all group"
          >
            <span className="text-base block mb-1">🔄</span>
            <span className="text-xs font-bold text-primary block group-hover:text-error">Reset Prices</span>
            <span className="text-[11px] text-muted">Clear Discounts</span>
          </button>
        </div>
      </div>

      {/* 2. Custom Category & Flat Discount Controller */}
      <div className="bg-gradient-to-r from-primary via-stone-900 to-primary text-white p-6 rounded-sm shadow-md border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent/20 rounded-full text-accent">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">Custom Category & Flat Discount Controller</h3>
              <p className="text-xs text-white/70">Apply custom % or flat amount discount to any specific category or storewide.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handlePopulateDatabase}
              disabled={seeding}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-white text-xs font-semibold"
            >
              {seeding ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Database className="w-3.5 h-3.5 mr-1" />}
              Restore All 20 Products
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end pt-2">
          {/* Category Scope */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-semibold tracking-wider text-white/80">Target Scope</label>
            <select
              className="w-full h-11 bg-white/10 border border-white/20 rounded-sm px-3 text-xs text-white focus:outline-none focus:border-accent"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="all" className="bg-primary text-white">Entire Store (All Categories)</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-primary text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Type */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-semibold tracking-wider text-white/80">Discount Type</label>
            <div className="grid grid-cols-2 gap-1 bg-white/10 p-1 rounded-sm border border-white/20 h-11 items-center">
              <button
                type="button"
                onClick={() => { setDiscountType('percentage'); setValue('30') }}
                className={`h-full text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1 transition-colors ${
                  discountType === 'percentage' ? 'bg-accent text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <Percent className="w-3.5 h-3.5" /> % OFF
              </button>
              <button
                type="button"
                onClick={() => { setDiscountType('flat'); setValue('500') }}
                className={`h-full text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1 transition-colors ${
                  discountType === 'flat' ? 'bg-accent text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" /> Flat Rs.
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-semibold tracking-wider text-white/80">
              {discountType === 'percentage' ? 'Percentage (% OFF)' : 'Flat Amount (Rs. OFF)'}
            </label>
            <div className="relative">
              <Input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={discountType === 'percentage' ? 'e.g. 30' : 'e.g. 500'}
                className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-xs rounded-sm pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-accent">
                {discountType === 'percentage' ? '%' : 'PKR'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => handleApplyDiscount('apply')}
              disabled={loading}
              className="flex-1 h-11 bg-accent hover:bg-accent-light text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Discount'}
            </Button>

            <Button
              type="button"
              onClick={() => handleApplyDiscount('remove')}
              disabled={loading}
              variant="outline"
              className="h-11 border-white/20 text-white hover:bg-white/10 rounded-sm px-3"
              title="Reset/Remove Discounts from Selected Scope"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
