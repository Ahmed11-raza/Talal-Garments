import { ProductForm } from '@/components/admin/ProductForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ALL_PRODUCTS_CATALOG, CATEGORIES_DATA } from '@/lib/products-data'

export const dynamic = 'force-dynamic'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  let product: any = null
  let categories: any[] = []

  try {
    const [prod, cats] = await Promise.all([
      prisma.product.findUnique({ where: { id } }),
      prisma.category.findMany({ orderBy: { name: 'asc' } })
    ])
    if (prod) product = prod
    if (cats && cats.length > 0) categories = cats
  } catch (error) {
    console.error("Edit product DB fetch error:", error)
  }

  // Fallback to static catalog if DB is empty
  if (!product) {
    product = ALL_PRODUCTS_CATALOG.find(p => p.id === id || p.slug === id)
  }
  if (categories.length === 0) {
    categories = CATEGORIES_DATA
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Edit Product</h1>
        <p className="text-muted">Update product information, pricing, discounts, sizes, and colors.</p>
      </div>
      
      <div className="bg-white p-6 md:p-8 border border-border rounded-sm shadow-sm">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  )
}
