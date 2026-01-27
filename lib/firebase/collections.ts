export interface Announcement {
  id?: string
  title: string
  content: string
  type: "Exam" | "Event" | "General" | "Holiday" | "Important"
  postedBy: string
  timestamp: Date
  isActive: boolean
  priority: "low" | "medium" | "high"
}

export interface Timetable {
  id?: string
  branch: string
  semester: number
  url: string
  fileName: string
  uploadedAt: Date
  uploadedBy: string
  academicYear: string
}

export interface Note {
  id?: string
  subject: string
  semester: number
  branch: string
  noteType: "handwritten" | "typed" | "slides"
  downloadURL: string
  fileName: string
  uploadedBy: string
  timestamp: Date
  tags: string[]
  description?: string
}

export interface PYQ {
  id?: string
  subject: string
  year: number
  semester: number
  branch: string
  url: string
  fileName: string
  uploader: string
  uploadedAt: Date
  examType: "mid" | "final" | "quiz"
}

export interface StudyMaterial {
  id?: string
  title: string
  subject: string
  semester: number
  branch: string
  type: "formula_sheet" | "guidebook" | "reference" | "tutorial"
  url: string
  fileName: string
  uploadedBy: string
  uploadedAt: Date
  description?: string
}

export interface Request {
  id?: string
  requestedBy: string
  requesterEmail: string
  subject: string
  semester: number
  branch: string
  type: "notes" | "pyq" | "timetable" | "study_material"
  description: string
  status: "pending" | "fulfilled" | "rejected"
  requestedAt: Date
  fulfilledAt?: Date
  fulfilledBy?: string
}

// Collection names
export const COLLECTIONS = {
  ANNOUNCEMENTS: "announcements",
  TIMETABLES: "timetables",
  NOTES: "notes",
  PYQS: "pyqs",
  STUDY_MATERIALS: "study_materials",
  REQUESTS: "requests",
  ADMIN_USERS: "admin_users",
} as const
