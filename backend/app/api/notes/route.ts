import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/firebase/database-service'
import { verifyAdminToken } from '@/lib/firebase/auth-utils'

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
    const { title, subject, semester, branch, noteType, description, fileName, adminToken } = await request.json()
    
    const isAdmin = await verifyAdminToken(adminToken)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const noteData = {
      title,
      subject,
      semester: parseInt(semester) || 1,
      branch,
      noteType,
      description,
      fileName: fileName || 'document.pdf',
      fileSize: 0,
      timestamp: new Date(),
      uploadedBy: 'admin'
    }
    
    const id = await DatabaseService.createNote(noteData)
    return NextResponse.json({ id, message: 'Note created successfully' })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}