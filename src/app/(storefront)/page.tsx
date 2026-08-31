import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/storefront/ProductCard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Talal Garments | Since 1988 — Craftsmanship Through Generations',
  description:
    'Three generations of master tailors from Attock, delivering premium stitched & unstitched clothing for men and women nationwide across Pakistan.',
  openGraph: {
    title: 'Talal Garments | Since 1988',
    description: 'Premium Pakistani clothing — stitched & unstitched for men and women. Nationwide delivery. Cash on delivery.',
    images: ['https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=1200&q=80'],
  },
}

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
    take: 6,
  })

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ─── */}
      {/* Mobile: stacked image then text. Desktop: true split 50/50. */}
      <section aria-label="Hero" className="flex flex-col md:flex-row min-h-[100svh] md:h-[92vh]">

        {/* Image — full width on mobile, half on desktop */}
        <div className="relative w-full h-[60vw] min-h-[280px] md:h-auto md:flex-1 order-1 md:order-2">
          <Image
            src="https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=1400&q=85&auto=format&fit=crop"
            alt="A master tailor's hands at work — Talal Garments, since 1988"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
          />
          {/* subtle vignette at bottom on mobile so text doesn't clash if we layer */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ivory to-transparent md:hidden" />
        </div>

        {/* Text — below image on mobile, right-aligned on desktop */}
        <div className="order-2 md:order-1 md:flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-14 lg:px-20 py-10 md:py-0 bg-ivory">
          <div className="max-w-lg">
            <p className="text-[11px] tracking-[0.3em] uppercase text-accent font-semibold mb-5 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-accent" />
              Est. 1988 · Attock, Pakistan
            </p>

            <h1 className="font-serif text-[2.6rem] sm:text-5xl md:text-5xl lg:text-6xl leading-[1.08] text-primary mb-5">
              Craftsmanship<br />
              <em className="font-light not-italic text-muted">transferred through</em><br />
              generations.
            </h1>

            <p className="text-base text-muted leading-relaxed mb-8 max-w-sm">
              Three generations of master tailors. Premium stitched and unstitched clothing — for men and women — delivered to your door across Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/collections/all"
                className="inline-flex items-center gap-2.5 bg-primary text-white text-[11px] tracking-[0.15em] uppercase font-semibold px-7 h-12 hover:bg-accent transition-colors"
              >
                Shop All Collections
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/collections/womens-stitched"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-semibold h-12 px-5 border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Women's Wear
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <div className="bg-primary text-white overflow-x-auto">
        <div className="flex items-center divide-x divide-white/10 whitespace-nowrap min-w-max mx-auto">
          {[
            'Free delivery over Rs. 5,000',
            'Cash on Delivery available',
            '7-day hassle-free returns',
            '35+ years of master tailoring',
          ].map(text => (
            <span key={text} className="text-[11px] tracking-[0.12em] uppercase px-6 py-3 text-white/80">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ─── CATEGORIES ─── */}
      <section aria-label="Shop by Category" className="py-14 md:py-20 bg-ivory">
        <div className="px-5 sm:px-8 md:container md:mx-auto md:px-6">

          <div className="mb-8 md:mb-12">
            <p className="text-[10px] tracking-[0.25em] uppercase text-accent font-bold mb-2">The Collections</p>
            <h2 className="font-serif text-3xl md:text-4xl text-primary">Shop by Category</h2>
          </div>

          {/* Mobile: 2-column grid. Desktop: asymmetric 3-col */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">

            {/* Men's Stitched — tall on desktop */}
            <Link href="/collections/mens-stitched" className="group relative overflow-hidden bg-stone-900 col-span-1 aspect-[2/3]">
              <Image
                src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=80&auto=format&fit=crop"
                alt="Men's Stitched Collection"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover object-top opacity-75 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6">
                <h3 className="font-serif text-white text-xl md:text-2xl leading-tight mb-0.5">Men's<br />Stitched</h3>
                <span className="text-[10px] text-white/60 tracking-widest uppercase">Explore →</span>
              </div>
            </Link>

            {/* Men's Unstitched */}
            <Link href="/collections/mens-unstitched" className="group relative overflow-hidden bg-stone-900 col-span-1 aspect-[2/3]">
              <Image
                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&q=80&auto=format&fit=crop"
                alt="Men's Unstitched Fabric Collection"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover object-center opacity-75 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6">
                <h3 className="font-serif text-white text-xl md:text-2xl leading-tight mb-0.5">Men's<br />Unstitched</h3>
                <span className="text-[10px] text-white/60 tracking-widest uppercase">Explore →</span>
              </div>
            </Link>

            {/* Women's — spans 2 cols on mobile, 1 col on desktop */}
            <Link href="/collections/womens-stitched" className="group relative overflow-hidden bg-stone-900 col-span-2 md:col-span-1 aspect-[16/9] md:aspect-[2/3]">
              <Image
                src="https://images.unsplash.com/photo-1610419356163-fdfbe17cfbcf?w=700&q=80&auto=format&fit=crop"
                alt="Women's Collection"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-[center_20%] opacity-75 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6">
                <h3 className="font-serif text-white text-xl md:text-2xl leading-tight mb-0.5">Women's<br />Collection</h3>
                <span className="text-[10px] text-white/60 tracking-widest uppercase">Explore →</span>
              </div>
            </Link>

            {/* Caps — small card */}
            <Link href="/collections/caps-headwear" className="group relative overflow-hidden bg-stone-900 col-span-1 aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?w=500&q=80&auto=format&fit=crop"
                alt="Caps & Headwear"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-serif text-white text-lg leading-tight mb-0.5">Caps</h3>
                <span className="text-[10px] text-white/60 tracking-widest uppercase">Explore →</span>
              </div>
            </Link>

            {/* Western Wear — small card */}
            <Link href="/collections/western-wear" className="group relative overflow-hidden bg-stone-900 col-span-1 aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80&auto=format&fit=crop"
                alt="Western Wear"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-top opacity-75 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-serif text-white text-lg leading-tight mb-0.5">Western</h3>
                <span className="text-[10px] text-white/60 tracking-widest uppercase">Explore →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      {featuredProducts.length > 0 && (
        <section aria-label="Featured Products" className="py-14 md:py-20 bg-white">
          <div className="px-5 sm:px-8 md:container md:mx-auto md:px-6">
            <div className="flex items-end justify-between mb-8 md:mb-12">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-accent font-bold mb-2">Handpicked</p>
                <h2 className="font-serif text-3xl md:text-4xl text-primary">Featured Pieces</h2>
              </div>
              <Link
                href="/collections/all"
                className="text-[11px] tracking-[0.1em] uppercase font-semibold text-primary hover:text-accent flex items-center gap-1.5 transition-colors"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── HERITAGE STORY ─── */}
      {/* Asymmetric layout: image left, text right on desktop. Stacked on mobile. */}
      <section aria-label="Our Heritage" className="bg-[#1A1A1A] text-white">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full h-64 md:h-auto md:w-1/2 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=900&q=80&auto=format&fit=crop"
              alt="Inside the Talal Garments tailoring workshop"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1A1A] hidden md:block" />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center px-5 sm:px-8 md:px-16 lg:px-20 py-12 md:py-20 md:w-1/2">
            <p className="text-[10px] tracking-[0.3em] uppercase text-accent font-bold mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-accent" />
              Our Legacy
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] leading-snug mb-6">
              Three generations of master craftsmen — preserving the art of tailoring since 1988.
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
              What began as a single workshop in Attock has grown into a name trusted by families across Pakistan. We hand-pick every fabric, maintain old-school stitching standards, and ship directly from our workshop to your home.
            </p>
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-2 text-accent text-[11px] tracking-[0.15em] uppercase font-semibold hover:text-white transition-colors w-fit"
            >
              Discover Our Craft <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      {newArrivals.length > 0 && (
        <section aria-label="New Arrivals" className="py-14 md:py-20 bg-ivory">
          <div className="px-5 sm:px-8 md:container md:mx-auto md:px-6 mb-8 md:mb-12 flex items-end justify-between">
            <h2 className="font-serif text-3xl md:text-4xl text-primary">New Arrivals</h2>
            <Link
              href="/collections/all"
              className="text-[11px] tracking-[0.1em] uppercase font-semibold text-primary hover:text-accent flex items-center gap-1.5 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Horizontal scroll on mobile, 3-col grid on desktop */}
          <div className="md:hidden flex overflow-x-auto pb-4 gap-4 px-5 no-scrollbar snap-x snap-mandatory">
            {newArrivals.map(product => (
              <div key={product.id} className="w-[65vw] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="hidden md:grid md:container md:mx-auto md:px-6 grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ─── SOCIAL PROOF / MATERIAL QUALITY ─── */}
      {/* A content section that feels earned and specific — not generic 3-icon cards */}
      <section aria-label="Why choose us" className="py-14 md:py-20 bg-white border-t border-border">
        <div className="px-5 sm:px-8 md:container md:mx-auto md:px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-accent font-bold mb-4">Our Promise</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">
                Fabric you can feel. Stitches that last.
              </h2>
              <p className="text-muted text-base leading-relaxed mb-8">
                Every piece that leaves our workshop goes through the same quality check it did in 1988. We source from trusted Pakistani mills, cut each piece by hand, and use reinforced seams on every garment — because we know you'll be passing it down.
              </p>

              <ul className="space-y-5">
                {[
                  { title: 'Premium Mill Fabrics', desc: 'We source directly from certified fabric mills — lawn, cotton, wash & wear, and chiffon.' },
                  { title: 'Hand-cut, Hand-finished', desc: 'No shortcuts. Every garment is cut to spec and finished by a skilled tailor.' },
                  { title: 'Cash on Delivery, Nationwide', desc: 'Pay when your order arrives at your door. No prepayment required.' },
                  { title: '7-Day Exchange Policy', desc: 'Not the right fit? Unworn, unwashed items can be exchanged within 7 days.' },
                ].map(({ title, desc }) => (
                  <li key={title} className="flex gap-4">
                    <span className="mt-1 w-4 h-px bg-accent shrink-0 relative top-2" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-0.5">{title}</p>
                      <p className="text-sm text-muted">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image with an overlaid stat */}
            <div className="relative aspect-[4/5] hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop"
                alt="Quality fabric inspection at Talal Garments"
                fill
                sizes="50vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-sm p-6">
                <p className="font-serif text-white text-4xl font-bold">35+</p>
                <p className="text-white/70 text-sm mt-1">Years of unbroken craftsmanship tradition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section aria-label="Newsletter" className="bg-ivory border-t border-border py-12 md:py-16">
        <div className="px-5 sm:px-8 md:container md:mx-auto md:px-6 max-w-2xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-3">Stay in the loop</h2>
          <p className="text-muted text-sm mb-6">
            New collections, seasonal offers, and workshop news — directly to you.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 h-12 px-4 border border-border bg-white text-sm focus:outline-none focus:border-accent rounded-none"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-primary text-white text-[11px] tracking-[0.1em] uppercase font-semibold hover:bg-accent transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  )
}
