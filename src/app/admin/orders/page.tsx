import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { formatPrice } from '@/lib/format'

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-forest">Orders</h1>
        <p className="text-charcoal/70">Manage and fulfill customer orders.</p>
      </div>

      <div className="border border-charcoal/10 rounded-sm overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-mist text-forest uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Order #</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const customer = JSON.parse(order.customer as string)
              return (
                <tr key={order.id} className="border-t border-charcoal/10 hover:bg-mist/30">
                  <td className="px-6 py-4 font-medium text-forest">{order.orderNumber}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span>{customer.name}</span>
                      <span className="text-xs text-charcoal/50">{customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gold/20 text-forest rounded-sm text-xs font-medium uppercase">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 uppercase text-xs font-medium text-charcoal/70">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 font-medium text-forest">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-forest hover:bg-forest hover:text-sand transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
