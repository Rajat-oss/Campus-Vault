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
  const isLandingPage = pathname === '/'

  useEffect(() => {
    if (!loading && !isLandingPage) {
      if (!user && !isAuthPage) {
        router.push('/')
      } else if (user && isAuthPage) {
        router.push('/home')
      }
    }
  }, [user, loading, isAuthPage, isLandingPage, router, pathname])

  if (loading && !isLandingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user && !isAuthPage && !isLandingPage) {
    return null
  }

  return <>{children}</>
}