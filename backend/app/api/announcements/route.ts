import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for announcements
const announcements: any[] = []

let announcementIdCounter = 1

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const isActive = searchParams.get('isActive')
    
    let filteredAnnouncements = [...announcements]
    
    if (type) {
      filteredAnnouncements = filteredAnnouncements.filter(a => a.type === type)
    }
    
    if (isActive !== null) {
      const activeFilter = isActive === 'true'
      filteredAnnouncements = filteredAnnouncements.filter(a => a.isActive === activeFilter)
    }
    
    // Sort by timestamp descending
    filteredAnnouncements.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    return NextResponse.json({ announcements: filteredAnnouncements })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, type, visibility, adminToken } = await request.json()
    
    // Simple admin verification
    if (adminToken !== 'admin123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const announcementData = {
      id: (announcementIdCounter++).toString(),
      title,
      content,
      type,
      isActive: visibility === 'public',
      timestamp: new Date(),
      createdBy: 'admin'
    }
    
    announcements.push(announcementData)
    return NextResponse.json({ id: announcementData.id, message: 'Announcement created successfully' })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}