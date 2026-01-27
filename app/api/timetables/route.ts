import { NextRequest, NextResponse } from 'next/server'
import { CloudinaryService } from '@/lib/cloudinary/upload-service'

// In-memory storage for timetables
const timetables: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branch = searchParams.get('branch')
    const semester = searchParams.get('semester')
    
    let filteredTimetables = [...timetables]
    
    if (branch) filteredTimetables = filteredTimetables.filter(t => t.branch === branch)
    if (semester) filteredTimetables = filteredTimetables.filter(t => t.semester === parseInt(semester))
    
    // Sort by uploadedAt descending
    filteredTimetables.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    
    return NextResponse.json({ timetables: filteredTimetables })
  } catch (error) {
    console.error('Error fetching timetables:', error)
    return NextResponse.json({ error: 'Failed to fetch timetables' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const branch = formData.get('branch') as string
    const semester = formData.get('semester') as string
    const academicYear = formData.get('academicYear') as string
    const adminToken = formData.get('adminToken') as string
    
    if (adminToken !== 'admin123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const folderPath = CloudinaryService.generateFolderPath('timetables', {
      branch,
      semester: parseInt(semester)
    })
    
    const uploadResult = await CloudinaryService.uploadPDF(
      fileBuffer,
      file.name,
      folderPath,
      'timetables'
    )
    
    const timetableData = {
      id: Date.now().toString(),
      title,
      branch,
      semester: parseInt(semester),
      academicYear: academicYear || new Date().getFullYear().toString(),
      fileName: file.name,
      fileSize: uploadResult.bytes,
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'admin'
    }
    
    timetables.push(timetableData)
    
    return NextResponse.json({
      message: 'Timetable uploaded successfully',
      timetableId: timetableData.id,
      fileUrl: uploadResult.secure_url
    })
  } catch (error) {
    console.error('Error uploading timetable:', error)
    return NextResponse.json({ error: 'Failed to upload timetable' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const adminToken = searchParams.get('adminToken')
    
    if (adminToken !== 'admin123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    if (!id) {
      return NextResponse.json({ error: 'Timetable ID is required' }, { status: 400 })
    }
    
    const index = timetables.findIndex(t => t.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Timetable not found' }, { status: 404 })
    }
    
    const timetable = timetables[index]
    
    // Delete from Cloudinary
    if (timetable.cloudinaryPublicId) {
      await CloudinaryService.deleteFile(timetable.cloudinaryPublicId)
    }
    
    // Remove from in-memory storage
    timetables.splice(index, 1)
    
    return NextResponse.json({ message: 'Timetable deleted successfully' })
  } catch (error) {
    console.error('Error deleting timetable:', error)
    return NextResponse.json({ error: 'Failed to delete timetable' }, { status: 500 })
  }
}