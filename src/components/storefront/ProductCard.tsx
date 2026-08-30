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
    images: string
    category?: { name: string } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  // SQLite returns stringified JSON, parse it safely
  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
  const primaryImage = images?.[0] || '/placeholder.png'

  return (
    <Link href={`/product/${product.slug}`} className="group block w-full space-y-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory rounded-sm img-hover-zoom">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center"
          loading="lazy"
        />
        {product.comparePrice && product.comparePrice > product.price && (
          <div className="absolute top-2 left-2 bg-accent text-white text-[10px] uppercase tracking-wider px-2 py-1 font-medium z-10">
            Sale
          </div>
        )}
      </div>

      <div className="space-y-1.5 px-1">
        {product.category && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-medium">
            {product.category.name}
          </p>
        )}
        <h3 className="font-serif text-lg leading-tight text-primary group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-accent">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-muted line-through text-xs">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
