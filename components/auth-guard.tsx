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
<<<<<<< HEAD:components/auth-guard.tsx
  const isLandingPage = pathname === '/'

  useEffect(() => {
    if (!loading && !isLandingPage) {
      if (!user && !isAuthPage) {
=======
  const isLandingPage = pathname === '/landing'
  const isPublicPage = isAuthPage || isLandingPage

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicPage) {
        router.push('/landing')
      } else if (user && (isAuthPage || isLandingPage)) {
>>>>>>> 84c115bb5ceb770fb0454cc4d573aeb68e531020:fronetend/components/auth-guard.tsx
        router.push('/')
      } else if (user && isAuthPage) {
        router.push('/home')
      }
    }
<<<<<<< HEAD:components/auth-guard.tsx
  }, [user, loading, isAuthPage, isLandingPage, router, pathname])
=======
  }, [user, loading, isPublicPage, isAuthPage, isLandingPage, router])
>>>>>>> 84c115bb5ceb770fb0454cc4d573aeb68e531020:fronetend/components/auth-guard.tsx

  if (loading && !isLandingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

<<<<<<< HEAD:components/auth-guard.tsx
  if (!user && !isAuthPage && !isLandingPage) {
=======
  if (!user && !isPublicPage) {
>>>>>>> 84c115bb5ceb770fb0454cc4d573aeb68e531020:fronetend/components/auth-guard.tsx
    return null
  }

  return <>{children}</>
}