import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file ditemukan' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Create a safe filename with timestamp to avoid name collisions
    const timestamp = Date.now()
    const safeFilename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`
    
    // Path to public/image
    const uploadPath = path.join(process.cwd(), 'public', 'image', safeFilename)
    
    await writeFile(uploadPath, buffer)

    // Return the accessible public URL
    const publicUrl = `/image/${safeFilename}`
    
    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Gagal mengunggah file: ' + error.message }, { status: 500 })
  }
}
