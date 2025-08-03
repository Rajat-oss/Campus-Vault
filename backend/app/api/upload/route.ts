import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  console.log('📤 Upload request received')
  
  try {
    console.log('⚙️ Configuring Cloudinary...')
    cloudinary.config({
      cloud_name: 'dvygl2rgf',
      api_key: '189523277583391',
      api_secret: 'KywGbUAykxOphTDwooRCUgspX-0',
    })

    console.log('📋 Parsing form data...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    
    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json({ error: 'No file provided', success: false }, { status: 400 })
    }
    
    if (file.type !== 'application/pdf') {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json({ error: 'Only PDF files allowed', success: false }, { status: 400 })
    }
    
    console.log(`📄 Processing file: ${file.name} (${file.size} bytes)`)
    const buffer = Buffer.from(await file.arrayBuffer())
    
    console.log('☁️ Uploading to Cloudinary...')
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'raw',
          folder: `campus-vault/${type}`,
          public_id: `${Date.now()}_${file.name}`
        },
        (error, result) => {
          if (error) {
            console.log('❌ Cloudinary error:', error)
            reject(error)
          } else {
            console.log('✅ Upload successful:', result?.secure_url)
            resolve(result)
          }
        }
      ).end(buffer)
    })
    
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.secure_url,
      downloadUrl: result.secure_url + '?fl_attachment=true',
      public_id: result.public_id,
      fileName: file.name,
      fileSize: result.bytes
    })
  } catch (error: any) {
    console.error('💥 Upload failed:', error)
    return NextResponse.json({ 
      error: error.message || 'Upload failed', 
      success: false,
      details: error.toString()
    }, { status: 500 })
  }
}