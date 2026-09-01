import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Edit } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import Image from 'next/image'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { BulkDiscountManager } from '@/components/admin/BulkDiscountManager'

export const dynamic = 'force-dynamic'

export default async function AdminProducts() {
  let products: any[] = []
  let categories: any[] = []

  try {
    const [prods, cats] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      }),
      prisma.category.findMany({ orderBy: { name: 'asc' } })
    ])
    products = prods
    categories = cats
  } catch (error) {
    console.error("Admin products DB fetch error:", error)
    products = []
    categories = []
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Products & Discounts</h1>
          <p className="text-muted">Manage inventory, apply category & flat discounts, or add new items.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-accent text-white">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Bulk Category & Flat Discount Manager */}
      <BulkDiscountManager categories={categories} />

      {/* Products Inventory Table */}
      <div className="border border-border rounded-sm overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-ivory text-primary uppercase font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Current Price</th>
              <th className="px-6 py-4">Compare Price</th>
              <th className="px-6 py-4">Discount Tag</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted">
                  No products found. Click "Add Product" above to create one.
                </td>
              </tr>
            ) : (
              products.map(product => {
                let firstImage = null
                try {
                  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
                  firstImage = images.length > 0 ? images[0] : null
                } catch {
                  firstImage = null
                }

                let discountBadge = null
                if (product.comparePrice && product.comparePrice > product.price) {
                  const pct = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                  discountBadge = `${pct}% OFF`
                }
                
                return (
                  <tr key={product.id} className="border-t border-border hover:bg-ivory/50 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-4">
                      {firstImage ? (
                        <div className="w-12 h-12 relative rounded-sm overflow-hidden bg-ivory shrink-0">
                          <Image src={firstImage} alt={product.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-sm bg-ivory shrink-0" />
                      )}
                      <span className="font-medium text-primary">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">{product.category.name}</td>
                    <td className="px-6 py-4 font-semibold text-accent">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 text-muted">
                      {product.comparePrice ? (
                        <span className="line-through">{formatPrice(product.comparePrice)}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {discountBadge ? (
                        <span className="bg-error text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">
                          {discountBadge}
                        </span>
                      ) : (
                        <span className="text-xs text-muted font-normal">Regular</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.stock <= 8 ? 'text-error font-bold' : ''}>
                        {product.stock} {product.stock <= 8 && '(Low)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" asChild title="Edit Product">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
