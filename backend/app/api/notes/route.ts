import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/firebase/database-service'
import { verifyAdminToken } from '@/lib/firebase/auth-utils'
import { v2 as cloudinary } from 'cloudinary'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const semester = searchParams.get('semester')
    const branch = searchParams.get('branch')
    const noteType = searchParams.get('noteType')
    
    const filters: any = {}
    if (subject) filters.subject = subject
    if (semester) filters.semester = parseInt(semester)
    if (branch) filters.branch = branch
    if (noteType) filters.noteType = noteType
    
    const notes = await DatabaseService.getNotes(filters)
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const subject = formData.get('subject') as string
    const semester = formData.get('semester') as string
    const branch = formData.get('branch') as string
    const noteType = formData.get('noteType') as string
    const description = formData.get('description') as string
    const adminToken = formData.get('adminToken') as string
    
    if (adminToken !== 'admin123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    if (file) {
      cloudinary.config({
        cloud_name: 'dvygl2rgf',
        api_key: '189523277583391',
        api_secret: 'KywGbUAykxOphTDwooRCUgspX-0',
      })
      
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      
      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: 'raw',
            folder: `campus-vault/notes/${branch}/sem${semester}/${subject}`,
            public_id: `${Date.now()}_${file.name}`
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(fileBuffer)
      })
      
      const noteData = {
        title,
        subject,
        semester: parseInt(semester),
        branch,
        noteType: noteType || 'lecture',
        description: description || '',
        fileName: file.name,
        fileSize: uploadResult.bytes,
        fileUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        timestamp: new Date(),
        uploadedBy: 'admin'
      }
      
      const id = await DatabaseService.createNote(noteData)
      return NextResponse.json({ id, message: 'Note uploaded successfully', fileUrl: uploadResult.secure_url })
    }
    
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}