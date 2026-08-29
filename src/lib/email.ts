import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || 'dummy',
    pass: process.env.SMTP_PASS || 'dummy',
  },
})

interface OrderNotification {
  orderNumber: string
  customerName: string
  customerPhone: string
  total: number
  items: Array<{ name: string; size: string; color: string; quantity: number }>
}

export async function sendOrderNotification(order: OrderNotification) {
  if (process.env.SMTP_USER === 'dummy') {
    console.warn('Dummy SMTP credentials found. Skipping actual email send.')
    console.log('Would have sent:', order)
    return
  }

  const itemsHtml = order.items.map(item => 
    `<li>${item.quantity}x ${item.name} (${item.color}, ${item.size})</li>`
  ).join('')

  const html = `
    <h2>New COD Order: ${order.orderNumber}</h2>
    <p><strong>Customer:</strong> ${order.customerName}</p>
    <p><strong>Phone:</strong> ${order.customerPhone}</p>
    <p><strong>Total:</strong> Rs ${order.total.toLocaleString()}</p>
    <br/>
    <h3>Items:</h3>
    <ul>
      ${itemsHtml}
    </ul>
    <br/>
    <p><a href="${process.env.NEXTAUTH_URL}/admin/orders/${order.orderNumber}">View in Admin Panel</a></p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'orders@talalgarments.com',
    to: process.env.ADMIN_EMAIL,
    subject: `New Order 🚨 ${order.orderNumber} - Rs ${order.total.toLocaleString()}`,
    html,
  })
}
