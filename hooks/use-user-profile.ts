import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from './use-auth'

export interface UserProfile {
  uid: string
  email: string
  name: string
  profession: 'student' | 'faculty'
  college: string
  department?: string
  employeeId?: string
  createdAt: Date
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      // Wait for auth to complete
      if (authLoading) {
        return
      }

      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid))
        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          const data = doc.data()
          setProfile({
            ...data,
            createdAt: data.createdAt?.toDate() || new Date()
          } as UserProfile)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, authLoading])

  return { profile, loading }
}