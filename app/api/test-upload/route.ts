import { type NextRequest, NextResponse } from "next/server"
import { CloudinaryService } from "@/lib/cloudinary/upload-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "Only PDF files allowed" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    
    const uploadResult = await CloudinaryService.uploadPDF(
      fileBuffer,
      file.name,
      'test',
      'notes'
    )

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      result: uploadResult
    })
  } catch (error) {
    console.error("Upload test error:", error)
    return NextResponse.json({ 
      error: "Upload failed", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}