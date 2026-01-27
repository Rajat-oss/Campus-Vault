import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dvygl2rgf',
  api_key: '189523277583391',
  api_secret: 'KywGbUAykxOphTDwooRCUgspX-0',
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  original_filename: string
  bytes: number
  format: string
  resource_type: string
}

export class CloudinaryService {
  static async uploadPDF(
    fileBuffer: Buffer,
    fileName: string,
    folder: string,
    resourceType: 'notes' | 'pyqs' | 'timetables'
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `campus-vault/${resourceType}/${folder}`,
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              original_filename: fileName,
              bytes: result.bytes,
              format: result.format,
              resource_type: result.resource_type,
            })
          }
        }
      ).end(fileBuffer)
    })
  }

  // Delete file from Cloudinary
  static async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw'
      })
      return result.result === 'ok'
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return false
    }
  }

  // Generate folder paths for different resource types
  static generateFolderPath(
    type: 'notes' | 'pyqs' | 'timetables',
    metadata: {
      branch?: string
      semester?: number
      subject?: string
      year?: number
    }
  ): string {
    const { branch, semester, subject, year } = metadata

    switch (type) {
      case 'notes':
        return `${branch}/semester_${semester}/${subject}`
      case 'pyqs':
        return `${branch}/${subject}/${year}`
      case 'timetables':
        return `${branch}/semester_${semester}`
      default:
        return 'general'
    }
  }
}