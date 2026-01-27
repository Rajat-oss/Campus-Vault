import { type NextRequest, NextResponse } from "next/server"
import { CloudinaryService } from "@/lib/cloudinary/upload-service"

// In-memory storage for PYQs (you can replace with database)
const pyqs: any[] = []

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const adminToken = formData.get("adminToken") as string
    const subject = formData.get("subject") as string
    const year = formData.get("year") as string
    const semester = formData.get("semester") as string
    const branch = formData.get("branch") as string
    const examType = formData.get("examType") as string

    // Admin verification
    if (adminToken !== 'admin123') {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    if (!file || !subject || !year || !semester || !branch) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const metadata = {
      branch,
      subject,
      year: parseInt(year)
    }

    // Upload to Cloudinary
    const folderPath = CloudinaryService.generateFolderPath('pyqs', metadata)
    const uploadResult = await CloudinaryService.uploadPDF(
      fileBuffer,
      file.name,
      folderPath,
      'pyqs'
    )

    // Save to in-memory storage
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
      message: "PYQ uploaded successfully",
      pyqId: pyqData.id,
      fileUrl: uploadResult.secure_url,
      fileName: file.name,
      fileSize: uploadResult.bytes
    })
  } catch (error) {
    console.error("Error uploading PYQ:", error)
    return NextResponse.json({ error: "Failed to upload PYQ" }, { status: 500 })
  }
}