import { ProductForm } from '@/components/admin/ProductForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  let product = null
  let categories: any[] = []

  try {
    const [prod, cats] = await Promise.all([
      prisma.product.findUnique({ where: { id } }),
      prisma.category.findMany({ orderBy: { name: 'asc' } })
    ])
    product = prod
    categories = cats
  } catch (error) {
    console.error("Edit product DB fetch error:", error)
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Edit Product</h1>
        <p className="text-muted">Update product information, inventory, sizes, and colors.</p>
      </div>
      
      <div className="bg-white p-6 md:p-8 border border-border rounded-sm shadow-sm">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  )
}
