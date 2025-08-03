import { NextRequest, NextResponse } from 'next/server'

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