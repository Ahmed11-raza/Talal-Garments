import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/storefront/ProductDetailClient'
import type { Metadata } from 'next'
import { ALL_PRODUCTS_CATALOG } from '@/lib/products-data'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  let product: any = null
  try {
    product = await prisma.product.findUnique({ where: { slug } })
  } catch (e) {
    product = null
  }

  if (!product) {
    product = ALL_PRODUCTS_CATALOG.find(p => p.slug === slug)
  }

  if (!product) return { title: 'Product Not Found | Talal Garments' }

  return {
    title: `${product.name} | Talal Garments`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  let product: any = null
  let relatedProducts: any[] = []

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    })

    if (dbProduct) {
      product = dbProduct
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: dbProduct.categoryId,
          id: { not: dbProduct.id },
          isVisible: true,
        },
        include: { category: true },
        take: 4,
      })
    }
  } catch (e) {
    console.error("DB fetch error on product page:", e)
  }

  // Fallback to static catalog if DB is empty
  if (!product) {
    product = ALL_PRODUCTS_CATALOG.find(p => p.slug === slug)
    if (product) {
      relatedProducts = ALL_PRODUCTS_CATALOG.filter(
        p => p.categoryId === product.categoryId && p.id !== product.id
      ).slice(0, 4)
    }
  }

  if (!product) notFound()

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  )
}
