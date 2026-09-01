import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/format'
import { LogoutButton } from './LogoutButton'
import Link from 'next/link'
import { ShieldAlert, ArrowRight } from 'lucide-react'

export default async function AccountPage() {
  const session = await auth()

  if (!session) {
    redirect('/account/login')
  }

  const userEmail = session.user?.email || ''
  // @ts-ignore
  const userRole = session.user?.role || ''
  const isAdmin = userRole === 'admin' || userEmail === 'admin@talalgarments.com'

  let myOrders: any[] = []
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } }
    })

    myOrders = orders.filter(o => {
      try {
        const customer = JSON.parse(o.customer as string)
        return customer.email === session.user.email
      } catch {
        return false
      }
    })
  } catch (error) {
    myOrders = []
  }

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16 max-w-5xl">
      
      {/* Admin Access Banner if logged in user is admin */}
      {isAdmin && (
        <div className="mb-10 bg-primary text-white p-6 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-accent/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-full text-accent shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs">
                Admin Privileges Active
              </span>
              <h2 className="font-serif text-2xl font-bold mt-1">Admin Control Center</h2>
              <p className="text-xs text-white/70">
                You have store admin privileges. Access product management, orders, and sales graphics.
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors shrink-0 shadow-md"
          >
            Open Admin Panel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-primary">My Account</h1>
          <p className="text-muted">Welcome back, {session.user.name} ({session.user.email})</p>
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-8">
        <h2 className="font-serif text-2xl text-primary">Order History</h2>

        {myOrders.length === 0 ? (
          <div className="bg-ivory p-8 rounded-sm text-center border border-border">
            <p className="text-muted">You haven&apos;t placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map(order => (
              <div key={order.id} className="border border-border rounded-sm bg-white overflow-hidden">
                <div className="bg-ivory p-4 border-b border-border flex flex-wrap justify-between gap-4 text-sm">
                  <div>
                    <p className="text-muted">Order Number</p>
                    <p className="font-medium text-primary">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted">Date Placed</p>
                    <p className="font-medium text-primary">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted">Total Amount</p>
                    <p className="font-medium text-accent">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-muted">Status</p>
                    <span className="text-xs font-medium uppercase tracking-wider bg-accent/20 text-accent px-2 py-0.5 rounded-sm inline-block mt-0.5">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-primary">{item.product?.name || 'Product'}</p>
                        <p className="text-sm text-muted">{item.color} · {item.size} · Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-primary">{formatPrice(item.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
