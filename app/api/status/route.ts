import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'running',
    message: 'College Academic Resource Sharing Platform Backend',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/auth/verify-admin',
      '/api/admin/create-user',
      '/api/announcements',
      '/api/notes',
      '/api/pyqs',
      '/api/timetables',
      '/api/upload'
    ]
  })
}