import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { productSchema } from '@/lib/validations'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')
  const isFeatured = searchParams.get('isFeatured')
  const search = searchParams.get('search')
  
  const where: any = { isVisible: true }
  
  if (categoryId) where.categoryId = categoryId
  if (isFeatured === 'true') where.isFeatured = true
  if (search) {
    where.name = { contains: search } // Simple search
  }
  
  try {
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  // @ts-ignore
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = productSchema.parse(body)
    
    // SQLite requires JSON stringification of string arrays/objects
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        images: JSON.stringify(validatedData.images),
        sizes: JSON.stringify(validatedData.sizes),
        colors: JSON.stringify(validatedData.colors)
      }
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 400 })
  }
}
