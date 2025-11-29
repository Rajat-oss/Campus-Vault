import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore'
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

        const params = new URLSearchParams()
        params.append('college', profile.college)
        if (filters?.subject) params.append('subject', filters.subject)
        if (filters?.semester) params.append('semester', filters.semester.toString())
        if (filters?.branch) params.append('branch', filters.branch)
        if (filters?.noteType) params.append('noteType', filters.noteType)
        
        const response = await fetch(`http://localhost:3001/api/notes?${params}`)
        const notes = await response.json()
        
        setData(Array.isArray(notes) ? notes : [])
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

        const params = new URLSearchParams()
        params.append('college', profile.college)
        if (filters?.subject) params.append('subject', filters.subject)
        if (filters?.year) params.append('year', filters.year.toString())
        if (filters?.semester) params.append('semester', filters.semester.toString())
        if (filters?.branch) params.append('branch', filters.branch)
        if (filters?.examType) params.append('examType', filters.examType)
        
        const response = await fetch(`http://localhost:3001/api/pyqs?${params}`)
        const result = await response.json()
        
        setData(result.pyqs || [])
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

        const params = new URLSearchParams()
        params.append('college', profile.college)
        if (branch) params.append('branch', branch)
        if (semester) params.append('semester', semester.toString())
        
        const response = await fetch(`http://localhost:3001/api/timetables?${params}`)
        const result = await response.json()
        
        setData(result.timetables || [])
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
