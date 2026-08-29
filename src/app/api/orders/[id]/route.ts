import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    })
    
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // @ts-ignore
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    
    const schema = z.object({
      status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional(),
      paymentStatus: z.enum(['pending', 'paid']).optional(),
    })
    
    const validatedData = schema.parse(body)
    
    const order = await prisma.order.update({
      where: { id },
      data: validatedData
    })
    
    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 400 })
  }
}
