import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 })
    }

    // Simple admin verification for demo
    const isAdmin = idToken === 'admin123'

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error("Error verifying admin token:", error)
    return NextResponse.json({ error: "Failed to verify admin token" }, { status: 500 })
  }
}
