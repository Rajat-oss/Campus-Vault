import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function usePlatformStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResources: 0,
    totalAnnouncements: 0,
    loading: true
  })

  useEffect(() => {
    let userCount = 0
    let resourceCount = 0
    let announcementCount = 0
    let completedQueries = 0

    const updateStats = () => {
      completedQueries++
      if (completedQueries === 4) {
        setStats({
          totalUsers: userCount,
          totalResources: resourceCount,
          totalAnnouncements: announcementCount,
          loading: false
        })
      }
    }

    // Count users
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      userCount = snapshot.size
      updateStats()
    })

    // Count notes
    const unsubscribeNotes = onSnapshot(collection(db, 'notes'), (snapshot) => {
      resourceCount += snapshot.size
      updateStats()
    })

    // Count PYQs
    const unsubscribePYQs = onSnapshot(collection(db, 'pyqs'), (snapshot) => {
      resourceCount += snapshot.size
      updateStats()
    })

    // Count announcements
    const unsubscribeAnnouncements = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      announcementCount = snapshot.size
      updateStats()
    })

    return () => {
      unsubscribeUsers()
      unsubscribeNotes()
      unsubscribePYQs()
      unsubscribeAnnouncements()
    }
  }, [])

  return stats
}