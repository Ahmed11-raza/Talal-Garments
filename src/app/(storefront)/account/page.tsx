import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/format'
import { LogOut } from 'lucide-react'
import { LogoutButton } from './LogoutButton'

export default async function AccountPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/account/login')
  }

  // Find orders where customer email matches
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } }
  })
  
  // Filter manually because customer is stored as JSON string in SQLite
  // When using Postgres, this would be a proper JSON query
  const myOrders = orders.filter(o => {
    try {
      const customer = JSON.parse(o.customer as string)
      return customer.email === session.user.email
    } catch {
      return false
    }
  })

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-forest">My Account</h1>
          <p className="text-charcoal/60">Welcome back, {session.user.name}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-8">
        <h2 className="font-serif text-2xl text-forest">Order History</h2>
        
        {myOrders.length === 0 ? (
          <div className="bg-mist p-8 rounded-sm text-center">
            <p className="text-charcoal/60">You haven&apos;t placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map(order => (
              <div key={order.id} className="border border-charcoal/10 rounded-sm bg-white overflow-hidden">
                <div className="bg-mist p-4 border-b border-charcoal/10 flex flex-wrap justify-between gap-4 text-sm">
                  <div>
                    <p className="text-charcoal/50">Order Number</p>
                    <p className="font-medium text-forest">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/50">Date Placed</p>
                    <p className="font-medium text-forest">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/50">Total Amount</p>
                    <p className="font-medium text-forest">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/50">Status</p>
                    <p className="font-medium text-forest uppercase tracking-wider text-xs bg-gold/20 px-2 py-0.5 rounded-sm inline-block mt-0.5">
                      {order.status}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-forest">{item.product.name}</p>
                        <p className="text-sm text-charcoal/60">
                          {item.color} · {item.size} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-forest">{formatPrice(item.price)}</p>
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
