"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ShoppingBag, Heart, User, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/lib/cart'
import { useSession } from 'next-auth/react'

const navLinks = [
  { label: "Men's Stitched", href: '/collections/mens-stitched' },
  { label: "Men's Unstitched", href: '/collections/mens-unstitched' },
  { label: "Women's Stitched", href: '/collections/womens-stitched' },
  { label: "Women's Unstitched", href: '/collections/womens-unstitched' },
  { label: 'Caps', href: '/collections/caps-headwear' },
  { label: 'Western', href: '/collections/western-wear' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = useCartStore(s => s.items)
  const { data: session } = useSession()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-white text-center py-2 text-xs tracking-[0.15em] uppercase font-medium">
        Free Delivery on Orders Over Rs. 5,000 · Since 1988
      </div>

      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-2"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center leading-none">
            <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-primary">
              TALAL
            </span>
            <span className="text-[9px] lg:text-[10px] tracking-[0.35em] uppercase text-muted font-medium -mt-0.5">
              Garments
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-xs tracking-[0.1em] uppercase font-medium transition-colors hover:text-accent ${
                    pathname === link.href ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <Link href="/collections/all" aria-label="Search" className="p-2 hover:text-accent transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="p-2 hover:text-accent transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href={session ? '/account' : '/account/login'}
              aria-label="Account"
              className="p-2 hover:text-accent transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" aria-label="Cart" className="p-2 hover:text-accent transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="container mx-auto px-4 py-6">
            <ul className="space-y-4">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm tracking-[0.1em] uppercase font-medium py-2 transition-colors hover:text-accent ${
                      pathname === link.href ? 'text-accent' : 'text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-border">
                <Link
                  href="/collections/all"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm tracking-[0.1em] uppercase font-medium py-2 text-accent"
                >
                  Shop All
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
