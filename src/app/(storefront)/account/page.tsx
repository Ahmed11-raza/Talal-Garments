import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/format'
import { LogoutButton } from './LogoutButton'

export default async function AccountPage() {
  const session = await auth()

  if (!session) {
    redirect('/account/login')
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } }
  })

  const myOrders = orders.filter(o => {
    try {
      const customer = JSON.parse(o.customer as string)
      return customer.email === session.user.email
    } catch {
      return false
    }
  })

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-primary">My Account</h1>
          <p className="text-muted">Welcome back, {session.user.name}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-8">
        <h2 className="font-serif text-2xl text-primary">Order History</h2>

        {myOrders.length === 0 ? (
          <div className="bg-ivory p-8 rounded-sm text-center">
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
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-primary">{item.product.name}</p>
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
