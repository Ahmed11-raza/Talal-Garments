import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/storefront/ProductCard'

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } })
  return [
    { slug: 'all' },
    ...categories.map(c => ({ slug: c.slug })),
  ]
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
    description = 'Browse our complete collection of premium menswear.'
  } else {
    const category = await prisma.category.findUnique({ where: { slug } })
    if (!category) notFound()

    products = await prisma.product.findMany({
      where: { categoryId: category.id, isVisible: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    title = category.name
    description = `Explore our ${category.name.toLowerCase()} collection.`
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 space-y-2">
        <p className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Collection</p>
        <h1 className="font-serif text-4xl md:text-5xl text-forest">{title}</h1>
        <p className="text-charcoal/60 max-w-lg">{description}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <p className="font-serif text-2xl text-forest">No products yet</p>
          <p className="text-charcoal/60">Check back soon — new items are added regularly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
