import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'

export function useAnnouncements(filters?: { type?: string; isActive?: boolean }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true)
        const response = await apiService.getAnnouncements(filters)
        setData(response.announcements || [])
        setError(null)
      } catch (err) {
        setError('Failed to fetch announcements')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [filters?.type, filters?.isActive])

  return { data, loading, error }
}

export function useNotes(filters?: { subject?: string; semester?: number; branch?: string; noteType?: string }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true)
        const response = await apiService.getNotes(filters)
        setData(response.notes || [])
        setError(null)
      } catch (err) {
        setError('Failed to fetch notes')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [filters?.subject, filters?.semester, filters?.branch, filters?.noteType])

  return { data, loading, error }
}

export function usePYQs(filters?: { subject?: string; year?: number; semester?: number; branch?: string; examType?: string }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        setLoading(true)
        const response = await apiService.getPYQs(filters)
        setData(response.pyqs || [])
        setError(null)
      } catch (err) {
        setError('Failed to fetch PYQs')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPYQs()
  }, [filters?.subject, filters?.year, filters?.semester, filters?.branch, filters?.examType])

  return { data, loading, error }
}

export function useTimetables(branch?: string, semester?: number) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        setLoading(true)
        const response = await apiService.getTimetables(branch, semester)
        setData(response.timetables || [])
        setError(null)
      } catch (err) {
        setError('Failed to fetch timetables')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTimetables()
  }, [branch, semester])

  return { data, loading, error }
}