import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { processAndUploadImage } from '@/lib/upload'

export async function POST(request: Request) {
  const session = await auth()
  // @ts-ignore
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const publicUrl = await processAndUploadImage(file)
    
    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error('Upload route error:', error)
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 })
  }
}
