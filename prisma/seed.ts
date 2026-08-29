import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Setup Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@talalgarments.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'talal123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      email: adminEmail,
      name: 'Talal Owner',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('Admin user seeded.')

  // 2. Setup Categories
  const categoriesData = [
    { name: 'Kurta Shalwar', slug: 'kurta-shalwar', image: null },
    { name: 'Casual Shirts', slug: 'casual-shirts', image: null },
    { name: 'Formal Pants', slug: 'formal-pants', image: null },
    { name: 'Accessories', slug: 'accessories', image: null },
  ]

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Categories seeded.')

  // 3. Setup Products
  const categories = await prisma.category.findMany()
  const catMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id
    return acc
  }, {} as Record<string, string>)

  const productsData = [
    {
      name: 'Malmal Lawn Kurta Set',
      slug: 'malmal-lawn-kurta-set',
      description: 'Breathable malmal lawn kurta set perfect for summer.',
      price: 2800,
      categoryId: catMap['kurta-shalwar'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify([
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Powder Blue', hex: '#B0E0E6' },
        { name: 'Dusty Rose', hex: '#DCAE96' }
      ]),
      stock: 50,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Oxford Stripe Formal Shirt',
      slug: 'oxford-stripe-formal-shirt',
      description: 'Classic oxford stripe formal shirt for office wear.',
      price: 1950,
      categoryId: catMap['casual-shirts'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify([
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Charcoal', hex: '#36454F' }
      ]),
      stock: 40,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Khaddar Winter Kurta',
      slug: 'khaddar-winter-kurta',
      description: 'Warm and comfortable khaddar kurta for chilly evenings.',
      price: 3200,
      categoryId: catMap['kurta-shalwar'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify([
        { name: 'Camel', hex: '#C19A6B' },
        { name: 'Forest', hex: '#228B22' },
        { name: 'Rust', hex: '#b7410e' }
      ]),
      stock: 35,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Cotton Pique Polo',
      slug: 'cotton-pique-polo',
      description: 'Everyday cotton pique polo shirt.',
      price: 1400,
      categoryId: catMap['casual-shirts'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      colors: JSON.stringify([
        { name: 'Navy', hex: '#000080' },
        { name: 'Olive', hex: '#808000' },
        { name: 'Sand', hex: '#C2B280' }
      ]),
      stock: 60,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Linen Blend Trouser',
      slug: 'linen-blend-trouser',
      description: 'Lightweight linen blend trouser.',
      price: 2100,
      categoryId: catMap['formal-pants'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['28', '30', '32', '34', '36', '38', '40']),
      colors: JSON.stringify([
        { name: 'Charcoal', hex: '#36454F' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Stone', hex: '#877F6C' }
      ]),
      stock: 45,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Chikankari Lawn Kurta',
      slug: 'chikankari-lawn-kurta',
      description: 'Elegant chikankari lawn kurta with intricate details.',
      price: 4500,
      categoryId: catMap['kurta-shalwar'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
      colors: JSON.stringify([
        { name: 'Mint', hex: '#98FF98' },
        { name: 'Ivory', hex: '#FFFFF0' }
      ]),
      stock: 20,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Denim Slim Trouser',
      slug: 'denim-slim-trouser',
      description: 'Versatile slim fit denim trouser.',
      price: 2600,
      categoryId: catMap['formal-pants'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['28', '30', '32', '34', '36']),
      colors: JSON.stringify([
        { name: 'Indigo', hex: '#3F00FF' },
        { name: 'Black', hex: '#000000' }
      ]),
      stock: 55,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Classic Waistcoat',
      slug: 'classic-waistcoat',
      description: 'Timeless classic waistcoat for formal occasions.',
      price: 1800,
      categoryId: catMap['accessories'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify([
        { name: 'Charcoal', hex: '#36454F' },
        { name: 'Camel', hex: '#C19A6B' }
      ]),
      stock: 30,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Yarn-Dyed Chambray Shirt',
      slug: 'yarn-dyed-chambray-shirt',
      description: 'Soft yarn-dyed chambray shirt.',
      price: 2250,
      categoryId: catMap['casual-shirts'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify([
        { name: 'Sky Blue', hex: '#87CEEB' },
        { name: 'Rust', hex: '#b7410e' }
      ]),
      stock: 40,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Dhoti Shalwar',
      slug: 'dhoti-shalwar',
      description: 'Traditional dhoti shalwar for cultural events.',
      price: 1600,
      categoryId: catMap['kurta-shalwar'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify([
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Ivory', hex: '#FFFFF0' }
      ]),
      stock: 25,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Embroidered Nehru Collar Shirt',
      slug: 'embroidered-nehru-collar-shirt',
      description: 'Sophisticated embroidered Nehru collar shirt.',
      price: 3800,
      categoryId: catMap['casual-shirts'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify([
        { name: 'Bottle Green', hex: '#006A4E' },
        { name: 'Maroon', hex: '#800000' }
      ]),
      stock: 15,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Canvas Belt',
      slug: 'canvas-belt',
      description: 'Durable canvas belt.',
      price: 650,
      categoryId: catMap['accessories'],
      images: JSON.stringify([]),
      sizes: JSON.stringify(['One size']),
      colors: JSON.stringify([
        { name: 'Tan', hex: '#D2B48C' },
        { name: 'Black', hex: '#000000' }
      ]),
      stock: 100,
      isVisible: true,
      isFeatured: false,
    }
  ]

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    })
  }
  console.log('Products seeded.')

  // 4. Setup Promo Code
  await prisma.promoCode.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discount: 10,
      minOrder: 5000,
    },
  })
  console.log('Promo code seeded.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
