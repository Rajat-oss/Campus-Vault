import { doc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'

export const deleteAnnouncement = async (id: string) => {
  await deleteDoc(doc(db, 'announcements', id))
}

export const deleteNote = async (id: string) => {
  await deleteDoc(doc(db, 'notes', id))
}

export const deletePYQ = async (id: string) => {
  await deleteDoc(doc(db, 'pyqs', id))
}

export const deleteTimetable = async (id: string) => {
  await deleteDoc(doc(db, 'timetables', id))
}