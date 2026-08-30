import { ProductForm } from '@/components/admin/ProductForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ])
  
  if (!product) {
    notFound()
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Edit Product</h1>
        <p className="text-muted">Update product information.</p>
      </div>
      
      <div className="bg-white p-6 border border-border rounded-sm">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  )
}
