import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useThoughts() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Query thoughts that haven't expired yet
    const now = Timestamp.now()
    const q = query(
      collection(db, 'thoughts'), 
      where('expiresAt', '>', now),
      orderBy('expiresAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const thoughts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setData(thoughts)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError('Failed to fetch thoughts')
        setLoading(false)
        console.error(err)
      }
    )

    return () => unsubscribe()
  }, [])

  return { data, loading, error }
}