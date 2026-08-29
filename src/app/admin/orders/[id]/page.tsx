import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { OrderStatusForm } from './OrderStatusForm'
import { formatPrice } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  })

  if (!order) notFound()

  const customer = JSON.parse(order.customer as string)
  const address = JSON.parse(order.address as string)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-forest">Order {order.orderNumber}</h1>
        <p className="text-charcoal/70">Placed on {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-4 border-b border-charcoal/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium text-forest">{item.product.name}</p>
                      <p className="text-sm text-charcoal/60">
                        {item.color} · {item.size}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price)}</p>
                      <p className="text-sm text-charcoal/60">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-charcoal/10 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Total</span>
                  <span className="font-medium text-lg text-forest">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusForm orderId={order.id} initialStatus={order.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-forest">Contact</p>
                <p className="text-charcoal/70">{customer.name}</p>
                <p className="text-charcoal/70">{customer.phone}</p>
                {customer.email && <p className="text-charcoal/70">{customer.email}</p>}
              </div>
              <div>
                <p className="font-medium text-forest">Shipping Address</p>
                <p className="text-charcoal/70">{address.street}</p>
                <p className="text-charcoal/70">{address.city}, {address.province}</p>
                {address.postalCode && <p className="text-charcoal/70">{address.postalCode}</p>}
              </div>
              <div>
                <p className="font-medium text-forest">Payment Method</p>
                <p className="text-charcoal/70 uppercase">{order.paymentMethod}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
