import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useAnnouncements(filters?: { type?: string; isActive?: boolean }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'))

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        let announcements = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Apply filters in memory
        if (filters?.type) {
          announcements = announcements.filter(a => a.type === filters.type)
        }
        if (filters?.isActive !== undefined) {
          announcements = announcements.filter(a => a.isActive === filters.isActive)
        }
        
        setData(announcements)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError('Failed to fetch announcements')
        setLoading(false)
        console.error(err)
      }
    )

    return () => unsubscribe()
  }, [filters?.type, filters?.isActive])

  return { data, loading, error }
}

export function useNotes(filters?: { subject?: string; semester?: number; branch?: string; noteType?: string }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let q = query(collection(db, 'notes'), orderBy('uploadedAt', 'desc'))

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        let notes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Apply filters in memory
        if (filters?.subject) {
          notes = notes.filter(n => n.subject === filters.subject)
        }
        if (filters?.semester) {
          notes = notes.filter(n => n.semester === filters.semester)
        }
        if (filters?.branch) {
          notes = notes.filter(n => n.branch === filters.branch)
        }
        if (filters?.noteType) {
          notes = notes.filter(n => n.noteType === filters.noteType)
        }
        
        setData(notes)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError('Failed to fetch notes')
        setLoading(false)
        console.error(err)
      }
    )

    return () => unsubscribe()
  }, [filters?.subject, filters?.semester, filters?.branch, filters?.noteType])

  return { data, loading, error }
}

export function usePYQs(filters?: { subject?: string; year?: number; semester?: number; branch?: string; examType?: string }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let q = query(collection(db, 'pyqs'), orderBy('uploadedAt', 'desc'))

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        let pyqs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Apply filters in memory
        if (filters?.subject) {
          pyqs = pyqs.filter(p => p.subject === filters.subject)
        }
        if (filters?.year) {
          pyqs = pyqs.filter(p => p.year === filters.year)
        }
        if (filters?.semester) {
          pyqs = pyqs.filter(p => p.semester === filters.semester)
        }
        if (filters?.branch) {
          pyqs = pyqs.filter(p => p.branch === filters.branch)
        }
        if (filters?.examType) {
          pyqs = pyqs.filter(p => p.examType === filters.examType)
        }
        
        setData(pyqs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError('Failed to fetch PYQs')
        setLoading(false)
        console.error(err)
      }
    )

    return () => unsubscribe()
  }, [filters?.subject, filters?.year, filters?.semester, filters?.branch, filters?.examType])

  return { data, loading, error }
}

export function useTimetables(branch?: string, semester?: number) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let q = query(collection(db, 'timetables'), orderBy('uploadedAt', 'desc'))

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        let timetables = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Apply filters in memory
        if (branch) {
          timetables = timetables.filter(t => t.branch === branch)
        }
        if (semester) {
          timetables = timetables.filter(t => t.semester === semester)
        }
        
        setData(timetables)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError('Failed to fetch timetables')
        setLoading(false)
        console.error(err)
      }
    )

    return () => unsubscribe()
  }, [branch, semester])

  return { data, loading, error }
}