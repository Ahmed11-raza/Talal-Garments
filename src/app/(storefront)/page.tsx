import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/format'
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/storefront/ProductCard'

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, isVisible: true },
      include: { category: true },
      take: 4,
    }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } })
  ])

  return (
    <>
      {/* Marquee Trust Strip */}
      <div className="bg-forest text-sand py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center space-x-12 text-xs tracking-wider">
          <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-gold" /> FREE DELIVERY OVER RS 3,000</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-gold" /> 100% AUTHENTIC FABRICS</span>
          <span>•</span>
          <span className="flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5 text-gold" /> 7-DAY EASY RETURNS</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Headphones className="w-3.5 h-3.5 text-gold" /> WHATSAPP SUPPORT</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-gold" /> FREE DELIVERY OVER RS 3,000</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-gold" /> 100% AUTHENTIC FABRICS</span>
          <span>•</span>
          <span className="flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5 text-gold" /> 7-DAY EASY RETURNS</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Headphones className="w-3.5 h-3.5 text-gold" /> WHATSAPP SUPPORT</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-forest overflow-hidden">
        {/* Decorative oversized numeral */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[40rem] font-serif font-bold text-sand/[0.03] leading-none select-none pointer-events-none" aria-hidden="true">
          01
        </div>

        <div className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Since 1998 · Attock, Pakistan</p>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-sand leading-[0.9] tracking-tight">
                منتخب
                <br />
                <span className="text-gold">انداز</span>
              </h1>
              <p className="text-sand/70 text-lg md:text-xl max-w-md pt-4 leading-relaxed">
                Craftsmanship passed down through generations. Every stitch, every thread — chosen with intention.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/collections/all">
                  Shop the Collection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-sand/30 text-sand hover:bg-sand hover:text-forest" asChild>
                <Link href="/collections/kurta-shalwar">
                  Kurta Shalwar
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero image placeholder — will show the first featured product image when available */}
          <div className="hidden lg:block aspect-[3/4] bg-sand/5 rounded-sm relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto border border-gold/30 rounded-full flex items-center justify-center">
                  <span className="font-serif text-4xl text-gold">T</span>
                </div>
                <p className="text-sand/40 text-sm tracking-widest uppercase">Premium Collection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section with Oversized Vertical Numeral */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-2">
            <p className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Browse by</p>
            <h2 className="font-serif text-4xl md:text-5xl text-forest">Categories</h2>
          </div>
          <Link href="/collections/all" className="text-sm text-forest hover:text-gold transition-colors flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.id} 
              href={`/collections/${category.slug}`}
              className="group relative bg-mist/50 aspect-[3/4] rounded-sm overflow-hidden flex flex-col justify-end p-8 transition-all hover:shadow-lg"
            >
              {/* Oversized category numeral */}
              <span className="absolute top-4 right-6 font-serif text-[8rem] leading-none font-bold text-forest/[0.06] select-none pointer-events-none transition-colors group-hover:text-gold/[0.12]" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              
              <div className="relative z-10">
                <h3 className="font-serif text-2xl text-forest group-hover:text-gold transition-colors">{category.name}</h3>
                <p className="text-charcoal/60 text-sm mt-1">{category._count.products} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-mist/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-2">
              <p className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Hand-picked</p>
              <h2 className="font-serif text-4xl md:text-5xl text-forest">Featured</h2>
            </div>
            <Link href="/collections/all" className="text-sm text-forest hover:text-gold transition-colors flex items-center gap-2">
              See More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Banner */}
      <section className="py-20 bg-forest text-sand">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="space-y-3">
              <Truck className="w-8 h-8 text-gold mx-auto" />
              <h3 className="font-serif text-xl">Nationwide Delivery</h3>
              <p className="text-sand/60 text-sm">Free shipping on orders above Rs 3,000 across Pakistan</p>
            </div>
            <div className="space-y-3">
              <Shield className="w-8 h-8 text-gold mx-auto" />
              <h3 className="font-serif text-xl">Quality Guarantee</h3>
              <p className="text-sand/60 text-sm">Authentic fabrics sourced from trusted mills</p>
            </div>
            <div className="space-y-3">
              <RotateCcw className="w-8 h-8 text-gold mx-auto" />
              <h3 className="font-serif text-xl">Easy Returns</h3>
              <p className="text-sand/60 text-sm">7-day hassle-free return policy on all items</p>
            </div>
            <div className="space-y-3">
              <Headphones className="w-8 h-8 text-gold mx-auto" />
              <h3 className="font-serif text-xl">WhatsApp Support</h3>
              <p className="text-sand/60 text-sm">Direct help from our team, in Urdu or English</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
