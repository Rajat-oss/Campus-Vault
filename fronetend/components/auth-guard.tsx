"use client"

import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isLandingPage = pathname === '/landing'
  const isPublicPage = isAuthPage || isLandingPage

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicPage) {
        router.push('/landing')
      } else if (user && (isAuthPage || isLandingPage)) {
        router.push('/')
      }
    }
  }, [user, loading, isPublicPage, isAuthPage, isLandingPage, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user && !isPublicPage) {
    return null
  }

  return <>{children}</>
}