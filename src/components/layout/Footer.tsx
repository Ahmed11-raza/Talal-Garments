import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: "Men's Stitched", href: '/collections/mens-stitched' },
    { label: "Men's Unstitched", href: '/collections/mens-unstitched' },
    { label: "Women's Stitched", href: '/collections/womens-stitched' },
    { label: "Women's Unstitched", href: '/collections/womens-unstitched' },
    { label: 'Caps & Headwear', href: '/collections/caps-headwear' },
    { label: 'Western Wear', href: '/collections/western-wear' },
  ],
  help: [
    { label: 'Track Order', href: '/account' },
    { label: 'Shipping Policy', href: '#' },
    { label: 'Returns & Exchange', href: '#' },
    { label: 'Size Guide', href: '#' },
    { label: 'FAQs', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4">
        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand column */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="font-serif text-3xl font-bold text-white">TALAL</h2>
              <p className="text-[10px] tracking-[0.35em] uppercase text-white/50 -mt-0.5">Garments</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Three generations of master tailors since 1988. From our workshop in Attock to doorsteps
              across Pakistan — quality craftsmanship that stands the test of time.
            </p>
            <div className="flex items-center gap-2 text-accent text-xs tracking-[0.15em] uppercase font-medium">
              <span className="w-8 h-px bg-accent" />
              Est. 1988
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold mb-6 text-white">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold mb-6 text-white">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-semibold mb-6 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-white/60">Main Bazar, Attock City, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href="tel:+923001234567" className="text-sm text-white/60 hover:text-accent transition-colors">
                  +92 300 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href="mailto:info@talalgarments.com" className="text-sm text-white/60 hover:text-accent transition-colors">
                  info@talalgarments.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Talal Garments. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <span>Cash on Delivery</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Nationwide Delivery</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>7-Day Returns</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
