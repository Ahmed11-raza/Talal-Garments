import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/format'

export default async function AdminDashboard() {
  const [productCount, orderCount, customerCount, totalRevenueResult] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.order.aggregate({
      where: { status: { not: 'cancelled' } },
      _sum: { total: true }
    })
  ])
  
  const totalRevenue = totalRevenueResult._sum.total || 0
  
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-forest">Dashboard</h1>
        <p className="text-charcoal/70">Store overview and recent activity.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-sans text-charcoal/70">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-sans text-charcoal/70">Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest">{orderCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-sans text-charcoal/70">Products</CardTitle>
            <Package className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest">{productCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-sans text-charcoal/70">Customers</CardTitle>
            <Users className="w-4 h-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest">{customerCount}</div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-serif font-bold text-forest mb-4">Recent Orders</h2>
        <div className="border border-charcoal/10 rounded-sm overflow-hidden bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-mist text-forest uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => {
                const customer = JSON.parse(order.customer as string)
                return (
                  <tr key={order.id} className="border-t border-charcoal/10">
                    <td className="px-6 py-4 font-medium text-forest">{order.orderNumber}</td>
                    <td className="px-6 py-4">{customer.name}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gold/20 text-forest rounded-sm text-xs font-medium uppercase">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
