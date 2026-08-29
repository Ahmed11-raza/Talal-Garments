import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  comparePrice: z.number().nullable().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string()
  })).min(1, 'At least one color is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().regex(/^(\+92|0)?3\d{9}$/, 'Valid Pakistani mobile number required'),
    email: z.string().email('Valid email required').optional().or(z.literal('')),
  }),
  address: z.object({
    street: z.string().min(5, 'Complete street address is required'),
    city: z.string().min(2, 'City is required'),
    province: z.string().min(2, 'Province is required'),
    postalCode: z.string().optional(),
  }),
  items: z.array(z.object({
    productId: z.string(),
    size: z.string(),
    color: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, 'Cart is empty'),
  paymentMethod: z.literal('cod'),
})

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  image: z.string().nullable().optional(),
})
