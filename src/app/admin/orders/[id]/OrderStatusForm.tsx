"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface OrderStatusFormProps {
  orderId: string
  initialStatus: string
}

export function OrderStatusForm({ orderId, initialStatus }: OrderStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('Failed to update status')
      
      toast.success('Status updated')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <select
        className="flex h-11 w-full rounded-sm border border-border bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      
      <Button 
        className="w-full" 
        onClick={handleUpdate} 
        disabled={loading || status === initialStatus}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Status'}
      </Button>
    </div>
  )
}
