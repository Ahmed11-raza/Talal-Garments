import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  const userEmail = session?.user?.email || ''
  // @ts-ignore
  const userRole = session?.user?.role || ''
  const isAdmin = userRole === 'admin' || userEmail === 'admin@talalgarments.com'

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { categoryId, discountType, value, action } = await request.json()

    // Query targeted products
    const whereCondition: any = { isVisible: true }
    if (categoryId && categoryId !== 'all') {
      whereCondition.categoryId = categoryId
    }

    const products = await prisma.product.findMany({
      where: whereCondition
    })

    if (action === 'remove') {
      // Remove discounts by resetting comparePrice to null
      for (const product of products) {
        // If comparePrice exists, restore price to comparePrice
        const originalPrice = product.comparePrice || product.price
        await prisma.product.update({
          where: { id: product.id },
          data: {
            price: originalPrice,
            comparePrice: null
          }
        })
      }
      return NextResponse.json({ success: true, count: products.length, message: 'Discounts removed successfully' })
    }

    const val = parseFloat(value)
    if (isNaN(val) || val <= 0) {
      return NextResponse.json({ error: 'Invalid discount value' }, { status: 400 })
    }

    let updatedCount = 0

    for (const product of products) {
      // Current base price to discount from (use comparePrice if already set, otherwise current price)
      const basePrice = product.comparePrice || product.price
      let newPrice = basePrice

      if (discountType === 'percentage') {
        newPrice = Math.round(basePrice * (1 - val / 100))
      } else if (discountType === 'flat') {
        newPrice = Math.max(100, basePrice - val)
      }

      if (newPrice < basePrice) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            comparePrice: basePrice, // Store original price as comparePrice
            price: newPrice         // Discounted price
          }
        })
        updatedCount++
      }
    }

    return NextResponse.json({
      success: true,
      count: updatedCount,
      message: `Successfully applied ${discountType === 'percentage' ? val + '% OFF' : 'Flat Rs. ' + val + ' OFF'} to ${updatedCount} products!`
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to apply bulk discount' }, { status: 500 })
  }
}
