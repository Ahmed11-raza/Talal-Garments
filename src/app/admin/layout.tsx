import { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect('/account/login?callbackUrl=/admin')
  }

  const userEmail = session.user?.email || ''
  // @ts-ignore
  const userRole = session.user?.role || ''

  const isAdmin = userRole === 'admin' || userEmail === 'admin@talalgarments.com'

  if (!isAdmin) {
    redirect('/account')
  }

  return (
    <div className="flex min-h-screen bg-ivory/50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex-shrink-0 fixed h-full flex flex-col z-30 shadow-lg">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight">TALAL</span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-accent font-bold">Admin Control Center</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-white/10 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-accent" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-white/10 transition-colors">
            <Package className="w-5 h-5 text-accent" />
            <span className="font-medium text-sm">Products & Discounts</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-white/10 transition-colors">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <span className="font-medium text-sm">Orders</span>
          </Link>
          <Link href="/admin/customers" className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-white/10 transition-colors">
            <Users className="w-5 h-5 text-accent" />
            <span className="font-medium text-sm">Customers</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-accent" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 mt-auto border-t border-white/10">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
