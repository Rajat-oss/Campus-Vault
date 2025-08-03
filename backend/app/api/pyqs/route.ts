import { NextRequest, NextResponse } from 'next/server'
import { CloudinaryService } from '@/lib/cloudinary/upload-service'

// In-memory storage for PYQs
const pyqs: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const year = searchParams.get('year')
    const semester = searchParams.get('semester')
    const branch = searchParams.get('branch')
    const examType = searchParams.get('examType')
    
    let filteredPyqs = [...pyqs]
    
    if (subject) filteredPyqs = filteredPyqs.filter(p => p.subject === subject)
    if (year) filteredPyqs = filteredPyqs.filter(p => p.year === parseInt(year))
    if (semester) filteredPyqs = filteredPyqs.filter(p => p.semester === parseInt(semester))
    if (branch) filteredPyqs = filteredPyqs.filter(p => p.branch === branch)
    if (examType) filteredPyqs = filteredPyqs.filter(p => p.examType === examType)
    
    // Sort by year descending
    filteredPyqs.sort((a, b) => b.year - a.year)
    
    return NextResponse.json({ pyqs: filteredPyqs })
  } catch (error) {
    console.error('Error fetching PYQs:', error)
    return NextResponse.json({ error: 'Failed to fetch PYQs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const subject = formData.get('subject') as string
    const year = formData.get('year') as string
    const semester = formData.get('semester') as string
    const branch = formData.get('branch') as string
    const examType = formData.get('examType') as string
    const adminToken = formData.get('adminToken') as string
    
    if (adminToken !== 'admin123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const folderPath = CloudinaryService.generateFolderPath('pyqs', {
      branch,
      subject,
      year: parseInt(year)
    })
    
    const uploadResult = await CloudinaryService.uploadPDF(
      fileBuffer,
      file.name,
      folderPath,
      'pyqs'
    )
    
    const pyqData = {
      id: Date.now().toString(),
      subject,
      year: parseInt(year),
      semester: parseInt(semester),
      branch,
      examType: examType || 'regular',
      fileName: file.name,
      fileSize: uploadResult.bytes,
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'admin'
    }
    
    pyqs.push(pyqData)
    
    return NextResponse.json({
      message: 'PYQ uploaded successfully',
      pyqId: pyqData.id,
      fileUrl: uploadResult.secure_url
    })
  } catch (error) {
    console.error('Error uploading PYQ:', error)
    return NextResponse.json({ error: 'Failed to upload PYQ' }, { status: 500 })
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
      return NextResponse.json({ error: 'PYQ ID is required' }, { status: 400 })
    }
    
    const index = pyqs.findIndex(p => p.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'PYQ not found' }, { status: 404 })
    }
    
    const pyq = pyqs[index]
    
    // Delete from Cloudinary
    if (pyq.cloudinaryPublicId) {
      await CloudinaryService.deleteFile(pyq.cloudinaryPublicId)
    }
    
    // Remove from in-memory storage
    pyqs.splice(index, 1)
    
    return NextResponse.json({ message: 'PYQ deleted successfully' })
  } catch (error) {
    console.error('Error deleting PYQ:', error)
    return NextResponse.json({ error: 'Failed to delete PYQ' }, { status: 500 })
  }
}