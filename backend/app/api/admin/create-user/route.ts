import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName, adminToken } = await request.json()

    // Simple admin verification for demo
    if (adminToken !== 'admin123') {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // For demo purposes, just return success
    return NextResponse.json({
      message: "Admin user created successfully",
      user: {
        uid: Math.random().toString(36).substr(2, 9),
        email: email,
        displayName: displayName || 'Admin User',
      },
    })
  } catch (error: any) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: error.message || "Failed to create admin user" }, { status: 500 })
  }
}
