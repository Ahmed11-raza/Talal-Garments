import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { CATEGORIES_DATA, ALL_PRODUCTS_CATALOG } from '@/lib/products-data'

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
    // 1. Upsert Categories
    for (const cat of CATEGORIES_DATA) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, image: cat.image },
        create: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          image: cat.image
        }
      })
    }

    // 2. Fetch categories to get IDs
    const dbCategories = await prisma.category.findMany()
    const catMap = dbCategories.reduce((acc: any, c: any) => {
      acc[c.slug] = c.id
      return acc
    }, {})

    // 3. Upsert All Products
    for (const prod of ALL_PRODUCTS_CATALOG) {
      const categoryId = catMap[prod.category.slug] || prod.categoryId

      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          comparePrice: prod.comparePrice,
          stock: prod.stock,
          images: prod.images,
          sizes: prod.sizes,
          colors: prod.colors,
          isVisible: prod.isVisible,
          isFeatured: prod.isFeatured,
          categoryId: categoryId
        },
        create: {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          comparePrice: prod.comparePrice,
          stock: prod.stock,
          images: prod.images,
          sizes: prod.sizes,
          colors: prod.colors,
          isVisible: prod.isVisible,
          isFeatured: prod.isFeatured,
          categoryId: categoryId
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${ALL_PRODUCTS_CATALOG.length} products across 6 categories into database!`
    })
  } catch (error: any) {
    console.error("Admin seed error:", error)
    return NextResponse.json({ error: error.message || 'Failed to seed database' }, { status: 500 })
  }
}
