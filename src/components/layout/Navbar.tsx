"use client"

import Link from 'next/link'
import { useCartStore } from '@/lib/cart'
import { useWishlistStore } from '@/lib/wishlist'
import { ShoppingBag, Heart, User, Menu, Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartCount = useCartStore(state => state.getCartCount())
  const wishlistCount = useWishlistStore(state => state.items.length)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-sand/90 backdrop-blur-md border-b border-charcoal/10" : "bg-sand"
      )}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 -ml-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6 text-forest" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex flex-col items-center justify-center -mt-2">
          <span className="font-serif text-3xl font-bold text-forest tracking-tight">TALAL</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-semibold">Garments</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="/collections/all" className="text-sm font-medium hover:text-gold transition-colors">NEW ARRIVALS</Link>
          <Link href="/collections/kurta-shalwar" className="text-sm font-medium hover:text-gold transition-colors">KURTA SHALWAR</Link>
          <Link href="/collections/casual-shirts" className="text-sm font-medium hover:text-gold transition-colors">SHIRTS</Link>
          <Link href="/collections/formal-pants" className="text-sm font-medium hover:text-gold transition-colors">BOTTOMS</Link>
          {session?.user.role === 'admin' && (
            <Link href="/admin" className="text-sm font-medium text-error hover:text-error/80 transition-colors">ADMIN</Link>
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          <button className="hidden lg:block text-forest hover:text-gold transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <Link href="/account" className="hidden lg:block text-forest hover:text-gold transition-colors">
            <User className="w-5 h-5" />
          </Link>
          
          <Link href="/wishlist" className="relative text-forest hover:text-gold transition-colors">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-forest text-[10px] font-bold flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <Link href="/cart" className="relative text-forest hover:text-gold transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-forest text-sand text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-sand flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-charcoal/10">
            <Link href="/" className="font-serif text-2xl font-bold text-forest">TALAL</Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-forest">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex flex-col p-6 space-y-6">
            <Link href="/collections/all" className="font-serif text-2xl text-forest">New Arrivals</Link>
            <Link href="/collections/kurta-shalwar" className="font-serif text-2xl text-forest">Kurta Shalwar</Link>
            <Link href="/collections/casual-shirts" className="font-serif text-2xl text-forest">Shirts</Link>
            <Link href="/collections/formal-pants" className="font-serif text-2xl text-forest">Bottoms</Link>
            <Link href="/collections/accessories" className="font-serif text-2xl text-forest">Accessories</Link>
            
            <div className="h-px bg-charcoal/10 my-4" />
            
            <Link href="/account" className="text-lg text-charcoal flex items-center space-x-3">
              <User className="w-5 h-5" />
              <span>Account</span>
            </Link>
            
            {session?.user.role === 'admin' && (
              <Link href="/admin" className="text-lg text-error flex items-center space-x-3">
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
