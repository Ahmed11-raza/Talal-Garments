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
    const { targetType, targetId, discountType, value, campaignName, action } = await request.json()

    // Determine target products
    let whereCondition: any = { isVisible: true }
    
    if (targetType === 'product' && targetId) {
      whereCondition = { id: targetId }
    } else if (targetType === 'category' && targetId && targetId !== 'all') {
      whereCondition = { categoryId: targetId }
    }

    const products = await prisma.product.findMany({
      where: whereCondition
    })

    if (products.length === 0) {
      return NextResponse.json({ error: 'No matching products found to update' }, { status: 404 })
    }

    // Action: REMOVE / RESET DISCOUNT
    if (action === 'remove') {
      for (const product of products) {
        const originalPrice = product.comparePrice || product.price
        await prisma.product.update({
          where: { id: product.id },
          data: {
            price: originalPrice,
            comparePrice: null
          }
        })
      }
      return NextResponse.json({
        success: true,
        count: products.length,
        message: `Discounts removed and original prices restored for ${products.length} item(s).`
      })
    }

    // Action: APPLY DISCOUNT
    const val = parseFloat(value)
    if (isNaN(val) || val <= 0) {
      return NextResponse.json({ error: 'Please enter a valid discount amount or percentage greater than 0' }, { status: 400 })
    }

    if (discountType === 'percentage' && val >= 100) {
      return NextResponse.json({ error: 'Percentage discount must be less than 100%' }, { status: 400 })
    }

    let updatedCount = 0

    for (const product of products) {
      // Use comparePrice if already set (to prevent compounding discounts), otherwise current price
      const basePrice = product.comparePrice || product.price
      let newPrice = basePrice

      if (discountType === 'percentage') {
        newPrice = Math.round(basePrice * (1 - val / 100))
      } else if (discountType === 'flat') {
        newPrice = Math.max(100, Math.round(basePrice - val))
      }

      if (newPrice < basePrice) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            comparePrice: basePrice, // Original price
            price: newPrice         // Discounted sale price
          }
        })
        updatedCount++
      }
    }

    const discountSummary = discountType === 'percentage' ? `${val}% OFF` : `Flat Rs. ${val} OFF`
    const title = campaignName ? `"${campaignName}" (${discountSummary})` : discountSummary

    return NextResponse.json({
      success: true,
      count: updatedCount,
      message: `Successfully applied ${title} to ${updatedCount} item(s)!`
    })
  } catch (error: any) {
    console.error("Discount API error:", error)
    return NextResponse.json({ error: error.message || 'Failed to update discounts' }, { status: 500 })
  }
}
