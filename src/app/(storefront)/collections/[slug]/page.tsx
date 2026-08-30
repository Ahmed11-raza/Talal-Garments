import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/storefront/ProductCard'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

const categoryMeta: Record<string, { title: string; description: string }> = {
  'all': { title: 'All Products', description: 'Browse our complete collection of premium clothing.' },
  'mens-stitched': { title: "Men's Stitched", description: 'Ready-to-wear shalwar kameez, kurta sets, and waistcoats crafted by master tailors.' },
  'mens-unstitched': { title: "Men's Unstitched", description: 'Premium fabric suits and wash & wear collections for the discerning gentleman.' },
  'womens-stitched': { title: "Women's Stitched", description: 'Elegant ready-to-wear suits, formal wear, and everyday essentials.' },
  'womens-unstitched': { title: "Women's Unstitched", description: 'Luxury lawn, chiffon, and cotton fabrics for custom tailoring.' },
  'caps-headwear': { title: 'Caps & Headwear', description: 'Handcrafted prayer caps, pakol, and traditional headwear.' },
  'western-wear': { title: 'Western Wear', description: 'Contemporary casual wear — t-shirts, jeans, and jackets.' },
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = categoryMeta[slug]
  return {
    title: meta?.title || 'Collection',
    description: meta?.description || 'Browse our collection of premium clothing.',
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params

  let products
  let title: string
  let description: string

  if (slug === 'all') {
    products = await prisma.product.findMany({
      where: { isVisible: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    title = 'All Products'
    description = 'Browse our complete collection of premium clothing.'
  } else {
    const category = await prisma.category.findUnique({ where: { slug } })
    if (!category) notFound()

    products = await prisma.product.findMany({
      where: { categoryId: category.id, isVisible: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    title = category.name
    description = categoryMeta[slug]?.description || `Explore our ${category.name.toLowerCase()} collection.`
  }

  return (
    <section className="min-h-screen">
      {/* Category Header */}
      <div className="bg-primary text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="text-accent text-xs tracking-[0.2em] uppercase font-bold mb-4 block">Collection</span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">{title}</h1>
          <p className="text-white/60 max-w-lg mx-auto">{description}</p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-16">
        {products.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="font-serif text-2xl text-primary">No products yet</p>
            <p className="text-muted">Check back soon — new items are added regularly.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mb-8">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
