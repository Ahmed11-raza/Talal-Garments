import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import Image from 'next/image'

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest">Products</h1>
          <p className="text-charcoal/70">Manage your store's inventory.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="border border-charcoal/10 rounded-sm overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-mist text-forest uppercase font-medium">
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
            {products.map(product => {
              const images = JSON.parse(product.images as string)
              const firstImage = images.length > 0 ? images[0] : null
              
              return (
                <tr key={product.id} className="border-t border-charcoal/10 hover:bg-mist/30">
                  <td className="px-6 py-4 flex items-center space-x-4">
                    {firstImage ? (
                      <div className="w-12 h-12 relative rounded-sm overflow-hidden bg-sand">
                        <Image src={firstImage} alt={product.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-sm bg-sand" />
                    )}
                    <span className="font-medium text-forest">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">{product.category.name}</td>
                  <td className="px-6 py-4">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock < 10 ? 'text-error font-medium' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-sm text-xs font-medium uppercase ${product.isVisible ? 'bg-forest/10 text-forest' : 'bg-charcoal/10 text-charcoal'}`}>
                      {product.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-error hover:text-error hover:bg-error/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
