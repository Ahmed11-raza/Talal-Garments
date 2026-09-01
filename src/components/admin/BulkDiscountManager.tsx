"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Percent, Tag, Zap, RotateCcw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface BulkDiscountManagerProps {
  categories: { id: string; name: string }[]
}

export function BulkDiscountManager({ categories }: BulkDiscountManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage')
  const [value, setValue] = useState('30')

  const handleApplyDiscount = async (action: 'apply' | 'remove') => {
    const categoryName = selectedCategory === 'all' 
      ? 'All Categories' 
      : categories.find(c => c.id === selectedCategory)?.name || 'Category'

    if (action === 'apply') {
      const confirmMsg = `Apply ${discountType === 'percentage' ? value + '% OFF' : 'Flat Rs. ' + value + ' OFF'} to ${categoryName}?`
      if (!confirm(confirmMsg)) return
    } else {
      if (!confirm(`Remove all discounts from ${categoryName}?`)) return
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

  return (
    <div className="bg-gradient-to-r from-primary via-stone-900 to-primary text-white p-6 rounded-sm shadow-md border border-white/10 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/20 rounded-full text-accent">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold">Category & Flat Discount Manager</h3>
            <p className="text-xs text-white/70">Apply percentage or flat Rs. discounts across entire categories in one click.</p>
          </div>
        </div>
        
        <span className="bg-accent text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs">
          Bulk Sales Tool
        </span>
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
            className="flex-1 h-11 bg-accent hover:bg-accent-light text-white text-xs font-semibold uppercase tracking-wider rounded-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Discount'}
          </Button>

          <Button
            type="button"
            onClick={() => handleApplyDiscount('remove')}
            disabled={loading}
            variant="outline"
            className="h-11 border-white/20 text-white hover:bg-white/10 rounded-sm px-3"
            title="Reset/Remove Discounts"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
