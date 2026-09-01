"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to discard/delete "${name}"? This action cannot be undone.`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete product')

      toast.success(`"${name}" discarded successfully`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-error hover:text-error hover:bg-error/10"
      onClick={handleDelete}
      disabled={loading}
      title="Discard Product"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  )
}
