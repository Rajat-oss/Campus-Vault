import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUserProfile } from './use-user-profile'

export function useAnnouncements(filters?: { type?: string; isActive?: boolean }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useUserProfile()

  useEffect(() => {
    if (!profile?.college) {
      setLoading(false)
      return
    }

    let q = query(
      collection(db, 'announcements'),
      where('college', '==', profile.college)
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        let announcements = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
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
  }, [profile?.college, filters?.type, filters?.isActive])

  return { data, loading, error }
}

export function useNotes(filters?: { subject?: string; semester?: number; branch?: string; noteType?: string }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useUserProfile()

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (!profile?.college) {
          setLoading(false)
          return
        }

        let q = query(collection(db, 'notes'), where('college', '==', profile.college))
        const snapshot = await getDocs(q)
        let notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        
        if (filters?.subject) notes = notes.filter(n => n.subject === filters.subject)
        if (filters?.semester) notes = notes.filter(n => n.semester === filters.semester)
        if (filters?.branch) notes = notes.filter(n => n.branch === filters.branch)
        if (filters?.noteType) notes = notes.filter(n => n.noteType === filters.noteType)
        
        setData(notes)
        setLoading(false)
        setError(null)
      } catch (err) {
        setError('Failed to fetch notes')
        setLoading(false)
        console.error(err)
      }
    }

    fetchNotes()
    const interval = setInterval(fetchNotes, 5000)
    
    return () => clearInterval(interval)
  }, [profile?.college, filters?.subject, filters?.semester, filters?.branch, filters?.noteType])

  return { data, loading, error }
}

export function usePYQs(filters?: { subject?: string; year?: number; semester?: number; branch?: string; examType?: string }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useUserProfile()

  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        if (!profile?.college) {
          setLoading(false)
          return
        }

        let q = query(collection(db, 'pyqs'), where('college', '==', profile.college))
        const snapshot = await getDocs(q)
        let pyqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        
        if (filters?.subject) pyqs = pyqs.filter(p => p.subject === filters.subject)
        if (filters?.year) pyqs = pyqs.filter(p => p.year === filters.year)
        if (filters?.semester) pyqs = pyqs.filter(p => p.semester === filters.semester)
        if (filters?.branch) pyqs = pyqs.filter(p => p.branch === filters.branch)
        if (filters?.examType) pyqs = pyqs.filter(p => p.examType === filters.examType)
        
        setData(pyqs)
        setLoading(false)
        setError(null)
      } catch (err) {
        setError('Failed to fetch PYQs')
        setLoading(false)
        console.error(err)
      }
    }

    fetchPYQs()
    const interval = setInterval(fetchPYQs, 5000)
    
    return () => clearInterval(interval)
  }, [profile?.college, filters?.subject, filters?.year, filters?.semester, filters?.branch, filters?.examType])

  return { data, loading, error }
}

export function useTimetables(branch?: string, semester?: number) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useUserProfile()

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        if (!profile?.college) {
          setLoading(false)
          return
        }

        let q = query(collection(db, 'timetables'), where('college', '==', profile.college))
        const snapshot = await getDocs(q)
        let timetables = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        
        if (branch) timetables = timetables.filter(t => t.branch === branch)
        if (semester) timetables = timetables.filter(t => t.semester === semester)
        
        setData(timetables)
        setLoading(false)
        setError(null)
      } catch (err) {
        setError('Failed to fetch timetables')
        setLoading(false)
        console.error(err)
      }
    }

    fetchTimetables()
    const interval = setInterval(fetchTimetables, 5000)
    
    return () => clearInterval(interval)
  }, [profile?.college, branch, semester])

  return { data, loading, error }
}
