import { type NextRequest, NextResponse } from "next/server"
import { CloudinaryService } from "@/lib/cloudinary/upload-service"
import { DatabaseService } from "@/lib/firebase/database-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const adminToken = formData.get("adminToken") as string
    const title = formData.get("title") as string
    const subject = formData.get("subject") as string
    const semester = formData.get("semester") as string
    const branch = formData.get("branch") as string
    const noteType = formData.get("noteType") as string
    const description = formData.get("description") as string

    // Admin verification
    if (adminToken !== 'admin123') {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    if (!file || !title || !subject || !semester || !branch) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const metadata = {
      branch,
      semester: parseInt(semester),
      subject
    }

    // Upload to Cloudinary
    const folderPath = CloudinaryService.generateFolderPath('notes', metadata)
    const uploadResult = await CloudinaryService.uploadPDF(
      fileBuffer,
      file.name,
      folderPath,
      'notes'
    )

    // Save to database
    const noteData = {
      title,
      subject,
      semester: parseInt(semester),
      branch,
      noteType: noteType || 'lecture',
      description: description || '',
      fileName: file.name,
      fileSize: uploadResult.bytes,
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      timestamp: new Date(),
      uploadedBy: 'admin'
    }

    const noteId = await DatabaseService.createNote(noteData)

    return NextResponse.json({
      message: "Note uploaded successfully",
      noteId,
      fileUrl: uploadResult.secure_url,
      fileName: file.name,
      fileSize: uploadResult.bytes
    })
  } catch (error) {
    console.error("Error uploading note:", error)
    return NextResponse.json({ error: "Failed to upload note" }, { status: 500 })
  }
}