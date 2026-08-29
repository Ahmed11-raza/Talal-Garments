import prisma from '@/lib/prisma'

export default async function AdminCustomers() {
  const customers = await prisma.user.findMany({
    where: { role: 'customer' },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-forest">Customers</h1>
        <p className="text-charcoal/70">Registered store customers.</p>
      </div>

      <div className="border border-charcoal/10 rounded-sm overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-mist text-forest uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="border-t border-charcoal/10 hover:bg-mist/30">
                <td className="px-6 py-4 font-medium text-forest">{customer.name}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4">{new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-charcoal/50">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
