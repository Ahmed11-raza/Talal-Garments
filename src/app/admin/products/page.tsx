import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Edit } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import Image from 'next/image'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export const dynamic = 'force-dynamic'

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Products</h1>
          <p className="text-muted">Manage your store's inventory and discard items.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-accent text-white">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="border border-border rounded-sm overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-ivory text-primary uppercase font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted">
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
                    <td className="px-6 py-4 font-medium text-accent">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={product.stock < 10 ? 'text-error font-medium' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-sm text-xs font-medium uppercase ${product.isVisible ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted'}`}>
                        {product.isVisible ? 'Visible' : 'Hidden'}
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
