import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/format'
import { ArrowRight, Truck, Shield, RefreshCw, Scissors, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/storefront/ProductCard'
import { NewsletterForm } from '@/components/storefront/NewsletterForm'

export const dynamic = 'force-dynamic'

export default async function StorefrontPage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, isVisible: true },
    include: { category: true },
    take: 4,
  })

  const newArrivals = await prisma.product.findMany({
    where: { isVisible: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section - Performance First Split Layout */}
      <section className="relative w-full min-h-[85vh] flex flex-col md:flex-row bg-ivory">
        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 z-10">
          <div className="max-w-xl animate-fade-up">
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs tracking-[0.25em] uppercase font-semibold text-accent">Est. 1988</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-primary mb-6">
              Craftsmanship <br className="hidden md:block" />
              <span className="italic font-light">transferred through</span> <br className="hidden md:block" />
              generations.
            </h1>
            <p className="text-muted text-lg mb-10 max-w-md">
              Three generations of master tailors. Premium stitched and unstitched clothing delivered nationwide across Pakistan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary text-white hover:bg-accent hover:text-white rounded-none px-8 h-14 text-xs tracking-[0.15em] uppercase font-semibold">
                <Link href="/collections/all">Shop Collection</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-none px-8 h-14 text-xs tracking-[0.15em] uppercase font-semibold">
                <Link href="/collections/mens-stitched">Men's Wear</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hero Image - Optimized */}
        <div className="flex-1 relative min-h-[50vh] md:min-h-full">
          <Image
            src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1600&auto=format&fit=crop"
            alt="Premium menswear tailoring"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[center_30%]"
          />
        </div>
      </section>

      {/* 2. Trust Strip */}
      <section className="border-y border-border bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-border">
            <div className="flex flex-col items-center gap-3 px-4">
              <Truck className="w-5 h-5 text-accent" />
              <h3 className="text-xs tracking-[0.1em] uppercase font-bold text-primary">Nationwide Delivery</h3>
              <p className="text-xs text-muted">Free over Rs. 5,000</p>
            </div>
            <div className="flex flex-col items-center gap-3 px-4">
              <Shield className="w-5 h-5 text-accent" />
              <h3 className="text-xs tracking-[0.1em] uppercase font-bold text-primary">Cash on Delivery</h3>
              <p className="text-xs text-muted">Pay at your doorstep</p>
            </div>
            <div className="flex flex-col items-center gap-3 px-4">
              <RefreshCw className="w-5 h-5 text-accent" />
              <h3 className="text-xs tracking-[0.1em] uppercase font-bold text-primary">7-Day Returns</h3>
              <p className="text-xs text-muted">Hassle-free exchange</p>
            </div>
            <div className="flex flex-col items-center gap-3 px-4">
              <Scissors className="w-5 h-5 text-accent" />
              <h3 className="text-xs tracking-[0.1em] uppercase font-bold text-primary">Master Tailoring</h3>
              <p className="text-xs text-muted">35+ years of trust</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent text-xs tracking-[0.2em] uppercase font-bold mb-4 block">The Collections</span>
            <h2 className="font-serif text-4xl text-primary">Shop by Category</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Men's Stitched */}
            <Link href="/collections/mens-stitched" className="group relative aspect-[4/5] overflow-hidden bg-black rounded-sm">
              <Image src="https://images.unsplash.com/photo-1594938298596-70f594f742f8?q=80&w=800&auto=format&fit=crop" alt="Men's Stitched" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white font-serif text-3xl mb-2">Men's Stitched</h3>
                <span className="text-white/80 text-sm tracking-wider uppercase flex items-center gap-2 group-hover:text-accent transition-colors">
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Men's Unstitched */}
            <Link href="/collections/mens-unstitched" className="group relative aspect-[4/5] overflow-hidden bg-black rounded-sm">
              <Image src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop" alt="Men's Unstitched" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white font-serif text-3xl mb-2">Men's Unstitched</h3>
                <span className="text-white/80 text-sm tracking-wider uppercase flex items-center gap-2 group-hover:text-accent transition-colors">
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Women's Collection */}
            <Link href="/collections/womens-stitched" className="group relative aspect-[4/5] overflow-hidden bg-black rounded-sm lg:col-span-1 md:col-span-2">
              <Image src="https://images.unsplash.com/photo-1610419356163-fdfbe17cfbcf?q=80&w=800&auto=format&fit=crop" alt="Women's Collection" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white font-serif text-3xl mb-2">Women's Collection</h3>
                <span className="text-white/80 text-sm tracking-wider uppercase flex items-center gap-2 group-hover:text-accent transition-colors">
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-accent text-xs tracking-[0.2em] uppercase font-bold mb-4 block">Handpicked for You</span>
                <h2 className="font-serif text-4xl text-primary">Featured Pieces</h2>
              </div>
              <Link href="/collections/all" className="text-xs tracking-[0.1em] uppercase font-bold text-primary hover:text-accent flex items-center gap-2 transition-colors pb-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Heritage Story */}
      <section className="relative py-32 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1626497764746-6dc36546b388?q=80&w=1600&auto=format&fit=crop"
            alt="Tailoring workshop"
            fill
            className="object-cover grayscale"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-accent text-xs tracking-[0.2em] uppercase font-bold mb-6 block">Our Legacy</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
            Three generations of master craftsmen, preserving the art of tailoring since 1988.
          </h2>
          <p className="text-white/70 text-lg mb-10">
            What started as a small tailoring shop in Attock has grown into a nationwide brand. 
            We source the finest fabrics and apply decades of expertise to every stitch, ensuring 
            garments that stand the test of time.
          </p>
          <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white rounded-none px-8 h-12 text-xs tracking-[0.15em] uppercase font-semibold bg-transparent">
            <Link href="/collections/all">Discover Our Craft</Link>
          </Button>
        </div>
      </section>

      {/* 6. New Arrivals (Horizontal Scroll) */}
      {newArrivals.length > 0 && (
        <section className="py-24 bg-ivory overflow-hidden">
          <div className="container mx-auto px-4 mb-12">
            <h2 className="font-serif text-4xl text-primary">New Arrivals</h2>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto pb-8 gap-6 no-scrollbar snap-x">
              {newArrivals.map(product => (
                <div key={product.id} className="w-[280px] md:w-[320px] shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Customer Promise */}
      <section className="py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent text-xs tracking-[0.2em] uppercase font-bold mb-4 block">Our Promise</span>
            <h2 className="font-serif text-4xl text-primary">Why Talal Garments</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-col items-center text-center gap-4">
              <Award className="w-7 h-7 text-accent" />
              <h3 className="text-sm tracking-[0.1em] uppercase font-bold text-primary">Quality Fabrics</h3>
              <p className="text-sm text-muted leading-relaxed">
                Sourced from trusted mills, every fabric is chosen for durability, comfort, and finish.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <Scissors className="w-7 h-7 text-accent" />
              <h3 className="text-sm tracking-[0.1em] uppercase font-bold text-primary">Master Tailoring</h3>
              <p className="text-sm text-muted leading-relaxed">
                Three generations of hands-on craftsmanship behind every stitch, seam, and cut.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <Truck className="w-7 h-7 text-accent" />
              <h3 className="text-sm tracking-[0.1em] uppercase font-bold text-primary">Nationwide Delivery</h3>
              <p className="text-sm text-muted leading-relaxed">
                From Attock to every corner of Pakistan, with cash on delivery available everywhere.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <RefreshCw className="w-7 h-7 text-accent" />
              <h3 className="text-sm tracking-[0.1em] uppercase font-bold text-primary">Easy Returns</h3>
              <p className="text-sm text-muted leading-relaxed">
                Not satisfied? Unworn, unwashed items can be returned or exchanged within 7 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter CTA */}
      <section className="py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="font-serif text-3xl mb-4 text-primary">Join the Talal Family</h2>
          <p className="text-muted mb-8">
            Subscribe to receive updates on new collections, exclusive offers, and the latest from our workshop.
          </p>
          <NewsletterForm />
        </div>
      </section>

    </div>
  )
}
