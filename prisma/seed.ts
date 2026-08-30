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
    { name: "Men's Stitched", slug: 'mens-stitched', image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&q=80' },
    { name: "Men's Unstitched", slug: 'mens-unstitched', image: 'https://images.unsplash.com/photo-1605908502724-9060628a1dc5?w=800&q=80' },
    { name: "Women's Stitched", slug: 'womens-stitched', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80' },
    { name: "Women's Unstitched", slug: 'womens-unstitched', image: 'https://images.unsplash.com/photo-1594938298596-70f56fb3cebc?w=800&q=80' },
    { name: 'Caps & Headwear', slug: 'caps-headwear', image: 'https://images.unsplash.com/photo-1521369909029-2afed882ba54?w=800&q=80' },
    { name: 'Western Wear', slug: 'western-wear', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
  ]

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, image: cat.image },
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
    // Men's Stitched
    {
      name: 'Classic White Shalwar Kameez',
      slug: 'classic-white-shalwar-kameez',
      description: 'A timeless classic white shalwar kameez for everyday wear.',
      price: 3500,
      categoryId: catMap['mens-stitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1550614000-4b95d466f200?w=800&q=80']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify([{ name: 'White', hex: '#FFFFFF' }]),
      stock: 50,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Charcoal Grey Kurta Set',
      slug: 'charcoal-grey-kurta-set',
      description: 'Sophisticated charcoal grey kurta with matching trouser.',
      price: 4200,
      categoryId: catMap['mens-stitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80']),
      sizes: JSON.stringify(['M', 'L', 'XL']),
      colors: JSON.stringify([{ name: 'Charcoal', hex: '#36454F' }]),
      stock: 30,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Embroidered Waistcoat',
      slug: 'embroidered-waistcoat',
      description: 'Premium embroidered waistcoat for formal events and weddings.',
      price: 5500,
      categoryId: catMap['mens-stitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&q=80']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify([{ name: 'Navy', hex: '#000080' }, { name: 'Black', hex: '#000000' }]),
      stock: 25,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Cotton Blend Shalwar Kameez',
      slug: 'cotton-blend-shalwar-kameez',
      description: 'Comfortable and durable cotton blend fabric suit.',
      price: 3800,
      categoryId: catMap['mens-stitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1605908502724-9060628a1dc5?w=800&q=80']),
      sizes: JSON.stringify(['M', 'L', 'XL']),
      colors: JSON.stringify([{ name: 'Beige', hex: '#F5F5DC' }]),
      stock: 40,
      isVisible: true,
      isFeatured: false,
    },
    
    // Men's Unstitched
    {
      name: 'Premium Wash & Wear Suit',
      slug: 'premium-wash-and-wear-suit',
      description: 'High quality wash and wear unstitched fabric (4.5 meters).',
      price: 2800,
      categoryId: catMap['mens-unstitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80']),
      sizes: JSON.stringify(['Unstitched']),
      colors: JSON.stringify([{ name: 'Navy Blue', hex: '#000080' }, { name: 'Black', hex: '#000000' }]),
      stock: 100,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Egyptian Cotton Unstitched Fabric',
      slug: 'egyptian-cotton-unstitched',
      description: 'Luxurious Egyptian cotton fabric for summer heat.',
      price: 3500,
      categoryId: catMap['mens-unstitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80']),
      sizes: JSON.stringify(['Unstitched']),
      colors: JSON.stringify([{ name: 'White', hex: '#FFFFFF' }, { name: 'Cream', hex: '#FFFDD0' }]),
      stock: 80,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Winter Karandi Suit',
      slug: 'winter-karandi-suit',
      description: 'Warm and durable karandi unstitched fabric for winter.',
      price: 3200,
      categoryId: catMap['mens-unstitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1616422285623-131696ee656b?w=800&q=80']),
      sizes: JSON.stringify(['Unstitched']),
      colors: JSON.stringify([{ name: 'Mustard', hex: '#FFDB58' }, { name: 'Olive', hex: '#808000' }]),
      stock: 60,
      isVisible: true,
      isFeatured: false,
    },

    // Women's Stitched
    {
      name: 'Chiffon Party Wear Dress',
      slug: 'chiffon-party-wear-dress',
      description: 'Elegant stitched chiffon dress with heavy embroidery.',
      price: 8500,
      categoryId: catMap['womens-stitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80']),
      sizes: JSON.stringify(['S', 'M', 'L']),
      colors: JSON.stringify([{ name: 'Maroon', hex: '#800000' }]),
      stock: 15,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Printed Lawn Kurti',
      slug: 'printed-lawn-kurti',
      description: 'Everyday casual printed lawn kurti.',
      price: 2200,
      categoryId: catMap['womens-stitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80']),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      colors: JSON.stringify([{ name: 'Floral Blue', hex: '#1E90FF' }]),
      stock: 45,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Formal Silk Tunic',
      slug: 'formal-silk-tunic',
      description: 'Luxurious silk tunic for evening occasions.',
      price: 5400,
      categoryId: catMap['womens-stitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1550639525-c97d455acf70?w=800&q=80']),
      sizes: JSON.stringify(['M', 'L']),
      colors: JSON.stringify([{ name: 'Emerald', hex: '#50C878' }]),
      stock: 20,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Cotton Co-ord Set',
      slug: 'cotton-coord-set',
      description: 'Trendy two-piece cotton co-ord set.',
      price: 4800,
      categoryId: catMap['womens-stitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80']),
      sizes: JSON.stringify(['S', 'M', 'L']),
      colors: JSON.stringify([{ name: 'Lavender', hex: '#E6E6FA' }]),
      stock: 35,
      isVisible: true,
      isFeatured: false,
    },

    // Women's Unstitched
    {
      name: '3-Piece Embroidered Lawn',
      slug: '3-piece-embroidered-lawn',
      description: 'Beautiful unstitched 3-piece lawn suit with chiffon dupatta.',
      price: 4500,
      categoryId: catMap['womens-unstitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1594938298596-70f56fb3cebc?w=800&q=80']),
      sizes: JSON.stringify(['Unstitched']),
      colors: JSON.stringify([{ name: 'Pink', hex: '#FFC0CB' }, { name: 'Mint', hex: '#98FF98' }]),
      stock: 75,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Khaddar Winter Collection',
      slug: 'khaddar-winter-collection',
      description: 'Warm 3-piece khaddar unstitched suit.',
      price: 3900,
      categoryId: catMap['womens-unstitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1622122201714-3677b10ffba5?w=800&q=80']),
      sizes: JSON.stringify(['Unstitched']),
      colors: JSON.stringify([{ name: 'Rust', hex: '#B7410E' }]),
      stock: 55,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Festive Chiffon Suit',
      slug: 'festive-chiffon-suit',
      description: 'Heavily embroidered unstitched chiffon suit for weddings.',
      price: 9500,
      categoryId: catMap['womens-unstitched'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80']),
      sizes: JSON.stringify(['Unstitched']),
      colors: JSON.stringify([{ name: 'Gold', hex: '#FFD700' }]),
      stock: 25,
      isVisible: true,
      isFeatured: true,
    },

    // Caps & Headwear
    {
      name: 'Hand-knitted Prayer Cap',
      slug: 'hand-knitted-prayer-cap',
      description: 'Traditional hand-knitted cotton prayer cap.',
      price: 450,
      categoryId: catMap['caps-headwear'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1521369909029-2afed882ba54?w=800&q=80']),
      sizes: JSON.stringify(['One Size']),
      colors: JSON.stringify([{ name: 'White', hex: '#FFFFFF' }]),
      stock: 150,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Authentic Wool Pakol',
      slug: 'authentic-wool-pakol',
      description: 'Warm and traditional woolen pakol from the northern regions.',
      price: 1200,
      categoryId: catMap['caps-headwear'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&q=80']),
      sizes: JSON.stringify(['One Size']),
      colors: JSON.stringify([{ name: 'Brown', hex: '#8B4513' }, { name: 'Grey', hex: '#808080' }]),
      stock: 80,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Velvet Kufi',
      slug: 'velvet-kufi',
      description: 'Premium velvet kufi for special prayers.',
      price: 800,
      categoryId: catMap['caps-headwear'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1534260933201-acfaee1dc3e5?w=800&q=80']),
      sizes: JSON.stringify(['S', 'M', 'L']),
      colors: JSON.stringify([{ name: 'Black', hex: '#000000' }]),
      stock: 60,
      isVisible: true,
      isFeatured: false,
    },

    // Western Wear
    {
      name: 'Basic Crew Neck T-Shirt',
      slug: 'basic-crew-neck-tshirt',
      description: 'Comfortable 100% cotton crew neck t-shirt.',
      price: 1500,
      categoryId: catMap['western-wear'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify([{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }]),
      stock: 120,
      isVisible: true,
      isFeatured: true,
    },
    {
      name: 'Slim Fit Denim Jeans',
      slug: 'slim-fit-denim-jeans',
      description: 'Stylish slim fit stretch denim jeans.',
      price: 3200,
      categoryId: catMap['western-wear'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80']),
      sizes: JSON.stringify(['30', '32', '34', '36']),
      colors: JSON.stringify([{ name: 'Blue', hex: '#0000FF' }]),
      stock: 90,
      isVisible: true,
      isFeatured: false,
    },
    {
      name: 'Faux Leather Jacket',
      slug: 'faux-leather-jacket',
      description: 'Trendy faux leather jacket for a bold look.',
      price: 7500,
      categoryId: catMap['western-wear'],
      images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80']),
      sizes: JSON.stringify(['M', 'L', 'XL']),
      colors: JSON.stringify([{ name: 'Black', hex: '#000000' }]),
      stock: 25,
      isVisible: true,
      isFeatured: true,
    }
  ]

  // Clear existing products and categories to avoid conflicts with old slugs during seed
  // (Optional depending on requirements, but using upsert is generally safe if slugs are unique. 
  // Wait, if old categories exist, it's fine to leave them, but the prompt says "Rewrite with 6 categories".
  // Let's just upsert the new ones and products.)

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        categoryId: prod.categoryId,
        images: prod.images,
        sizes: prod.sizes,
        colors: prod.colors,
        stock: prod.stock,
        isVisible: prod.isVisible,
        isFeatured: prod.isFeatured,
      },
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
