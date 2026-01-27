import { db } from "./config"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
} from "firebase/firestore"
import {
  type Announcement,
  type Timetable,
  type Note,
  type PYQ,
  type StudyMaterial,
  type Request,
  COLLECTIONS,
} from "./collections"

export class DatabaseService {
  // Announcements
  static async createAnnouncement(announcement: Omit<Announcement, "id">) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ANNOUNCEMENTS), {
        ...announcement,
        timestamp: Timestamp.fromDate(announcement.timestamp),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating announcement:", error)
      throw error
    }
  }

  static async getAnnouncements(filters?: { type?: string; isActive?: boolean }) {
    try {
      let q = query(collection(db, COLLECTIONS.ANNOUNCEMENTS), orderBy("timestamp", "desc"))

      if (filters?.type) {
        q = query(q, where("type", "==", filters.type))
      }
      if (filters?.isActive !== undefined) {
        q = query(q, where("isActive", "==", filters.isActive))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Announcement[]
    } catch (error) {
      console.error("Error getting announcements:", error)
      throw error
    }
  }

  // Timetables
  static async createTimetable(timetable: Omit<Timetable, "id">) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TIMETABLES), {
        ...timetable,
        uploadedAt: Timestamp.fromDate(timetable.uploadedAt),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating timetable:", error)
      throw error
    }
  }

  static async getTimetables(branch?: string, semester?: number) {
    try {
      let q = query(collection(db, COLLECTIONS.TIMETABLES), orderBy("uploadedAt", "desc"))

      if (branch) {
        q = query(q, where("branch", "==", branch))
      }
      if (semester) {
        q = query(q, where("semester", "==", semester))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate(),
      })) as Timetable[]
    } catch (error) {
      console.error("Error getting timetables:", error)
      throw error
    }
  }

  // Notes
  static async createNote(note: Omit<Note, "id">) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.NOTES), {
        ...note,
        timestamp: Timestamp.fromDate(note.timestamp),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating note:", error)
      throw error
    }
  }

  static async getNotes(filters?: {
    subject?: string
    semester?: number
    branch?: string
    noteType?: string
  }) {
    try {
      let q = query(collection(db, COLLECTIONS.NOTES), orderBy("timestamp", "desc"))

      if (filters?.subject) {
        q = query(q, where("subject", "==", filters.subject))
      }
      if (filters?.semester) {
        q = query(q, where("semester", "==", filters.semester))
      }
      if (filters?.branch) {
        q = query(q, where("branch", "==", filters.branch))
      }
      if (filters?.noteType) {
        q = query(q, where("noteType", "==", filters.noteType))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Note[]
    } catch (error) {
      console.error("Error getting notes:", error)
      throw error
    }
  }

  // PYQs
  static async createPYQ(pyq: Omit<PYQ, "id">) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PYQS), {
        ...pyq,
        uploadedAt: Timestamp.fromDate(pyq.uploadedAt),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating PYQ:", error)
      throw error
    }
  }

  static async getPYQs(filters?: {
    subject?: string
    year?: number
    semester?: number
    branch?: string
    examType?: string
  }) {
    try {
      let q = query(collection(db, COLLECTIONS.PYQS), orderBy("year", "desc"))

      if (filters?.subject) {
        q = query(q, where("subject", "==", filters.subject))
      }
      if (filters?.year) {
        q = query(q, where("year", "==", filters.year))
      }
      if (filters?.semester) {
        q = query(q, where("semester", "==", filters.semester))
      }
      if (filters?.branch) {
        q = query(q, where("branch", "==", filters.branch))
      }
      if (filters?.examType) {
        q = query(q, where("examType", "==", filters.examType))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate(),
      })) as PYQ[]
    } catch (error) {
      console.error("Error getting PYQs:", error)
      throw error
    }
  }

  // Study Materials
  static async createStudyMaterial(material: Omit<StudyMaterial, "id">) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.STUDY_MATERIALS), {
        ...material,
        uploadedAt: Timestamp.fromDate(material.uploadedAt),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating study material:", error)
      throw error
    }
  }

  static async getStudyMaterials(filters?: {
    subject?: string
    semester?: number
    branch?: string
    type?: string
  }) {
    try {
      let q = query(collection(db, COLLECTIONS.STUDY_MATERIALS), orderBy("uploadedAt", "desc"))

      if (filters?.subject) {
        q = query(q, where("subject", "==", filters.subject))
      }
      if (filters?.semester) {
        q = query(q, where("semester", "==", filters.semester))
      }
      if (filters?.branch) {
        q = query(q, where("branch", "==", filters.branch))
      }
      if (filters?.type) {
        q = query(q, where("type", "==", filters.type))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate(),
      })) as StudyMaterial[]
    } catch (error) {
      console.error("Error getting study materials:", error)
      throw error
    }
  }

  // Requests
  static async createRequest(request: Omit<Request, "id">) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.REQUESTS), {
        ...request,
        requestedAt: Timestamp.fromDate(request.requestedAt),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating request:", error)
      throw error
    }
  }

  static async getRequests(status?: string) {
    try {
      let q = query(collection(db, COLLECTIONS.REQUESTS), orderBy("requestedAt", "desc"))

      if (status) {
        q = query(q, where("status", "==", status))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        requestedAt: doc.data().requestedAt.toDate(),
        fulfilledAt: doc.data().fulfilledAt?.toDate(),
      })) as Request[]
    } catch (error) {
      console.error("Error getting requests:", error)
      throw error
    }
  }

  static async updateRequestStatus(requestId: string, status: "fulfilled" | "rejected", fulfilledBy?: string) {
    try {
      const updateData: any = {
        status,
        fulfilledAt: Timestamp.now(),
      }

      if (fulfilledBy) {
        updateData.fulfilledBy = fulfilledBy
      }

      await updateDoc(doc(db, COLLECTIONS.REQUESTS, requestId), updateData)
      return true
    } catch (error) {
      console.error("Error updating request status:", error)
      throw error
    }
  }

  // Generic delete function
  static async deleteDocument(collectionName: string, documentId: string) {
    try {
      await deleteDoc(doc(db, collectionName, documentId))
      return true
    } catch (error) {
      console.error("Error deleting document:", error)
      throw error
    }
  }

  // Real-time listeners
  static subscribeToAnnouncements(callback: (announcements: Announcement[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.ANNOUNCEMENTS),
      where("isActive", "==", true),
      orderBy("timestamp", "desc"),
      limit(10),
    )

    return onSnapshot(q, (snapshot) => {
      const announcements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Announcement[]

      callback(announcements)
    })
  }
}
