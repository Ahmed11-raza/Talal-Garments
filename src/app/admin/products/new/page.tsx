import { ProductForm } from '@/components/admin/ProductForm'
import prisma from '@/lib/prisma'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-forest">Add Product</h1>
        <p className="text-charcoal/70">Create a new product listing.</p>
      </div>
      
      <div className="bg-white p-6 border border-charcoal/10 rounded-sm">
        <ProductForm categories={categories} />
      </div>
    </div>
  )
}
