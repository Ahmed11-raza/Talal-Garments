import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkoutSchema } from '@/lib/validations'
import { auth } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/format'
import { sendOrderNotification } from '@/lib/email'

export async function GET(request: Request) {
  const session = await auth()
  // @ts-ignore
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)
    
    // 1. Calculate totals and check stock
    let subtotal = 0
    const itemsData = []
    
    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`)
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} available.`)
      }
      
      subtotal += product.price * item.quantity
      itemsData.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })
    }
    
    let discount = 0 // Promo code logic would go here
    const shippingFee = subtotal > parseInt(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '3000') ? 0 : parseInt(process.env.NEXT_PUBLIC_STANDARD_SHIPPING || '250')
    const total = subtotal + shippingFee - discount
    
    const orderNumber = generateOrderNumber()
    
    // 2. Transaction: Create Order & Decrement Stock
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          orderNumber,
          customer: JSON.stringify(validatedData.customer),
          address: JSON.stringify(validatedData.address),
          subtotal,
          shippingFee,
          discount,
          total,
          paymentMethod: validatedData.paymentMethod,
          items: {
            create: itemsData
          }
        },
        include: { items: true }
      }),
      // Decrement stock for all items
      ...validatedData.items.map(item => 
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      )
    ])
    
    // 3. Send email notification (non-blocking)
    sendOrderNotification({
      orderNumber: order.orderNumber,
      customerName: validatedData.customer.name,
      customerPhone: validatedData.customer.phone,
      total: order.total,
      items: itemsData
    }).catch(err => console.error('Failed to send order email', err))
    
    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 400 })
  }
}
