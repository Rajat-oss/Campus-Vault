import { type NextRequest, NextResponse } from "next/server"
import { CloudinaryService } from "@/lib/cloudinary/upload-service"

// In-memory storage for timetables (you can replace with database)
const timetables: any[] = []

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const adminToken = formData.get("adminToken") as string
    const title = formData.get("title") as string
    const branch = formData.get("branch") as string
    const semester = formData.get("semester") as string
    const academicYear = formData.get("academicYear") as string

    // Admin verification
    if (adminToken !== 'admin123') {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    if (!file || !title || !branch || !semester) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const metadata = {
      branch,
      semester: parseInt(semester)
    }

    // Upload to Cloudinary
    const folderPath = CloudinaryService.generateFolderPath('timetables', metadata)
    const uploadResult = await CloudinaryService.uploadPDF(
      fileBuffer,
      file.name,
      folderPath,
      'timetables'
    )

    // Save to in-memory storage
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
      message: "Timetable uploaded successfully",
      timetableId: timetableData.id,
      fileUrl: uploadResult.secure_url,
      fileName: file.name,
      fileSize: uploadResult.bytes
    })
  } catch (error) {
    console.error("Error uploading timetable:", error)
    return NextResponse.json({ error: "Failed to upload timetable" }, { status: 500 })
  }
}