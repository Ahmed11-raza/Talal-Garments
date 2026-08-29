import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

// Fallbacks for local dev without crashing
const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy'
const bucketName = process.env.SUPABASE_BUCKET || 'products'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function processAndUploadImage(file: File): Promise<string> {
  if (supabaseUrl === 'https://dummy.supabase.co') {
    console.warn('Using dummy Supabase credentials. Image upload will fail if not using local storage alternative.')
  }

  // 1. Process image with Sharp
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  const processedBuffer = await sharp(buffer)
    .resize(1200, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({ quality: 80 })
    .toBuffer()

  // 2. Upload to Supabase Storage
  const filename = `${uuidv4()}.webp`
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filename, processedBuffer, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Supabase upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // 3. Return the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filename)

  return publicUrl
}
