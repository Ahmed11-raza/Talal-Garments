import Link from 'next/link'
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-forest text-sand py-16 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-3xl font-bold text-sand tracking-tight">TALAL</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-semibold">Garments</span>
            </Link>
            <p className="text-sand/70 text-sm leading-relaxed max-w-xs">
              Premium clothing blending traditional craftsmanship with contemporary design.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-sand/20 flex items-center justify-center hover:bg-gold hover:text-forest hover:border-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-sand/20 flex items-center justify-center hover:bg-gold hover:text-forest hover:border-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h4 className="font-serif text-xl text-gold">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/collections/all" className="text-sand/70 hover:text-sand text-sm transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/kurta-shalwar" className="text-sand/70 hover:text-sand text-sm transition-colors">Kurta Shalwar</Link></li>
              <li><Link href="/collections/casual-shirts" className="text-sand/70 hover:text-sand text-sm transition-colors">Shirts & Polos</Link></li>
              <li><Link href="/collections/formal-pants" className="text-sand/70 hover:text-sand text-sm transition-colors">Bottoms</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="font-serif text-xl text-gold">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-sand/70 hover:text-sand text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-sand/70 hover:text-sand text-sm transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="text-sand/70 hover:text-sand text-sm transition-colors">Size Guide</Link></li>
              <li><Link href="/track-order" className="text-sand/70 hover:text-sand text-sm transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-serif text-xl text-gold">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-sand/70">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>Main Bazaar, Attock City,<br />Punjab, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-sand/70">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-sand/70">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <span>support@talalgarments.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-sand/10 flex flex-col md:flex-row items-center justify-between text-xs text-sand/50">
          <p>© {new Date().getFullYear()} Talal Garments. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-sand transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-sand transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
