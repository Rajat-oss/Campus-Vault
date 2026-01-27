import { storage } from "./config"
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage"

export class StorageService {
  // Upload file to Firebase Storage
  static async uploadFile(file: File, path: string, fileName?: string): Promise<{ url: string; fileName: string }> {
    try {
      const timestamp = Date.now()
      const finalFileName = fileName || `${timestamp}_${file.name}`
      const storageRef = ref(storage, `${path}/${finalFileName}`)

      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      return {
        url: downloadURL,
        fileName: finalFileName,
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  // Delete file from Firebase Storage
  static async deleteFile(filePath: string): Promise<boolean> {
    try {
      const storageRef = ref(storage, filePath)
      await deleteObject(storageRef)
      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  // List all files in a directory
  static async listFiles(path: string) {
    try {
      const storageRef = ref(storage, path)
      const result = await listAll(storageRef)

      const files = await Promise.all(
        result.items.map(async (item) => ({
          name: item.name,
          fullPath: item.fullPath,
          url: await getDownloadURL(item),
        })),
      )

      return files
    } catch (error) {
      console.error("Error listing files:", error)
      throw error
    }
  }

  // Generate storage paths
  static getNotesPath(subject: string, semester: number, branch: string) {
    return `notes/${branch}/semester_${semester}/${subject}`
  }

  static getTimetablePath(branch: string, semester: number) {
    return `timetables/${branch}/semester_${semester}`
  }

  static getPYQPath(subject: string, year: number, branch: string) {
    return `pyqs/${branch}/${subject}/${year}`
  }

  static getStudyMaterialPath(subject: string, semester: number, branch: string) {
    return `study_materials/${branch}/semester_${semester}/${subject}`
  }
}
