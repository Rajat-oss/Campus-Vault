import { NextRequest, NextResponse } from 'next/server'

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