import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Edit } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import Image from 'next/image'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { BulkDiscountManager } from '@/components/admin/BulkDiscountManager'
import { ALL_PRODUCTS_CATALOG, CATEGORIES_DATA } from '@/lib/products-data'

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
    if (prods.length > 0) products = prods
    if (cats.length > 0) categories = cats
  } catch (error) {
    console.error("Admin products DB fetch error:", error)
  }

  // If DB is empty, use full default catalog so admin can see, manage, and edit all 20 products
  if (products.length === 0) {
    products = ALL_PRODUCTS_CATALOG
  }
  if (categories.length === 0) {
    categories = CATEGORIES_DATA
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Products & Sales Promotions</h1>
          <p className="text-muted text-sm">Manage inventory, apply storewide or category sales (Azadi Sale, Winter Sale), or create individual discounts.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-accent text-white shrink-0">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Bulk & Single Item, Category, Flat Discount Manager */}
      <BulkDiscountManager categories={categories} products={products} />

      {/* Products Inventory Table */}
      <div className="border border-border rounded-sm overflow-hidden bg-white shadow-sm">
        <div className="p-4 bg-ivory/80 border-b border-border flex items-center justify-between">
          <span className="font-serif font-bold text-base text-primary">Catalog Inventory ({products.length} Products)</span>
          <span className="text-xs text-muted">Showing all active items across 6 categories</span>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-ivory text-primary uppercase font-medium border-b border-border text-xs">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Sale Price</th>
              <th className="px-6 py-4">Original Price</th>
              <th className="px-6 py-4">Discount Tag</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
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
                    <div>
                      <span className="font-medium text-primary block">{product.name}</span>
                      <span className="text-[11px] text-muted">{product.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary/80">{product.category?.name || 'General'}</td>
                  <td className="px-6 py-4 font-bold text-accent">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-muted">
                    {product.comparePrice && product.comparePrice > product.price ? (
                      <span className="line-through">{formatPrice(product.comparePrice)}</span>
                    ) : (
                      <span className="text-muted/60">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {discountBadge ? (
                      <span className="bg-error text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                        {discountBadge}
                      </span>
                    ) : (
                      <span className="text-xs text-muted/70 font-normal">Regular</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={product.stock <= 6 ? 'text-error font-bold flex items-center gap-1' : 'text-primary'}>
                      {product.stock} {product.stock <= 6 && <span className="text-[10px] uppercase font-bold bg-error/10 px-1.5 py-0.5 rounded">(Low)</span>}
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
