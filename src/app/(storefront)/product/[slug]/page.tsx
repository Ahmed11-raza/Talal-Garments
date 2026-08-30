import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/storefront/ProductDetailClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | Talal Garments`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!product) notFound()

  // Get related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isVisible: true,
    },
    include: { category: true },
    take: 4,
  })

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  )
}
