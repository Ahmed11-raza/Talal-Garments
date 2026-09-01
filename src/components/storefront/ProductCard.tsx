import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number | null
    stock?: number
    images: string
    category?: { name: string } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  // Safe JSON parsing
  let images: string[] = []
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || [])
  } catch {
    images = []
  }
  
  const primaryImage = images?.[0] || 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&q=80'

  // Calculate discount percentage
  let discountPercent = 0
  if (product.comparePrice && product.comparePrice > product.price) {
    discountPercent = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
  }

  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 8

  return (
    <Link href={`/product/${product.slug}`} className="group block w-full space-y-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory rounded-sm img-hover-zoom">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-error text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {isLowStock && (
            <span className="bg-accent text-white text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-xs shadow-sm animate-pulse">
              Only {product.stock} Left!
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 px-0.5">
        {product.category && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-medium">
            {product.category.name}
          </p>
        )}
        <h3 className="font-serif text-base md:text-lg leading-tight text-primary group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 text-sm pt-0.5">
          <span className="font-semibold text-accent">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-muted line-through text-xs font-normal">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
